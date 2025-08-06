import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import ExamTimerCard from '../exam/ExamTimerCard';
import ExamHeader from '../exam/ExamHeader';
import ExamActions from '../exam/ExamActions';
import AutoStartBanner from '../exam/AutoStartBanner';

const ExamPage: React.FC = () => {
    const { state } = useAppContext();
    const { exams, settings } = state;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const gridLayoutClasses = {
        '1': 'grid-cols-1 max-w-4xl mx-auto',
        '2': 'grid-cols-1 md:grid-cols-2',
        '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        '4': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
        '5': 'grid-cols-1 md:grid-cols-3 xl:grid-cols-5'
    };
    
    // --- FIX: The grid layout now ALWAYS uses the value from settings ---
    const layout = settings.gridLayout;
    const gridClass = gridLayoutClasses[layout] || gridLayoutClasses['3'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50">
            <ExamHeader />
            
            <main className="p-4 md:p-6">
                <AutoStartBanner />
                <div className={`grid ${gridClass} gap-6`}>
                    {exams.map(exam => (
                        <ExamTimerCard key={exam.id} exam={exam} />
                    ))}
                </div>
            </main>

            <ExamActions />
        </div>
    );
};

export default ExamPage;
