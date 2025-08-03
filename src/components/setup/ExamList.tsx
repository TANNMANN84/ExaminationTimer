import React, { useRef, useEffect } from 'react';
import Sortable from 'sortablejs';
import { useAppContext } from '../../context/AppContext';
import ExamCard from './ExamCard';
import { EXAMINATION_PRESET_TITLES, PRESET_ALIASES } from '../../constants';
import { useTooltip } from '../../context/TooltipContext';
import type { SortableEvent } from 'sortablejs';

const ExamList: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { exams, settings, sessionMode } = state;
    const listRef = useRef<HTMLDivElement>(null);
    const sortableRef = useRef<Sortable | null>(null);
    const { showTooltip, hideTooltip } = useTooltip();
    
    const listTitle = sessionMode === 'examinations' ? 'Examination List' : 'Test List';

    const handleMouseOver = (tooltipText: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if(state.ui.showTooltips) showTooltip(tooltipText, e.currentTarget);
    }

    useEffect(() => {
        if (listRef.current) {
            sortableRef.current = new Sortable(listRef.current, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt: SortableEvent) => {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                        dispatch({ type: 'REORDER_EXAMS', payload: { oldIndex: evt.oldIndex, newIndex: evt.newIndex } });
                    }
                },
            });
        }
        return () => {
            sortableRef.current?.destroy();
        };
    }, [dispatch]);

    const presetTitlesWithFiles = [...EXAMINATION_PRESET_TITLES, ...Object.keys(PRESET_ALIASES), 'NAPLAN'];
    const isPresetDisabled = !presetTitlesWithFiles.includes(settings.sessionTitle);

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{listTitle}</h2>
                    <div className="flex space-x-2">
                        <button 
                            disabled={isPresetDisabled}
                            onMouseOver={handleMouseOver("Select common exams from a predefined list.")}
                            onMouseOut={hideTooltip}
                            className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'preset' })}
                        >
                            Add from Presets
                        </button>
                        <button 
                            onMouseOver={handleMouseOver("Click to open a form and add a new custom exam to the list.")}
                            onMouseOut={hideTooltip}
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                            onClick={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' })}
                        >
                            Add Manually
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">You can drag and drop tests to reorder them.</p>
            </div>

            <div ref={listRef} className="space-y-4 flex-grow p-6 pt-0">
                {exams.length > 0 ? (
                    exams.map(exam => <ExamCard key={exam.id} exam={exam} />)
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