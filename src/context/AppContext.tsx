import { createContext, useContext, useReducer, type Dispatch, type ReactNode, useEffect } from 'react';
import type { AppState, Exam, Action, SPSettings } from '../types';
import { DEFAULT_SETTINGS, SESSION_PRESETS, EXAMINATION_PRESET_TITLES, STANDARDISED_TEST_TITLES } from '../constants';
import { produce } from 'immer';
import { exportSessionLog } from '../utils/export';


// --- Helper Functions ---
const recalculateAllExamEndTimes = (draft: AppState) => {
    const now = Date.now();
    // This is the key change. All exams should start from the same point in time
    // for concurrent mode, which is the start time of the first exam.
    const sessionStartTime = draft.exams[0]?.startTime || now;

    // Global pause duration up to now
    const globalPauseDuration = draft.pauseDurationTotal + (draft.isPaused ? (now - (draft.pauseStartTime || now)) : 0);

    draft.exams.forEach(exam => {
        if (exam.status === 'abandoned') return;

        // If the exam is finished, its times are locked and shouldn't change.
        if (exam.status === 'finished') {
            return;
        }

        // All exams now start at the same time for concurrent mode.
        exam.startTime = sessionStartTime;
        
        // 1. Calculate the base duration of the exam
        const readMillis = exam.readMins * 60000;
        const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp.extraTime || 0)) * 60000;
        
        // 2. Calculate all time offsets that push the end time later
        const individualPauseDuration = exam.pauseDurationTotal + (exam.isPaused ? (now - (exam.pauseStartTime || now)) : 0);
        const restDuration = exam.sp.restTaken + (exam.sp.onRest ? (now - (exam.sp.restStartTime || now)) : 0);
        const readerWriterDuration = exam.sp.readerWriterTaken + (exam.sp.onReaderWriter ? (now - (exam.sp.readerWriterStartTime || now)) : 0);
        
        // 3. Sum all offsets. This includes time from global pauses, individual exam pauses, and any special provision breaks.
        const totalOffset = globalPauseDuration + individualPauseDuration + restDuration + readerWriterDuration;

        // 4. Calculate the final end times based on the common start time, base duration, and total offsets.
        exam.readEndTime = exam.startTime + readMillis + totalOffset;
        exam.writeEndTime = exam.readEndTime + writeMillis;
    });
};

const addLogEntry = (draft: AppState, eventDescription: string) => {
    if (!draft.isLive) return;
    const timestamp = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    draft.sessionLog.push(`[${timestamp}] ${eventDescription}`);
};

// --- Initial State ---
const initialState: AppState = {
    currentPage: 'setup',
    sessionMode: 'examinations',
    isLive: false,
    isPaused: false,
    pauseStartTime: null,
    pauseDurationTotal: 0,
    autoStartTargetTime: null,
    settings: DEFAULT_SETTINGS,
    exams: [],
    sessionLog: [],
    ui: {
        showTooltips: true,
        fabsCollapsed: false,
        fontLockEnabled: false,
        showFontControls: false,
        theme: 'system',
        activeModal: null,
        confirmAction: { type: null },
        editingExamId: null,
        disruptionTargetId: null,
    },
};

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action>; }>({
    state: initialState,
    dispatch: () => null,
});

