export interface SPSettings {
    studentName: string;
    showStudentName: boolean;
    extraTime: number; // in minutes
    restBreaks: number; // in minutes
    restTaken: number; // in milliseconds
    onRest: boolean;
    restStartTime: number | null;
    readerWriterTime: number; // in minutes
    readerWriterTaken: number; // in milliseconds
    onReaderWriter: boolean;
    readerWriterStartTime: number | null;
}

export interface Exam {
    id: string;
    name: string;
    readMins: number;
    writeHrs: number;
    writeMins: number;
    optionalInfo: string;
    hasAccessCode?: boolean; // For Standardised tests
    accessCode?: string; // For Standardised tests
    sp: SPSettings;
    // Live state
    status: 'running' | 'finished' | 'abandoned';
    isPaused: boolean;
    pauseStartTime: number | null;
    pauseDurationTotal: number; // in milliseconds
    // Calculated times
    startTime?: number;
    readEndTime?: number;
    writeEndTime?: number;
}

export interface CalculatedExam extends Exam {
    calculatedStatus: string;
    timeRemaining: number;
    spTimeRemaining: number;
    readerWriterTimeRemaining: number;
    cardClass: string;
}

export type GridLayout = 1 | 2| 3 | 4 | 5;

export interface Settings {
    sessionTitle: string;
    schoolName: string;
    centreNumber: string;
    showSchool: boolean;
    showCentre: boolean;
    showCrest: boolean;
    showStatus: boolean;
    showTimes: boolean;
    showCountdown: boolean;
    timeBreakdown: boolean;
    singleLineTime: boolean;
    disableTimers: boolean;
    colorAlerts: boolean;
    specialProvisions: boolean;
    showSPLive: boolean;
    showSpCountdown: boolean;
    gridLayout: GridLayout;
    showSeconds: boolean;
    crestUrl: string;
    is24hr: boolean;
    fontSizes: Record<string, number>;
}

export type Theme = 'light' | 'dark' | 'system';

// This is the corrected ModalType, including all possible modal names.
export type ModalType = 
    | 'preset' 
    | 'exam' 
    | 'confirm' 
    | 'autoStart' 
    | 'emergency' 
    | 'liveSettings' 
    | 'welcome' 
    | 'standardPreset' 
    | 'naplanWizard' 
    | 'genius';

export type ConfirmActionType = 'deleteExam' | 'clearAll' | 'resetAll' | 'endSession' | 'endAndReset' | 'abandon' | 'editLiveExam' | 'import';

export interface UiState {
    showTooltips: boolean;
    fabsCollapsed: boolean;
    fontLockEnabled: boolean;
    showFontControls: boolean;
    theme: Theme;
    activeModal: ModalType | null;
    confirmAction: {
        type: ConfirmActionType | null;
        data?: any;
    };
    editingExamId: string | null;
    disruptionTargetId: string | null;
}

export type SessionMode = 'examinations' | 'standardised';

export interface AppState {
    currentPage: 'setup' | 'exam';
    sessionMode: SessionMode;
    isLive: boolean;
    isPaused: boolean; // Global pause
    pauseStartTime: number | null;
    pauseDurationTotal: number;
    autoStartTargetTime: number | null;
    settings: Settings;
    exams: Exam[];
    sessionLog: string[];
    ui: UiState;
}

export type Action =
    | { type: 'SET_CURRENT_PAGE'; payload: 'setup' | 'exam' }
    | { type: 'SET_SESSION_MODE'; payload: SessionMode }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
    | { type: 'APPLY_SESSION_PRESET'; payload: { title: string, clearExams: boolean } }
    | { type: 'ADD_EXAM'; payload: Exam }
    | { type: 'ADD_EXAMS'; payload: Exam[] }
    | { type: 'UPDATE_EXAM'; payload: Exam }
    | { type: 'DELETE_EXAM'; payload: string }
    | { type: 'CLEAR_ALL_EXAMS' }
    | { type: 'REORDER_EXAMS'; payload: { oldIndex: number; newIndex: number } }
    | { type: 'RESET_ALL' }
    | { type: 'IMPORT_SESSION'; payload: { settings: Settings; exams: Exam[]; sessionMode?: SessionMode } }
    | { type: 'PREVIEW_EXAMS' }
    | { type: 'START_LIVE_SESSION' }
    | { type: 'END_SESSION'; payload: { shouldReset: boolean } }
    | { type: 'TOGGLE_TOOLTIPS' }
    | { type: 'TOGGLE_FONT_CONTROLS' }
    | { type: 'SET_ACTIVE_MODAL', payload: AppState['ui']['activeModal'] }
    | { type: 'SET_CONFIRM_ACTION', payload: AppState['ui']['confirmAction'] }
    | { type: 'SET_EDITING_EXAM_ID', payload: string | null }
    | { type: 'UPDATE_FONT_SIZE', payload: { elementId: string, direction: 'up' | 'down' } }
    | { type: 'TOGGLE_FONT_LOCK' }
    | { type: 'TOGGLE_FABS' }
    | { type: 'SET_THEME', payload: Theme }
    | { type: 'SET_AUTO_START_TIME', payload: number }
    | { type: 'CANCEL_AUTO_START' }
    | { type: 'PAUSE_SESSION', payload: { justification: string, examId?: string } }
    | { type: 'RESUME_SESSION', payload: { examId?: string } }
    | { type: 'ABANDON_EXAM'; payload: { examId: string, justification: string } }
    | { type: 'TOGGLE_REST_BREAK', payload: string }
    | { type: 'TOGGLE_READER_WRITER', payload: string }
    | { type: 'SET_DISRUPTION_TARGET', payload: string | null }
    | { type: 'FINISH_EXAM', payload: string };

export type ExamPresetItem = {
  name: string;
  readMins?: number;
  writeHrs?: number;
  writeMins?: number;
};

export type ExamPresetCategory = {
  [key: string]: ExamPresetItem[] | ExamPresetCategory;
};
