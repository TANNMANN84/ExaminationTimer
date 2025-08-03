import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import ExamHeader from '../exam/ExamHeader';
import ExamTimerCard from '../exam/ExamTimerCard';
import ExamActions from '../exam/ExamActions';
import Sortable from 'sortablejs';
import { useExamCalculations } from '../../hooks/useExamCalculations';
import AutoStartBanner from '../exam/AutoStartBanner';
import { useTimer } from '../../hooks/useTimer';
import type { SortableEvent } from 'sortablejs';

const ExamPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { settings, exams, isLive } = state;
    const gridRef = useRef<HTMLDivElement>(null);
    const { examsToRender } = useExamCalculations();
    const { now } = useTimer();

    // 1. ADDED THIS BLOCK TO SCROLL TO TOP ON PAGE LOAD
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isLive) return;
        
        exams.forEach(exam => {
            if (exam.status === 'running' && exam.writeEndTime && now.getTime() >= exam.writeEndTime) {
                dispatch({ type: 'FINISH_EXAM', payload: exam.id });
            }
        });

    }, [exams, isLive, now, dispatch]);


    useEffect(() => {
        let sortable: Sortable | null = null;
        if (gridRef.current) {
            sortable = new Sortable(gridRef.current, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                disabled: isLive, // Disable sorting when the session is live
                onEnd: (evt: SortableEvent) => {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                        dispatch({ type: 'REORDER_EXAMS', payload: { oldIndex: evt.oldIndex, newIndex: evt.newIndex } });
                    }
                },
            });
        }
        return () => {
            sortable?.destroy();
        };
    }, [dispatch, isLive]);

    // 2. ADDED THE '2' COLUMN OPTION
    const gridLayoutClasses = {
        1: 'grid-cols-1 max-w-4xl mx-auto',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-3 xl:grid-cols-5'
    };
    
    const gridClass = gridLayoutClasses[settings.gridLayout] || gridLayoutClasses[3];

    return (
        <div className="min-h-screen p-4 md:p-6 animate-fadeIn pb-32">
            <ExamHeader />
            
            <AutoStartBanner />

            <div className="flex justify-center">
                <main ref={gridRef} className={`grid w-full gap-6 ${gridClass}`}>
                    {exams.length > 0 ? (
                        examsToRender.map(exam => (
                            <ExamTimerCard key={exam.id} exam={exam} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                            <p>No examinations have been set up.</p>
                            <button 
                                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
                                onClick={() => dispatch({type: 'END_SESSION', payload: {shouldReset: false}})}
                            >
                                Return to Setup
                            </button>
                        </div>
                    )}
                </main>
            </div>
            
            <ExamActions />
        </div>
    );
};

export default ExamPage;