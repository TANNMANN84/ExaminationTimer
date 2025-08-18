import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import type { Exam, SPSettings } from '../../types';

interface NaplanWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NaplanWizardModal: React.FC<NaplanWizardModalProps> = ({ isOpen, onClose }) => {
    const { dispatch } = useAppContext();
    
    const [naplanStep, setNaplanStep] = useState<'year' | 'test' | 'codes'>('year');
    const [naplanYear, setNaplanYear] = useState<7 | 9 | null>(null);
    const [catchupName, setCatchupName] = useState('');
    const [catchupCode, setCatchupCode] = useState('');
    
    const [examsToCode, setExamsToCode] = useState<Exam[]>([]);
    const [codeIndex, setCodeIndex] = useState(0);

    // Reset local state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setNaplanYear(null);
            setCatchupName('');
            setCatchupCode('');
            setNaplanStep('year');
            setExamsToCode([]);
            setCodeIndex(0);
        }
    }, [isOpen]);

    const handleAddNaplanGroup = (testType: string) => {
        if (!naplanYear) return;

        const groups = ['(A-E)', '(F-L)', '(M-S)', '(T-Z)'];
        const defaultSp: SPSettings = {
            studentName: '', showStudentName: false, extraTime: 0,
            restBreaks: 0, restTaken: 0, onRest: false, restStartTime: null,
            readerWriterTime: 0, readerWriterTaken: 0, onReaderWriter: false, readerWriterStartTime: null,
        };

        const examsToAdd: Exam[] = groups.map(group => {
            const name = `Year ${naplanYear} ${group} - ${testType}`;
            return {
                id: `${Date.now()}-${name}`,
                name: name, readMins: 0, writeHrs: 0, writeMins: 0, optionalInfo: '',
                hasAccessCode: true, // <-- 1. ADDED THIS LINE
                accessCode: '', 
                sp: { ...defaultSp }, status: 'running', isPaused: false,
                pauseStartTime: null, pauseDurationTotal: 0,
            };
        });
        
        setExamsToCode(examsToAdd);
        setCodeIndex(0);
        setNaplanStep('codes');
    };

    const handleCodeInputChange = (code: string) => {
    const sanitizedCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setExamsToCode(prevExams => 
        prevExams.map((exam, index) => 
            index === codeIndex 
                ? { ...exam, accessCode: sanitizedCode } 
                : exam
        )
    );
};
    
    const handleNextOrSkip = () => {
        if(codeIndex < examsToCode.length - 1) {
            setCodeIndex(codeIndex + 1);
        } else {
            handleFinishCodeEntry();
        }
    };

    const handleFinishCodeEntry = () => {
        dispatch({ type: 'ADD_EXAMS', payload: examsToCode });
        onClose();
    };

    const handleAddCatchup = () => {
        if (!catchupName.trim()) return;

        const defaultSp: SPSettings = {
            studentName: '', showStudentName: false, extraTime: 0,
            restBreaks: 0, restTaken: 0, onRest: false, restStartTime: null,
            readerWriterTime: 0, readerWriterTaken: 0, onReaderWriter: false, readerWriterStartTime: null,
        };

        const examToAdd: Exam = {
            id: `${Date.now()}-${catchupName}`,
            name: catchupName.trim(),
            readMins: 0, writeHrs: 0, writeMins: 0, optionalInfo: '',
            hasAccessCode: true, // <-- 2. ADDED THIS LINE
            accessCode: catchupCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
            sp: { ...defaultSp },
            status: 'running', isPaused: false, pauseStartTime: null, pauseDurationTotal: 0,
        };

        dispatch({ type: 'ADD_EXAM', payload: examToAdd });
        setCatchupName('');
        setCatchupCode('');
    };

    const testTypes = ['Writing', 'Reading', 'Conventions of Language', 'Numeracy'];
    const buttonClass = "w-full text-left p-4 rounded-lg font-bold text-lg transition duration-200";
    const activeClass = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md";
    const inactiveClass = "bg-indigo-200 text-indigo-800 hover:bg-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900";
    
    const renderContent = () => {
        if (naplanStep === 'codes') {
            const currentExam = examsToCode[codeIndex];
            return (
                <div className="text-center">
                    <button onClick={() => setNaplanStep('test')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-4">&larr; Back to Test Selection</button>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Enter Access Code ({codeIndex + 1}/{examsToCode.length})</h3>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{currentExam?.name}</p>
                    <input
                        type="text"
                        value={currentExam?.accessCode || ''}
                        onChange={(e) => handleCodeInputChange(e.target.value)}
                        maxLength={8}
                        className="w-full max-w-sm mx-auto p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500 text-2xl font-mono tracking-[.2em] text-center"
                        placeholder="12345678"
                        autoFocus
                    />
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={handleNextOrSkip} className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">Skip</button>
                        <button onClick={handleNextOrSkip} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition">
                            {codeIndex === examsToCode.length - 1 ? 'Finish & Add' : 'Next'}
                        </button>
                    </div>
                     <button onClick={handleFinishCodeEntry} className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:underline">Finish & Add All</button>
                </div>
            )
        }

        return (
            <div>
                {naplanStep === 'year' ? (
                    <>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">1. Select Year Level</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button onClick={() => { setNaplanYear(7); setNaplanStep('test'); }} className={`${buttonClass} ${naplanYear === 7 ? activeClass : inactiveClass}`}>Year 7</button>
                            <button onClick={() => { setNaplanYear(9); setNaplanStep('test'); }} className={`${buttonClass} ${naplanYear === 9 ? activeClass : inactiveClass}`}>Year 9</button>
                        </div>
                    </>
                ) : (
                    <>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">2. Add Test Groups for <span className="text-indigo-600 dark:text-indigo-400">Year {naplanYear}</span></h3>
                            <button onClick={() => { setNaplanYear(null); setNaplanStep('year'); }} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Change Year</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {testTypes.map(type => (
                                <div key={type} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex justify-between items-center border border-slate-200 dark:border-slate-600">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{type}</span>
                                    <button onClick={() => handleAddNaplanGroup(type)} className="px-4 py-2 text-sm bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition">Add All Groups</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="mt-8 border-t border-slate-300 dark:border-slate-700 pt-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Add a Catch-up Exam</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">For individual students taking a test outside of the main groups.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input 
                            type="text" 
                            value={catchupName}
                            onChange={(e) => setCatchupName(e.target.value)}
                            placeholder="e.g., Catch-up Numeracy"
                            className="md:col-span-2 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500"
                        />
                         <input 
                            type="text" 
                            value={catchupCode}
                            onChange={(e) => setCatchupCode(e.target.value)}
                            maxLength={8}
                            placeholder="Access Code"
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                    </div>
                     <button onClick={handleAddCatchup} disabled={!catchupName.trim()} className="mt-2 w-full md:w-auto px-6 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50">Add Catch-up Exam</button>
                </div>
            </div>
        );
    }

     return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="NAPLAN Setup Assistant">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg shadow-xl p-8 w-full max-w-5xl flex flex-col h-[85vh]">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex-shrink-0">NAPLAN Setup Assistant</h2>
                <div className="flex-grow bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 -mx-2 overflow-y-auto">
                    {renderContent()}
                </div>
                <div className="flex justify-end space-x-4 mt-6 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default NaplanWizardModal;