const sanitizeLoadedExams = (exams: any[]): Exam[] => {
    if (!Array.isArray(exams)) return [];

    const defaultExamShape: Omit<Exam, 'sp'> = {
        id: '',
        name: 'Untitled Exam',
        readMins: 0,
        writeHrs: 0,
        writeMins: 0,
        optionalInfo: '',
        hasAccessCode: false,
        accessCode: '',
        status: 'running',
        isPaused: false,
        pauseStartTime: null,
        pauseDurationTotal: 0,
        startTime: undefined,
        readEndTime: undefined,
        writeEndTime: undefined,
    
    };

    const defaultSp: SPSettings = {
        studentName: '',
        showStudentName: false,
        extraTime: 0,
        restBreaks: 0,
        restTaken: 0,
        onRest: false,
        restStartTime: null,
        readerWriterTime: 0,
        readerWriterTaken: 0,
        onReaderWriter: false,
        readerWriterStartTime: null,
    };

    return exams.map((exam: any, index: number) => {
        if (typeof exam !== 'object' || exam === null) {
            exam = {};
        }

        const sanitizedExamBase = { ...defaultExamShape, ...exam };

        if (!sanitizedExamBase.id) {
            sanitizedExamBase.id = `loaded-${Date.now()}-${index}`;
        }
        if (!sanitizedExamBase.name) {
            sanitizedExamBase.name = 'Untitled Loaded Exam';
        }

        const loadedSp = exam.sp || {};
        const sanitizedSp = {
            ...defaultSp,
            ...loadedSp,
            onRest: false,
            restTaken: 0,
            restStartTime: null,
            onReaderWriter: false,
            readerWriterTaken: 0,
            readerWriterStartTime: null,
        };

        const finalExam: Exam = {
            ...sanitizedExamBase,
            sp: sanitizedSp
        };

        if (typeof finalExam.hasAccessCode === 'undefined') {
            finalExam.hasAccessCode = !!finalExam.accessCode;
        }

        return finalExam;
    });
};

