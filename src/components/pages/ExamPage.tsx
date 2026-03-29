import React, { useEffect } from 'react';
import { useStore } from '../../context/useStore';
import ExamHeader from '../exam/ExamHeader';
import ExamTimerCard from '../exam/ExamTimerCard';
import ExamActions from '../exam/ExamActions';
import { useExamCalculations } from '../../hooks/useExamCalculations';
import AutoStartBanner from '../exam/AutoStartBanner';
import { useTimer } from '../../hooks/useTimer';
import type { CalculatedExam } from '../../types';
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
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExamWrapper: React.FC<{ exam: CalculatedExam; disabled: boolean }> = ({ exam, disabled }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exam.id, disabled });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
            <ExamTimerCard exam={exam} />
        </div>
    );
};

const ExamPage: React.FC = () => {
    const dispatch = useStore(state => state.dispatch);
    const settings = useStore(state => state.settings);
    const exams = useStore(state => state.exams);
    const isLive = useStore(state => state.isLive);
    const isSessionPaused = useStore(state => state.isPaused);
    
    const { examsToRender } = useExamCalculations();
    const { now } = useTimer();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isLive) return;
        
        exams.forEach(exam => {
            const isEffectivelyPaused = exam.isPaused || isSessionPaused || exam.sp.onRest || exam.sp.onReaderWriter;

            if (!isEffectivelyPaused && exam.status === 'running' && exam.writeEndTime && now.getTime() >= exam.writeEndTime) {
                dispatch({ type: 'FINISH_EXAM', payload: exam.id });
            }
        });

    }, [exams, isLive, isSessionPaused, now, dispatch]);

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

    const gridLayoutClasses = {
        '1': 'grid-cols-1 max-w-4xl mx-auto',
        '2': 'grid-cols-1 md:grid-cols-2',
        '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        '4': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
        '5': 'grid-cols-1 md:grid-cols-3 xl:grid-cols-5'
    };
    
    const gridClass = gridLayoutClasses[settings.gridLayout] || gridLayoutClasses[3];

    return (
        <div className="h-full p-4 md:p-6 animate-fadeIn pb-32">
            <ExamHeader />
            
            <AutoStartBanner />

            <div className="flex justify-center">
                <main className={`grid w-full gap-6 ${gridClass}`}>
                    {exams.length > 0 ? (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={examsToRender.map(e => e.id)} strategy={rectSortingStrategy}>
                                {examsToRender.map(exam => (
                                    <SortableExamWrapper key={exam.id} exam={exam} disabled={isLive} />
                                ))}
                            </SortableContext>
                        </DndContext>
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
