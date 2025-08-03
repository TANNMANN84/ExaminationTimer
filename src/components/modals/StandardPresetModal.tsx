import React, { useState, useEffect, type JSX } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import { PRESET_ALIASES, EXAM_PRESETS } from '../../constants';
import type { Exam, ExamPresetItem, ExamPresetCategory, SPSettings } from '../../types';

interface StandardPresetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomCheckbox: React.FC<{ name: string, checked: boolean, onChange: () => void, fullName: string }> = ({ name, checked, onChange, fullName }) => (
    <div className="flex items-center w-full">
        <label htmlFor={`preset-${fullName}`} className="flex items-center cursor-pointer text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition w-full">
            <input
                type="checkbox"
                id={`preset-${fullName}`}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div className={`w-5 h-5 mr-3 flex-shrink-0 border-2 rounded ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'}`}>
                {checked && <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span>{name}</span>
        </label>
    </div>
);


const StandardPresetModal: React.FC<StandardPresetModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const { settings } = state;
    
    const [selected, setSelected] = useState<Record<string, { preset: ExamPresetItem, name: string }>>({});
    
    const sessionTitle = settings.sessionTitle;
    const presetFileName = PRESET_ALIASES[sessionTitle] || sessionTitle;
    const presets = EXAM_PRESETS[presetFileName] || null;

    useEffect(() => {
        if (!isOpen) {
            setSelected({});
        }
    }, [isOpen]);


    const handleToggle = (fullName: string, presetItem: ExamPresetItem) => {
        const finalName = presetItem.name;

        setSelected(prev => {
            const newSelected = { ...prev };
            if (newSelected[fullName]) {
                delete newSelected[fullName];
            } else {
                newSelected[fullName] = { preset: presetItem, name: finalName };
            }
            return newSelected;
        });
    };
    
    const handleAddSelected = () => {
        const defaultSp: SPSettings = {
            studentName: '', showStudentName: false, extraTime: 0, 
            restBreaks: 0, restTaken: 0, onRest: false, restStartTime: null,
            readerWriterTime: 0, readerWriterTaken: 0, onReaderWriter: false, readerWriterStartTime: null,
        };

        const examsToAdd: Exam[] = Object.values(selected)
            .map(({ preset, name }) => ({
                id: `${Date.now()}-${name}`,
                name: preset.name, // Use the original name from the preset
                readMins: preset?.readMins ?? 0,
                writeHrs: preset?.writeHrs ?? 0,
                writeMins: preset?.writeMins ?? 0,
                optionalInfo: '',
                accessCode: '',
                sp: defaultSp,
                status: 'running',
                isPaused: false,
                pauseStartTime: null,
                pauseDurationTotal: 0,
            }));
        
        if (examsToAdd.length > 0) {
            dispatch({ type: 'ADD_EXAMS', payload: examsToAdd });
        }
        
        onClose();
    };
    
    const renderPresetList = (data: ExamPresetCategory, prefix: string[] = []): JSX.Element[] => {
        return Object.keys(data).map(key => {
            const value = data[key] as ExamPresetItem[] | ExamPresetCategory;
            const currentPrefix = prefix;
    
            const isYearGrouped = typeof value === 'object' && !Array.isArray(value) &&
                                  Object.keys(value).includes('Year 11') &&
                                  Object.keys(value).includes('Year 12');

            if (isYearGrouped) {
                const year11Exams = (value as ExamPresetCategory)['Year 11'] as ExamPresetItem[];
                const year12Exams = (value as ExamPresetCategory)['Year 12'] as ExamPresetItem[];
    
                return (
                    <div key={key} className="mt-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">{key}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <h4 className="font-semibold text-slate-600 dark:text-slate-400 mb-2 border-b border-slate-300 dark:border-slate-600 pb-1">Year 11</h4>
                                <div className="space-y-3">
                                    {year11Exams.map((item, index) => {
                                        const fullName = [...currentPrefix, key, 'Year 11', item.name].join(' - ');
                                        return (
                                            <CustomCheckbox
                                                key={`${fullName}-${index}`}
                                                name={item.name}
                                                checked={!!selected[fullName]}
                                                onChange={() => handleToggle(fullName, item)}
                                                fullName={fullName}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-600 dark:text-slate-400 mb-2 border-b border-slate-300 dark:border-slate-600 pb-1">Year 12</h4>
                                 <div className="space-y-3">
                                    {year12Exams.map((item, index) => {
                                        const fullName = [...currentPrefix, key, 'Year 12', item.name].join(' - ');
                                        return (
                                            <CustomCheckbox
                                                key={`${fullName}-${index}`}
                                                name={item.name}
                                                checked={!!selected[fullName]}
                                                onChange={() => handleToggle(fullName, item)}
                                                fullName={fullName}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            if (Array.isArray(value)) {
                return (
                    <div key={key} className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{key}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {value.map((item, index) => {
                                 const fullName = item.name.startsWith(key) ? item.name : [...currentPrefix, key, item.name].join(' - ');
                                return (
                                    <CustomCheckbox
                                        key={`${fullName}-${index}`}
                                        name={item.name}
                                        checked={!!selected[fullName]}
                                        onChange={() => handleToggle(fullName, item)}
                                        fullName={fullName}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            } 
            
            // Recursive case for other nested objects
            const newPrefix = [...prefix, key];
            return (
                <div key={newPrefix.join('-')} className={prefix.length > 0 ? 'pl-4 border-l-2 border-slate-200 dark:border-slate-700' : ''}>
                     <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mt-6 mb-3">{key}</h3>
                    {renderPresetList(value as ExamPresetCategory, newPrefix)}
                </div>
            );
            
        });
    };

    const renderContent = () => {
        if (!presets) {
            return <p className="text-center text-slate-500 dark:text-slate-400 py-10">No presets available for this session type.</p>;
        }
        
        return renderPresetList(presets);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Select Preset Exams">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg shadow-xl p-8 w-full max-w-5xl flex flex-col h-[85vh]">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex-shrink-0">Select Preset Exams</h2>
                <div className="flex-grow bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 -mx-2 overflow-y-auto">
                    {renderContent()}
                </div>
                <div className="flex justify-end space-x-4 mt-6 flex-shrink-0">
                    <button onClick={onClose} className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition">Cancel</button>
                    <button 
                        onClick={handleAddSelected} 
                        disabled={Object.keys(selected).length === 0}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition shadow disabled:opacity-50"
                    >
                        Add {Object.keys(selected).length > 0 ? Object.keys(selected).length : ''} Selected
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default StandardPresetModal;