// --- Reducer ---
const appReducer = (state: AppState, action: Action): AppState => {
    return produce(state, (draft: AppState) => {
        switch (action.type) {
            case 'SET_THEME': {
                draft.ui.theme = action.payload;
                break;
            }
            case 'SET_SESSION_MODE': {
                const newMode = action.payload;
                if (draft.sessionMode !== newMode) {
                    draft.sessionMode = newMode;
                    const defaultTitle = newMode === 'examinations' ? EXAMINATION_PRESET_TITLES[0] : STANDARDISED_TEST_TITLES[0];
                    draft.settings.sessionTitle = defaultTitle;
                    draft.exams = [];
                    
                    const preset = SESSION_PRESETS[defaultTitle];
                    const currentFontSizes = draft.settings.fontSizes;
                    draft.settings = { ...DEFAULT_SETTINGS, fontSizes: currentFontSizes };
                    if (preset) Object.assign(draft.settings, preset);
                    draft.settings.sessionTitle = defaultTitle;
                }
                break;
            }
            case 'UPDATE_SETTINGS': {
                const newSettings = action.payload;
                Object.assign(draft.settings, newSettings);

                if (draft.sessionMode === 'examinations' && newSettings.specialProvisions === true) {
                    draft.settings.gridLayout = 1;
                }
                break;
            }
            case 'APPLY_SESSION_PRESET': {
    const { title, clearExams } = action.payload;
    const preset = SESSION_PRESETS[title];
    const currentFontSizes = draft.settings.fontSizes;

    // ADDED LOGIC: Determine and set the correct session mode
    if (STANDARDISED_TEST_TITLES.includes(title)) {
        draft.sessionMode = 'standardised';
    } else if (EXAMINATION_PRESET_TITLES.includes(title)) {
        draft.sessionMode = 'examinations';
    }

    // Now, apply settings
    draft.settings = { ...DEFAULT_SETTINGS, fontSizes: currentFontSizes };
    if (preset) Object.assign(draft.settings, preset);
    draft.settings.sessionTitle = title;
    if (clearExams) draft.exams = [];
    break;
}
            case 'ADD_EXAM': { draft.exams.push(action.payload); break; }
            case 'ADD_EXAMS': {
                const newExams = action.payload.filter((presetExam: Exam) =>
                    !draft.exams.some((existingExam: Exam) => existingExam.name === presetExam.name)
                );
                draft.exams.push(...newExams);
                break;
            }
            case 'UPDATE_EXAM': {
                const index = draft.exams.findIndex((e: Exam) => e.id === action.payload.id);
                if (index !== -1) {
                    draft.exams[index] = action.payload;
                    if (draft.isLive && draft.sessionMode === 'examinations') recalculateAllExamEndTimes(draft);
                }
                break;
            }
            case 'DELETE_EXAM': {
                draft.exams = draft.exams.filter((e: Exam) => e.id !== action.payload);
                break;
            }
            case 'CLEAR_ALL_EXAMS': { draft.exams = []; break; }
            case 'RESET_ALL': {
                const uiState = { showTooltips: draft.ui.showTooltips, theme: draft.ui.theme };
                Object.assign(draft, initialState, { ui: { ...initialState.ui, ...uiState }});
                break;
            }
            case 'REORDER_EXAMS': {
                const { oldIndex, newIndex } = action.payload;
                const [movedItem] = draft.exams.splice(oldIndex, 1);
                draft.exams.splice(newIndex, 0, movedItem);
                if(draft.isLive && draft.sessionMode === 'examinations') recalculateAllExamEndTimes(draft);
                break;
            }
            case 'IMPORT_SESSION': {
                 const loadedData = action.payload;
                
                const sanitizedExams = sanitizeLoadedExams(loadedData.exams);
                const sanitizedSettings = { ...DEFAULT_SETTINGS, ...(loadedData.settings || {}) };

                draft.settings = sanitizedSettings;
                draft.exams = sanitizedExams;
                draft.sessionMode = loadedData.sessionMode || 'examinations';
                draft.currentPage = 'setup';
                draft.isLive = false;
                draft.isPaused = false;
                draft.autoStartTargetTime = null;
                draft.sessionLog = [];
                break;
            }
            case 'PREVIEW_EXAMS': {
                draft.currentPage = 'exam';
                draft.isLive = false;
                break;
            }
            case 'START_LIVE_SESSION': {
                draft.isLive = true;
                draft.isPaused = false;
                draft.currentPage = 'exam';
                draft.sessionLog = [];
                addLogEntry(draft, 'Session commenced.');
                
                if (draft.sessionMode === 'examinations') {
                    const sessionStartTime = Date.now();
                    draft.autoStartTargetTime = null;

                    draft.exams.forEach((exam: Exam) => {
                        exam.startTime = sessionStartTime;
                    });
                    recalculateAllExamEndTimes(draft);
                }
                break;
            }
            case 'END_SESSION': {
                if (draft.isLive) {
                     addLogEntry(draft, 'Session ended by user.');
                     exportSessionLog(draft);
                }
                draft.currentPage = 'setup';
                draft.isLive = false;
                draft.isPaused = false;
                draft.autoStartTargetTime = null;
                draft.sessionLog = [];
                draft.exams.forEach((exam: Exam) => {
                    exam.status = 'running';
                    exam.isPaused = false;
                    exam.sp.onRest = false;
                    exam.sp.restTaken = 0;
                    exam.sp.onReaderWriter = false;
                    exam.sp.readerWriterTaken = 0;
                });
                if(action.payload.shouldReset) {
                    const uiState = { showTooltips: draft.ui.showTooltips, theme: draft.ui.theme };
                    Object.assign(draft, initialState, { ui: { ...initialState.ui, ...uiState }});
                }
                break;
            }
            case 'TOGGLE_TOOLTIPS': { draft.ui.showTooltips = !draft.ui.showTooltips; break; }
            case 'TOGGLE_FONT_CONTROLS': { draft.ui.showFontControls = !draft.ui.showFontControls; break; }
            case 'TOGGLE_FONT_LOCK': { draft.ui.fontLockEnabled = !draft.ui.fontLockEnabled; break; }
            case 'TOGGLE_FABS': { draft.ui.fabsCollapsed = !draft.ui.fabsCollapsed; break; }
            case 'SET_ACTIVE_MODAL': {
                draft.ui.activeModal = action.payload;
                if (!action.payload) {
                    draft.ui.editingExamId = null;
                    draft.ui.disruptionTargetId = null;
                }
                break;
            }
            case 'SET_CONFIRM_ACTION': {
                draft.ui.confirmAction = action.payload;
                if (action.payload.type) draft.ui.activeModal = 'confirm';
                else draft.ui.activeModal = null;
                break;
            }
            case 'SET_EDITING_EXAM_ID': { draft.ui.editingExamId = action.payload; break; }
            case 'SET_DISRUPTION_TARGET': {
                draft.ui.disruptionTargetId = action.payload;
                draft.ui.activeModal = 'emergency';
                break;
            }
            case 'UPDATE_FONT_SIZE': {
                const { elementId, direction } = action.payload;
            
                const getNewSize = (id: string, defaultSize: number) => {
                    const currentSize = draft.settings.fontSizes[id] || defaultSize;
                    return Math.max(12, currentSize + (direction === 'up' ? 2 : -2));
                };
            
                if (draft.ui.fontLockEnabled) {
                    const cardPrefixes: Record<string, number> = {
                        'access-code-title-': 20,
                        'access-code-digits-': 20,
                        'exam-title-': 24,
                        'exam-times-': 20,
                        'exam-countdown-': 36,
                        'optional-info-': 14,
                    };
                    
                    let matchedPrefix: string | null = null;
                    for (const p in cardPrefixes) {
                        if (elementId.startsWith(p)) {
                            matchedPrefix = p;
                            break;
                        }
                    }
            
                    if (matchedPrefix) {
                        const newSize = getNewSize(elementId, cardPrefixes[matchedPrefix]);
                        draft.exams.forEach(exam => {
                            const key = `${matchedPrefix}${exam.id}`;
                            draft.settings.fontSizes[key] = newSize;
                        });
                    } else {
                        // Handle non-card elements or fallback
                        const defaultSize = elementId.includes('title') ? 24 : 16;
                        draft.settings.fontSizes[elementId] = getNewSize(elementId, defaultSize);
                    }
                } else {
                    // Default behavior: update only the clicked element
                    const defaultSize = elementId.includes('title') ? 24 : 16;
                    draft.settings.fontSizes[elementId] = getNewSize(elementId, defaultSize);
                }
                break;
            }
            case 'SET_AUTO_START_TIME': { draft.autoStartTargetTime = action.payload; break; }
            case 'CANCEL_AUTO_START': { draft.autoStartTargetTime = null; break; }
            case 'PAUSE_SESSION': {
                const now = Date.now();
                const { examId, justification } = action.payload;
                if (examId) {
                    const exam = draft.exams.find((e: Exam) => e.id === examId);
                    if (exam) {
                        exam.isPaused = true;
                        exam.pauseStartTime = now;
                        addLogEntry(draft, `Exam "${exam.name}" paused. Justification: ${justification}`);
                    }
                } else {
                    draft.isPaused = true;
                    draft.pauseStartTime = now;
                    addLogEntry(draft, `Session paused. Justification: ${justification}`);
                }
                break;
            }
            case 'RESUME_SESSION': {
                const now = Date.now();
                const { examId } = action.payload;
                if (examId) {
                    const exam = draft.exams.find((e: Exam) => e.id === examId);
                    if (exam && exam.pauseStartTime) {
                        exam.pauseDurationTotal += now - exam.pauseStartTime;
                        exam.isPaused = false;
                        exam.pauseStartTime = null;
                        addLogEntry(draft, `Exam "${exam.name}" resumed.`);
                    }
                } else {
                    if (draft.pauseStartTime) {
                        draft.pauseDurationTotal += now - draft.pauseStartTime;
                        draft.isPaused = false;
                        draft.pauseStartTime = null;
                        addLogEntry(draft, `Session resumed.`);
                    }
                }
                if (draft.sessionMode === 'examinations') {
                   recalculateAllExamEndTimes(draft);
                }
                break;
            }
            case 'ABANDON_EXAM': {
                const exam = draft.exams.find((e: Exam) => e.id === action.payload.examId);
                if (exam) {
                    exam.status = 'abandoned';
                    addLogEntry(draft, `Exam "${exam.name}" abandoned. Justification: ${action.payload.justification}`);
                    if (draft.sessionMode === 'examinations') {
                        recalculateAllExamEndTimes(draft);
                    }
                }
                break;
            }
            case 'TOGGLE_REST_BREAK': {
                const exam = draft.exams.find((e: Exam) => e.id === action.payload);
                if (exam) {
                    const now = Date.now();
                    if (exam.sp.onRest) {
                        exam.sp.restTaken += now - (exam.sp.restStartTime || now);
                        exam.sp.onRest = false;
                        exam.sp.restStartTime = null;
                        addLogEntry(draft, `Rest break ended for "${exam.name}".`);
                    } else {
                        exam.sp.onRest = true;
                        exam.sp.restStartTime = now;
                        addLogEntry(draft, `Rest break started for "${exam.name}".`);
                    }
                    if (draft.sessionMode === 'examinations') {
                        recalculateAllExamEndTimes(draft);
                    }
                }
                break;
            }
            case 'TOGGLE_READER_WRITER': {
                const exam = draft.exams.find((e: Exam) => e.id === action.payload);
                if (exam) {
                    const now = Date.now();
                    if (exam.sp.onReaderWriter) {
                        exam.sp.readerWriterTaken += now - (exam.sp.readerWriterStartTime || now);
                        exam.sp.onReaderWriter = false;
                        exam.sp.readerWriterStartTime = null;
                        addLogEntry(draft, `Reader/Writer session ended for "${exam.name}".`);
                    } else {
                        exam.sp.onReaderWriter = true;
                        exam.sp.readerWriterStartTime = now;
                        addLogEntry(draft, `Reader/Writer session started for "${exam.name}".`);
                    }
                    if (draft.sessionMode === 'examinations') {
                        recalculateAllExamEndTimes(draft);
                    }
                }
                break;
            }
            case 'FINISH_EXAM': {
                const exam = draft.exams.find((e: Exam) => e.id === action.payload); 
                if (exam && exam.status !== 'finished') {
                    exam.status = 'finished';
                    addLogEntry(draft, `Exam "${exam.name}" finished automatically.`);
                }
                break;
            }
            default: break;
        }
    });
};

