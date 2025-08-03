import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { EXAMINATION_PRESET_TITLES, STANDARDISED_TEST_TITLES } from '../../constants';

const SessionTitle: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { sessionMode, settings: { sessionTitle } } = state;
    
    const titles = sessionMode === 'examinations' ? EXAMINATION_PRESET_TITLES : STANDARDISED_TEST_TITLES;
    const isOther = !titles.includes(sessionTitle) && sessionTitle !== 'Other';
    
    const [localOtherTitle, setLocalOtherTitle] = useState(isOther ? sessionTitle : '');

    useEffect(() => {
        if(isOther) {
            setLocalOtherTitle(sessionTitle);
        } else {
            setLocalOtherTitle('');
        }
    }, [sessionTitle, isOther]);
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTitle = e.target.value;
        if (newTitle !== 'Other') {
            dispatch({ type: 'APPLY_SESSION_PRESET', payload: { title: newTitle, clearExams: true } });
        } else {
            dispatch({ type: 'UPDATE_SETTINGS', payload: { sessionTitle: localOtherTitle || 'Other' } });
        }
    };

    const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalOtherTitle(e.target.value);
    };

    const handleOtherInputBlur = () => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { sessionTitle: localOtherTitle || 'Other' } });
    };

    const selectValue = isOther ? 'Other' : sessionTitle;

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Session Title</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="session-title-select" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Select a title or choose "Other"</label>
                    <select 
                        id="session-title-select" 
                        value={selectValue}
                        onChange={handleSelectChange}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                    >
                        {titles.map(title => (
                           <option key={title} value={title}>{title}</option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                    {selectValue === 'Other' && (
                        <input 
                            type="text" 
                            id="session-title-other" 
                            placeholder="Specify other title"
                            value={localOtherTitle}
                            onChange={handleOtherInputChange}
                            onBlur={handleOtherInputBlur}
                            className="w-full mt-2 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionTitle;