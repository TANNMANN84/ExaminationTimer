import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import type { Settings, GridLayout } from '../../types';
import Toggle from '../ui/Toggle';

interface LiveSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveSettingsModal: React.FC<LiveSettingsModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const [localSettings, setLocalSettings] = useState(state.settings);
    const { sessionMode } = state;
    const isStandardised = sessionMode === 'standardised';

    useEffect(() => {
        if (isOpen) {
            setLocalSettings(state.settings);
        }
    }, [isOpen, state.settings]);

    const handleToggle = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSettings(prev => ({ ...prev, [key]: e.target.checked }));
    };

    const handleSelect = (key: keyof Settings) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalSettings(prev => ({ ...prev, [key]: Number(e.target.value) as GridLayout }));
    };

    const handleApply = () => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: localSettings });
        onClose();
    };

    const labelClass = "text-slate-700 dark:text-slate-300";
    const selectClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500";


    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Live Display Settings">
             <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Live Display Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="live-grid-layout" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Grid Layout</label>
                        <select id="live-grid-layout" value={localSettings.gridLayout} onChange={handleSelect('gridLayout')} className={selectClass}>
                             <option value="1">1 Column</option>
                             <option value="2">2 Columns</option>
                             <option value="3">3 Columns (Default)</option>
                             <option value="4">4 Columns</option>
                             <option value="5">5 Columns</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={labelClass}>Show school crest</span>
                        <Toggle checked={localSettings.showCrest} onChange={handleToggle('showCrest')} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={labelClass}>Show seconds on main clock</span>
                         <Toggle checked={localSettings.showSeconds} onChange={handleToggle('showSeconds')} />
                    </div>
                    {!isStandardised && (
                        <>
                             <div className="flex items-center justify-between">
                                <span className={labelClass}>Colour-coded alerts</span>
                                <Toggle checked={localSettings.colorAlerts} onChange={handleToggle('colorAlerts')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={labelClass}>Show exam status</span>
                                <Toggle checked={localSettings.showStatus} onChange={handleToggle('showStatus')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={labelClass}>Use single line for times</span>
                                <Toggle checked={localSettings.singleLineTime} onChange={handleToggle('singleLineTime')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={labelClass}>Show Special Provisions info</span>
                                <Toggle checked={localSettings.showSPLive} onChange={handleToggle('showSPLive')} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={labelClass}>Show SP countdown timers</span>
                                <Toggle checked={localSettings.showSpCountdown} onChange={handleToggle('showSpCountdown')} />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={handleApply} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">Apply & Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default LiveSettingsModal;