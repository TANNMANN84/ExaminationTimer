import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import type { Settings, GridLayout } from '../../types';
import Toggle from '../ui/Toggle';
import Accordion from '../ui/Accordion';
import SettingRow from '../ui/SettingRow';
import { CrestGraphic, GridLayoutGraphic, TimeBreakdownGraphic, ColorAlertsGraphic } from '../ui/TooltipGraphics';

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Live Display Settings">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Live Display Settings</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Changes will be applied when you click "Apply & Close".</p>
                </div>
                
                <div className="p-2 max-h-[70vh] overflow-y-auto">
                    {/* --- Accordion 1: Header & Layout --- */}
                    <Accordion title="Header & Layout" isOpenDefault>
                        <SettingRow label="Show school name" tooltip="Toggles the school name in the header.">
                            <Toggle checked={localSettings.showSchool} onChange={handleToggle('showSchool')} />
                        </SettingRow>
                        {!isStandardised && (
                            <SettingRow label="Show centre number" tooltip="Toggles the centre number in the header.">
                                <Toggle checked={localSettings.showCentre} onChange={handleToggle('showCentre')} />
                            </SettingRow>
                        )}
                        <SettingRow label="Show school crest" tooltip={<CrestGraphic />}>
                            <Toggle checked={localSettings.showCrest} onChange={handleToggle('showCrest')} />
                        </SettingRow>
                        <SettingRow label="Grid Layout" tooltip={<GridLayoutGraphic />}>
                            <select 
                                value={localSettings.gridLayout} 
                                onChange={handleSelect('gridLayout')}
                                className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                                <option value={5}>5 Columns</option>
                            </select>
                        </SettingRow>
                         <SettingRow label="Show seconds on main clock" tooltip="Toggles the display of seconds on the main header clock for precision.">
                            <Toggle checked={localSettings.showSeconds} onChange={handleToggle('showSeconds')} />
                        </SettingRow>
                    </Accordion>

                    {/* --- Accordion 2: Exam Card Display --- */}
                    {!isStandardised && (
                        <Accordion title="Exam Card Display">
                            <SettingRow label="Colour-coded alerts" tooltip={<ColorAlertsGraphic />}>
                                <Toggle checked={localSettings.colorAlerts} onChange={handleToggle('colorAlerts')} />
                            </SettingRow>
                            <SettingRow label="Show exam status" tooltip="Displays text like 'Reading Time' on each card.">
                                <Toggle checked={localSettings.showStatus} onChange={handleToggle('showStatus')} />
                            </SettingRow>
                            <SettingRow label="Use single line for times" tooltip={<TimeBreakdownGraphic />}>
                                <Toggle checked={localSettings.singleLineTime} onChange={handleToggle('singleLineTime')} />
                            </SettingRow>
                            <SettingRow label="Show Reading/Writing breakdown" tooltip="Separately displays the start and end times for both reading and writing periods." subOption>
                                <Toggle checked={localSettings.timeBreakdown} onChange={handleToggle('timeBreakdown')} />
                            </SettingRow>
                        </Accordion>
                    )}
                    
                    {/* --- Accordion 3: Special Provisions --- */}
                    {state.settings.specialProvisions && !isStandardised && (
                        <Accordion title="Special Provisions">
                            <SettingRow label="Show Special Provisions info" tooltip="Shows the SP controls and timers on each card.">
                                <Toggle checked={localSettings.showSPLive} onChange={handleToggle('showSPLive')} />
                            </SettingRow>
                             <SettingRow label="Show SP countdown timers" tooltip="Shows live countdowns for active rest breaks or reader/writer time.">
                                <Toggle checked={localSettings.showSpCountdown} onChange={handleToggle('showSpCountdown')} />
                            </SettingRow>
                        </Accordion>
                    )}
                </div>

                <div className="p-6 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        Apply & Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LiveSettingsModal;
