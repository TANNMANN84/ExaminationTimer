import React from 'react';
import { useStore } from '../../context/useStore';
import ExamCard from './ExamCard';
import { EXAMINATION_PRESET_TITLES, PRESET_ALIASES } from '../../constants';
import { useTooltip } from '../../context/TooltipContext';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExamListCard: React.FC<{ exam: any }> = ({ exam }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exam.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ExamCard exam={exam} />
        </div>
    );
};

const ExamList: React.FC = () => {
    const dispatch = useStore(state => state.dispatch);
    const exams = useStore(state => state.exams);
    const settings = useStore(state => state.settings);
    const sessionMode = useStore(state => state.sessionMode);
    const showTooltips = useStore(state => state.ui.showTooltips);
    const { showTooltip, hideTooltip } = useTooltip();
    
    const listTitle = sessionMode === 'examinations' ? 'Examination List' : 'Test List';

    const handleMouseOver = (tooltipText: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if(showTooltips) showTooltip(tooltipText, e.currentTarget);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = exams.findIndex((e) => e.id === active.id);
            const newIndex = exams.findIndex((e) => e.id === over.id);
            dispatch({ type: 'REORDER_EXAMS', payload: { oldIndex, newIndex } });
        }
    };

    const handlePresetClick = () => {
        const title = settings.sessionTitle.toLowerCase();

        if (sessionMode === 'standardised') {
            if (title.includes('naplan')) {
                dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'naplanWizard' });
                return;
            }
            if (title.includes('check-in') || title.includes('check in')) {
                dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'checkInWizard' });
                return;
            }
        }
        
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'preset' });
    };

    const presetTitlesWithFiles = [...EXAMINATION_PRESET_TITLES, ...Object.keys(PRESET_ALIASES), 'NAPLAN'];
    const lowerCaseTitle = settings.sessionTitle.toLowerCase();
    const isPresetDisabled = !presetTitlesWithFiles.includes(settings.sessionTitle) && !lowerCaseTitle.includes('check-in');

    let presetButtonText = 'Add from Presets';
    if (sessionMode === 'standardised' && (lowerCaseTitle.includes('naplan') || lowerCaseTitle.includes('check-in') || lowerCaseTitle.includes('check in'))) {
        presetButtonText = 'Exam Setup Wizard';
    }

    // 1. Define the dynamic primary button colour based on the session mode
    const primaryButtonClass = sessionMode === 'examinations' 
        ? "bg-indigo-600 hover:bg-indigo-700" 
        : "bg-teal-600 hover:bg-teal-700";


    return (
        <>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{listTitle}</h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button 
                            disabled={isPresetDisabled}
                            onMouseOver={handleMouseOver("Select common exams from a predefined list.")}
                            onMouseOut={hideTooltip}
                            className="flex-1 sm:flex-none px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handlePresetClick}
                        >
                            {presetButtonText}
                        </button>
                        <button 
                            onMouseOver={handleMouseOver("Click to open a form and add a new custom exam to the list.")}
                            onMouseOut={hideTooltip}
                            // 2. Apply the dynamic class here
                            className={`flex-1 sm:flex-none px-4 py-2 text-white font-semibold rounded-md transition ${primaryButtonClass}`}
                            onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' })}
                        >
                            Add Manually
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">You can drag and drop tests to reorder them.</p>
            </div>

            <div className="space-y-4 flex-grow p-6 pt-0">
                {exams.length > 0 ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={exams.map(e => e.id)} strategy={verticalListSortingStrategy}>
                            {exams.map(exam => <SortableExamListCard key={exam.id} exam={exam} />)}
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex-grow flex flex-col justify-center items-center">
                        <p>No tests added yet.</p>
                        <p>Click "Add Manually" or "Add from Presets" to get started.</p>
                    </div>
                )}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-6 px-6 py-4">
                <button 
                    onMouseOver={handleMouseOver("Removes all tests from the current session. This cannot be undone.")}
                    onMouseOut={hideTooltip}
                    className="w-full px-4 py-2 text-red-600 font-semibold rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                    onClick={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'clearAll' }})}
                >
                    Clear All Tests
                </button>
            </div>
        </>
    );
};

export default ExamList;