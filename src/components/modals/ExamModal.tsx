import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import type { Exam } from '../../types';
import Toggle from '../ui/Toggle';

interface ExamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { exams, ui: { editingExamId }, settings, sessionMode } = state;
    const isEditing = !!editingExamId;
    const isStandardised = sessionMode === 'standardised';
    const isNaplan = settings.sessionTitle === 'NAPLAN';
    
    const initialFormState = {
        name: '', readMins: 0, writeHrs: 0, writeMins: 0, optionalInfo: '',
        hasAccessCode: isNaplan,
        accessCode: '',
        sp: { studentName: '', showStudentName: false, extraTime: 0, restBreaks: 0, readerWriterTime: 0 }
    };

    const [form, setForm] = useState(initialFormState);
    const [spEnabled, setSpEnabled] = useState({
        extraTime: false,
        restBreaks: false,
        readerWriterTime: false,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            const examToEdit = exams.find(e => e.id === editingExamId);
            if (examToEdit) {
                const spData = examToEdit.sp;
                setForm({
                    name: examToEdit.name,
                    readMins: examToEdit.readMins,
                    writeHrs: examToEdit.writeHrs,
                    writeMins: examToEdit.writeMins,
                    optionalInfo: examToEdit.optionalInfo,
                    hasAccessCode: examToEdit.hasAccessCode ?? isNaplan,
                    accessCode: examToEdit.accessCode || '',
                    sp: {
                        studentName: spData.studentName,
                        showStudentName: spData.showStudentName,
                        extraTime: spData.extraTime,
                        restBreaks: spData.restBreaks,
                        readerWriterTime: spData.readerWriterTime || 0,
                    }
                });
                setSpEnabled({
                    extraTime: spData.extraTime > 0,
                    restBreaks: spData.restBreaks > 0,
                    readerWriterTime: spData.readerWriterTime > 0,
                });
            }
        } else {
            setForm({ ...initialFormState, hasAccessCode: isNaplan });
            setSpEnabled({ extraTime: false, restBreaks: false, readerWriterTime: false });
        }
        setError('');
    }, [editingExamId, exams, isOpen, isNaplan]);

    const handleSpEnableToggle = (key: keyof typeof spEnabled) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const isEnabled = e.target.checked;
        setSpEnabled(prev => ({ ...prev, [key]: isEnabled }));

        if (!isEnabled) {
            handleSpNumberChange({ target: { name: key, value: '0' } } as React.ChangeEvent<HTMLInputElement>);
        } else if (key === 'readerWriterTime') {
             const writingTime = form.writeHrs * 60 + form.writeMins;
             const calculatedRwTime = Math.floor(writingTime / 30) * 5;
             handleSpNumberChange({ target: { name: key, value: String(calculatedRwTime) } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setForm({ ...form, accessCode: sanitizedValue });
};

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: parseInt(e.target.value, 10) || 0 });
    };
    
    const handleSpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, sp: { ...form.sp, [e.target.name]: e.target.value } });
    };
    
    const handleSpNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, sp: { ...form.sp, [e.target.name]: parseInt(e.target.value, 10) || 0 } });
    };

    const handleSpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, sp: { ...form.sp, [e.target.name]: e.target.checked } });
    };

    const handleHasCodeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isEnabled = e.target.checked;
        setForm(prev => ({ ...prev, hasAccessCode: isEnabled }));
        if (!isEnabled) {
            setForm(prev => ({ ...prev, accessCode: '' }));
        }
    }

    const handleSubmit = () => {
        if (!form.name.trim()) {
            setError('Please provide a name.');
            return;
        }
        if (isStandardised && isNaplan && form.hasAccessCode && form.accessCode.length !== 8) {
            setError('NAPLAN Access Code must be 8 digits.');
            return;
        }
        setError('');

        if (isEditing) {
            const originalExam = exams.find(e => e.id === editingExamId)!;
            const updatedExam: Exam = {
                ...originalExam,
                name: form.name,
                readMins: isStandardised ? 0 : form.readMins,
                writeHrs: isStandardised ? 0 : form.writeHrs,
                writeMins: isStandardised ? 0 : form.writeMins,
                optionalInfo: form.optionalInfo,
                hasAccessCode: isStandardised ? form.hasAccessCode : false,
                accessCode: (isStandardised && form.hasAccessCode) ? form.accessCode : '',
                sp: {
                    ...originalExam.sp,
                    studentName: isStandardised ? '' : form.sp.studentName,
                    showStudentName: isStandardised ? false : form.sp.showStudentName,
                    extraTime: isStandardised ? 0 : form.sp.extraTime,
                    restBreaks: isStandardised ? 0 : form.sp.restBreaks,
                    readerWriterTime: isStandardised ? 0 : form.sp.readerWriterTime,
                }
            };
            dispatch({ type: 'UPDATE_EXAM', payload: updatedExam });
        } else {
            const newExam: Exam = {
                id: `${Date.now()}`,
                name: form.name,
                readMins: isStandardised ? 0 : form.readMins,
                writeHrs: isStandardised ? 0 : form.writeHrs,
                writeMins: isStandardised ? 0 : form.writeMins,
                optionalInfo: form.optionalInfo,
                hasAccessCode: isStandardised ? form.hasAccessCode : false,
                accessCode: (isStandardised && form.hasAccessCode) ? form.accessCode : '',
                sp: {
                    ...form.sp,
                    studentName: isStandardised ? '' : form.sp.studentName,
                    showStudentName: isStandardised ? false : form.sp.showStudentName,
                    extraTime: isStandardised ? 0 : form.sp.extraTime,
                    restBreaks: isStandardised ? 0 : form.sp.restBreaks,
                    readerWriterTime: isStandardised ? 0 : form.sp.readerWriterTime,
                    restTaken: 0,
                    onRest: false,
                    restStartTime: null,
                    readerWriterTaken: 0,
                    onReaderWriter: false,
                    readerWriterStartTime: null,
                },
                status: 'running',
                isPaused: false,
                pauseStartTime: null,
                pauseDurationTotal: 0,
            };
            dispatch({ type: 'ADD_EXAM', payload: newExam });
        }
        onClose();
    };

    const inputClasses = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1";
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel={isEditing ? 'Edit Test' : 'Add Test'}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[90vh] max-h-[800px]">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 p-6 pb-0 flex-shrink-0">{isEditing ? 'Edit Test' : 'Add Test'}</h2>
                
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className={labelClasses}>Name</label>
                            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className={inputClasses} />
                        </div>

                        {isStandardised ? (
                             <div className="space-y-4">
                                {!isNaplan && (
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="hasAccessCode" className="font-medium text-slate-600 dark:text-slate-300">Display an Access Code</label>
                                        <Toggle name="hasAccessCode" checked={form.hasAccessCode} onChange={handleHasCodeToggle} />
                                    </div>
                                )}
                                {form.hasAccessCode && (
                                     <div>
                                        <label htmlFor="accessCode" className={labelClasses}>{isNaplan ? 'Access Code (8 digits)' : 'Access Code'}</label>
                                        <input 
                                            type="text" 
                                            id="accessCode" 
                                            name="accessCode" 
                                            value={form.accessCode} 
                                            onChange={handleAccessCodeChange} 
                                            maxLength={isNaplan ? 8 : undefined} 
                                            className={`${inputClasses} font-mono tracking-widest`} 
                                            placeholder={isNaplan ? "12345678" : "Enter code"} />
                                    </div>
                                )}
                             </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="readMins" className={labelClasses}>Reading (mins)</label>
                                        <input type="number" id="readMins" name="readMins" value={form.readMins} onChange={handleNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="writeHrs" className={labelClasses}>Writing (hrs)</label>
                                        <input type="number" id="writeHrs" name="writeHrs" value={form.writeHrs} onChange={handleNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="writemins" className={labelClasses}>Writing (mins)</label>
                                        <input type="number" id="writemins" name="writeMins" value={form.writeMins} onChange={handleNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                    </div>
                                </div>
                                {settings.specialProvisions && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Special Provisions
                                        </h3>
                                        <div className="pt-2">
                                            <label htmlFor="studentName" className={labelClasses}>Student Name (Optional)</label>
                                            <input type="text" id="studentName" name="studentName" value={form.sp.studentName} onChange={handleSpChange} placeholder="e.g., Jane Doe" className={inputClasses} />
                                            <div className="flex items-center justify-between mt-2">
                                                <label htmlFor="showStudentName" className="text-sm font-medium text-slate-500 dark:text-slate-400">Show name on setup card</label>
                                                <Toggle name="showStudentName" checked={form.sp.showStudentName} onChange={handleSpToggle} />
                                            </div>
                                        </div>
                                        <div className="border-t border-blue-200 dark:border-blue-700 mt-4 pt-4">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="enableExtraTime" className="font-medium text-slate-600 dark:text-slate-300">Enable Approved Extra Time</label>
                                                <Toggle name="enableExtraTime" checked={spEnabled.extraTime} onChange={handleSpEnableToggle('extraTime')} />
                                            </div>
                                            {spEnabled.extraTime && (
                                                <div className="mt-2">
                                                    <label htmlFor="extraTime" className={labelClasses}>Approved Extra Time (mins)</label>
                                                    <input type="number" id="extraTime" name="extraTime" value={form.sp.extraTime} onChange={handleSpNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-blue-200 dark:border-blue-700 mt-4 pt-4">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="enableRestBreaks" className="font-medium text-slate-600 dark:text-slate-300">Enable Approved Rest Breaks</label>
                                                <Toggle name="enableRestBreaks" checked={spEnabled.restBreaks} onChange={handleSpEnableToggle('restBreaks')} />
                                            </div>
                                            {spEnabled.restBreaks && (
                                                <div className="mt-2">
                                                    <label htmlFor="restBreaks" className={labelClasses}>Approved Rest Breaks (mins)</label>
                                                    <input type="number" id="restBreaks" name="restBreaks" value={form.sp.restBreaks} onChange={handleSpNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-blue-200 dark:border-blue-700 mt-4 pt-4">
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="enableReaderWriterTime" className="font-medium text-slate-600 dark:text-slate-300">Enable Approved Reader/Writer Time</label>
                                                <Toggle name="enableReaderWriterTime" checked={spEnabled.readerWriterTime} onChange={handleSpEnableToggle('readerWriterTime')} />
                                            </div>
                                            {spEnabled.readerWriterTime && (
                                                <div className="mt-2">
                                                    <label htmlFor="readerWriterTime" className={labelClasses}>Approved Reader/Writer Time (mins)</label>
                                                    <input type="number" id="readerWriterTime" name="readerWriterTime" value={form.sp.readerWriterTime} onChange={handleSpNumberChange} onFocus={handleFocus} min="0" className={inputClasses} />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Defaults to 5 mins per 30 mins of writing time. You can override it.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        
                        <div>
                            <label htmlFor="optionalInfo" className={labelClasses}>Optional Information</label>
                            <textarea id="optionalInfo" name="optionalInfo" value={form.optionalInfo} onChange={handleChange} rows={2} className={inputClasses}></textarea>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 pt-2 flex-shrink-0">
                    <p className="text-red-500 text-sm mt-2 h-4">{error}</p>
                     <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">Save Test</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ExamModal;