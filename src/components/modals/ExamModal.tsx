import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Exam, SPSettings } from '../../types';
import Modal from '../ui/Modal';
import Toggle from '../ui/Toggle';

interface ExamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { editingExamId, exams, settings } = state;

    const isEditing = editingExamId !== null;
    const initialExamState: Exam = {
        id: `exam-${Date.now()}`,
        name: '',
        readMins: 10,
        writeHrs: 1,
        writeMins: 30,
        optionalInfo: '',
        hasAccessCode: false,
        accessCode: '',
        status: 'running',
        isPaused: false,
        pauseStartTime: null,
        pauseDurationTotal: 0,
        sp: {
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
        },
    };

    const [exam, setExam] = useState<Exam>(initialExamState);

    useEffect(() => {
        if (isOpen) {
            const examToEdit = exams.find(e => e.id === editingExamId);
            setExam(examToEdit || initialExamState);
        } else {
            setExam(initialExamState); // Reset form when modal is closed
        }
    }, [isOpen, editingExamId, exams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExam(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExam(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };
    
    const handleSpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExam(prev => ({ ...prev, sp: { ...prev.sp, [name]: parseInt(value, 10) || 0 } }));
    };

    const handleToggle = (key: keyof Exam) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setExam(prev => ({...prev, [key]: e.target.checked}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            dispatch({ type: 'UPDATE_EXAM', payload: exam });
        } else {
            dispatch({ type: 'ADD_EXAM', payload: exam });
        }
        onClose();
    };

    const inputClasses = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel={isEditing ? 'Edit Exam' : 'Add Exam'}>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                            {isEditing ? 'Edit Examination' : 'Add New Examination'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className={labelClasses}>Exam Name</label>
                                <input type="text" id="name" name="name" value={exam.name} onChange={handleChange} className={inputClasses} required />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="readMins" className={labelClasses}>Reading (mins)</label>
                                    <input type="number" id="readMins" name="readMins" value={exam.readMins} onChange={handleNumberChange} className={inputClasses} min="0" />
                                </div>
                                <div>
                                    <label htmlFor="writeHrs" className={labelClasses}>Writing (hrs)</label>
                                    <input type="number" id="writeHrs" name="writeHrs" value={exam.writeHrs} onChange={handleNumberChange} className={inputClasses} min="0" />
                                </div>
                                <div>
                                    <label htmlFor="writeMins" className={labelClasses}>Writing (mins)</label>
                                    <input type="number" id="writeMins" name="writeMins" value={exam.writeMins} onChange={handleNumberChange} className={inputClasses} min="0" />
                                </div>
                            </div>
                            
                             <div>
                                <label htmlFor="optionalInfo" className={labelClasses}>Optional Info</label>
                                <textarea id="optionalInfo" name="optionalInfo" value={exam.optionalInfo} onChange={handleChange} className={inputClasses} rows={2}></textarea>
                            </div>

                            {settings.specialProvisions && (
                                <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-4">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Special Provisions</h3>
                                     <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="extraTime" className={labelClasses}>Extra Time (mins)</label>
                                            <input type="number" id="extraTime" name="extraTime" value={exam.sp.extraTime} onChange={handleSpChange} className={inputClasses} min="0" />
                                        </div>
                                        <div>
                                            <label htmlFor="restBreaks" className={labelClasses}>Rest Breaks (mins)</label>
                                            <input type="number" id="restBreaks" name="restBreaks" value={exam.sp.restBreaks} onChange={handleSpChange} className={inputClasses} min="0" />
                                        </div>
                                         <div>
                                            <label htmlFor="readerWriterTime" className={labelClasses}>R/W Time (mins)</label>
                                            <input type="number" id="readerWriterTime" name="readerWriterTime" value={exam.sp.readerWriterTime} onChange={handleSpChange} className={inputClasses} min="0" />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="p-6 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">
                            {isEditing ? 'Save Changes' : 'Add Exam'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ExamModal;
