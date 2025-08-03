import React from 'react';
import type { Exam } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface ExamCardProps {
    exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
    const { state, dispatch } = useAppContext();
    const { settings, sessionMode } = state;
    const isStandardised = sessionMode === 'standardised';

    const handleEdit = () => {
        dispatch({ type: 'SET_EDITING_EXAM_ID', payload: exam.id });
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' });
    };

    const handleDelete = () => {
        dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'deleteExam', data: exam.id } });
    };

    const spInfo = settings.specialProvisions && (exam.sp.extraTime > 0 || exam.sp.restBreaks > 0)
        ? (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full">
                SP
                {exam.sp.showStudentName && exam.sp.studentName && ` (${exam.sp.studentName})`}
            </span>
          )
        : null;

    // --- THIS FUNCTION HAS BEEN CORRECTED ---
    const formatAccessCode = (code: string) => {
        // First, clean the code to be only uppercase letters and numbers
        const cleaned = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
        if (settings.sessionTitle === 'NAPLAN') {
            // Apply NAPLAN's specific xxx-xx-xxx format
            const parts = [
                cleaned.substring(0, 3),
                cleaned.substring(3, 5),
                cleaned.substring(5, 8)
            ];
            return parts.filter(p => p).join('-');
        }
        
        // For all other test types, just return the clean, uppercase code
        return cleaned;
    };

    return (
        <div className={`flex items-center justify-between p-4 border rounded-lg cursor-grab hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${isStandardised ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-900' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}>
            <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center">
                    {exam.name} {spInfo}
                </p>
                {isStandardised ? (
                    exam.hasAccessCode ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Access Code: {(exam.accessCode || '').trim() ?
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{formatAccessCode(exam.accessCode!)}</span> :
                                <span className="font-semibold text-red-600">Not Set</span>
                            }
                        </p>
                    ) : null
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Read: {exam.readMins}m, Write: {exam.writeHrs}h {exam.writeMins}m
                    </p>
                )}
            </div>
            <div className="flex space-x-2">
                <button onClick={handleEdit} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label={`Edit ${exam.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button onClick={handleDelete} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition" aria-label={`Delete ${exam.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        </div>
    );
};

export default ExamCard;