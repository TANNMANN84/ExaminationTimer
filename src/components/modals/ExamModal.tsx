import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Exam } from '../../types';
import Modal from '../ui/Modal';
import ColourModal from './ColourModal'; // --- FIX: Import the new modal ---
import { CARD_COLORS } from '../../constants';

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
    
    // --- FIX: Manage the state for the new ColourModal ---
    const [isColourModalOpen, setIsColourModalOpen] = useState(false);
    
    const initialFormState = {
        name: '', readMins: 0, writeHrs: 0, writeMins: 0, optionalInfo: '',
        color: 'Default',
        hasAccessCode: isNaplan,
        accessCode: '',
        sp: { studentName: '', showStudentName: false, extraTime: 0, restBreaks: 0, readerWriterTime: 0 }
    };

    const [form, setForm] = useState(initialFormState);
    const [spEnabled, setSpEnabled] = useState({ extraTime: false, restBreaks: false, readerWriterTime: false });
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
                    color: examToEdit.color || 'Default',
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

    // ... (All other handlers are the same)
    
    const handleColorSelect = (colorName: string) => {
        setForm({ ...form, color: colorName });
    };

    const handleSubmit = () => {
        // ... (handleSubmit logic is unchanged)
    };
    
    const selectedColor = CARD_COLORS.find(c => c.name === form.color) || CARD_COLORS[0];

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} ariaLabel={isEditing ? 'Edit Test' : 'Add Test'}>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[90vh] max-h-[800px]">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 p-6 pb-0 flex-shrink-0">{isEditing ? 'Edit Test' : 'Add Test'}</h2>
                    
                    <div className="flex-grow overflow-y-auto p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Name</label>
                                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            
                            {/* --- FIX: REPLACED COLOR SELECTOR WITH A BUTTON --- */}
                            {!isStandardised && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Card Color</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsColourModalOpen(true)}
                                        className={`w-full p-2 rounded-md border-2 flex items-center justify-between ${selectedColor.bg} ${selectedColor.darkBg} ${selectedColor.border} ${selectedColor.darkBorder}`}
                                    >
                                        <span className={`font-semibold ${selectedColor.text} ${selectedColor.darkText}`}>{form.color}</span>
                                        <div className={`w-6 h-6 rounded-md ${selectedColor.bg} ${selectedColor.darkBg} border ${selectedColor.border} ${selectedColor.darkBorder}`}></div>
                                    </button>
                                </div>
                            )}

                             {/* ... (rest of the form remains the same) ... */}
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
            
            {/* --- FIX: RENDER THE NEW COLOUR MODAL --- */}
            <ColourModal
                isOpen={isColourModalOpen}
                onClose={() => setIsColourModalOpen(false)}
                onSelectColour={handleColorSelect}
                currentColour={form.color}
            />
        </>
    );
};

export default ExamModal;
