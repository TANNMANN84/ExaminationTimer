import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';

interface DisruptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DisruptionModal: React.FC<DisruptionModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { exams, ui: { disruptionTargetId }, isPaused: isSessionPaused } = state;

    const [justification, setJustification] = useState('');
    const [error, setError] = useState('');

    const targetExam = disruptionTargetId ? exams.find(e => e.id === disruptionTargetId) : null;
    const isPaused = targetExam ? targetExam.isPaused : isSessionPaused;
    const modalTitle = targetExam ? `Disruption: ${targetExam.name}` : 'Session Disruption';

    useEffect(() => {
        if (!isOpen) {
            setJustification('');
            setError('');
        }
    }, [isOpen]);

    const handlePause = () => {
        if (!justification.trim()) {
            setError('Justification is required to pause.');
            return;
        }
        dispatch({ type: 'PAUSE_SESSION', payload: { justification, examId: disruptionTargetId || undefined } });
        onClose();
    };

    const handleResume = () => {
        dispatch({ type: 'RESUME_SESSION', payload: { examId: disruptionTargetId || undefined } });
        onClose();
    };
    
    const handleAbandon = () => {
        if (!justification.trim()) {
             setError('Justification is required to abandon.');
             return;
        }
        if (targetExam) {
            dispatch({ type: 'ABANDON_EXAM', payload: { justification, examId: targetExam.id } });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel={modalTitle}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l7.135 13.621a1.75 1.75 0 01-1.503 2.53H2.625a1.75 1.75 0 01-1.503-2.53L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold text-amber-500 mb-1">{modalTitle}</h2>
                        {isPaused ? (
                            <div className="mt-4">
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{targetExam ? 'EXAM PAUSED' : 'SESSION PAUSED'}</h3>
                                <p className="text-slate-600 dark:text-slate-300 my-4">The timer is currently stopped.</p>
                                <button onClick={handleResume} className="mt-4 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition">
                                    Resume {targetExam ? 'Exam' : 'Session'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">A disruption has occurred. Choose an action below.</p>
                                <div>
                                    <label htmlFor="emergency-justification" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Justification for Action</label>
                                    <textarea
                                        id="emergency-justification"
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-amber-500"
                                        placeholder="e.g., Fire alarm activated..."
                                    />
                                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button onClick={onClose} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">Cancel</button>
                                    {targetExam && (
                                        <button onClick={handleAbandon} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">Abandon Exam</button>
                                    )}
                                    <button onClick={handlePause} className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition">Pause</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DisruptionModal;