// --- Reducer Initializer ---
const init = (initialState: AppState): AppState => {
    try {
        const savedState = localStorage.getItem('examTimerState');
        if (savedState) {
            const loaded = JSON.parse(savedState);
            
            const sanitizedExams = sanitizeLoadedExams(loaded.exams);

            const persistentUi = {
                showTooltips: loaded.ui?.showTooltips !== false,
                fontLockEnabled: loaded.ui?.fontLockEnabled || false,
                fabsCollapsed: loaded.ui?.fabsCollapsed || false,
                theme: loaded.ui?.theme || 'system',
                showFontControls: loaded.ui?.showFontControls || false,
            };

            return {
                ...initialState,
                settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) },
                exams: sanitizedExams,
                sessionMode: loaded.sessionMode || 'examinations',
                ui: {
                    ...initialState.ui,
                    ...persistentUi,
                }
            };
        }
    } catch (e) {
        console.error('Failed to load state from localStorage', e);
    }
    return initialState;
};

// --- Provider Component ---
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(appReducer, initialState, init);

    useEffect(() => {
        // Only save persistent state to localStorage
        const stateToSave = {
            settings: state.settings,
            exams: state.exams,
            sessionMode: state.sessionMode,
            ui: {
                // List only the UI state you want to persist
                showTooltips: state.ui.showTooltips,
                fontLockEnabled: state.ui.fontLockEnabled,
                fabsCollapsed: state.ui.fabsCollapsed,
                theme: state.ui.theme,
                showFontControls: state.ui.showFontControls,
            },
        };
        localStorage.setItem('examTimerState', JSON.stringify(stateToSave));
    }, [
        state.settings, 
        state.exams, 
        state.sessionMode, 
        state.ui.showTooltips, 
        state.ui.fontLockEnabled, 
        state.ui.fabsCollapsed, 
        state.ui.theme, 
        state.ui.showFontControls
    ]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);