import React from 'react';
import { useAppContext } from '../../context/AppContext';
import type { GridLayout, Settings } from '../../types';
import Accordion from '../ui/Accordion';
import SettingRow from '../ui/SettingRow';
import Toggle from '../ui/Toggle';
import { ColorAlertsGraphic, CrestGraphic, GridLayoutGraphic, TimeBreakdownGraphic, TimeFormatGraphic } from '../ui/TooltipGraphics';

const DisplayOptions: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { settings, sessionMode } = state;

    const isStandardised = sessionMode === 'standardised';

    const handleSettingChange = (key: keyof Settings, value: any) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
    };

    const handleInputChange = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSettingChange(key, e.target.value);
    };

    const handleToggle = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSettingChange(key, e.target.checked);
    };

    const handleSelect = (key: keyof Settings) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleSettingChange(key, Number(e.target.value) as GridLayout);
    };

    // --- FIX: Create a specific handler for the Special Provisions toggle ---
    const handleSpecialProvisionsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isEnabled = e.target.checked;
        const newSettings: Partial<Settings> = { specialProvisions: isEnabled };

        // If turning SP on for the first time, default to 1 column.
        // This logic is now in the UI, not hidden in the reducer.
        if (isEnabled) {
            newSettings.gridLayout = '1';
        }

        dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    };
    
    const inputClasses = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 p-6 pb-4">Display Options</h2>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <Accordion title="Header Content">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="schoolName" className={labelClasses}>School Name</label>
                            <input type="text" id="schoolName" name="schoolName" value={settings.schoolName} onChange={handleInputChange('schoolName')} className={inputClasses} />
                        </div>
                        {!isStandardised && (
                            <div>
                                <label htmlFor="centreNumber" className={labelClasses}>Centre Number</label>
                                <input type="text" id="centreNumber" name="centreNumber" value={settings.centreNumber} onChange={handleInputChange('centreNumber')} className={inputClasses} />
                            </div>
                        )}
                    </div>
                    <SettingRow label="Show school name" tooltip="Displays the configured school name in the header.">
                        <Toggle checked={settings.showSchool} onChange={handleToggle('showSchool')} />
                    </SettingRow>
                    {!isStandardised && (
                        <SettingRow label="Show centre number" tooltip="Displays the configured centre number in the header.">
                            <Toggle checked={settings.showCentre} onChange={handleToggle('showCentre')} />
                        </SettingRow>
                    )}
                    <SettingRow label="Show school crest" tooltip={<CrestGraphic />}>
                        <Toggle checked={settings.showCrest} onChange={handleToggle('showCrest')} />
                    </SettingRow>
                </Accordion>
                {!isStandardised && (
                    <Accordion title="Exam Card Display">
                        <SettingRow label="Show start & end times" tooltip="Displays the calculated start and end time for each exam.">
                            <Toggle checked={settings.showTimes} onChange={handleToggle('showTimes')} />
                        </SettingRow>
                        {settings.showTimes && (
                            <>
                                <SettingRow label="Show Reading/Writing breakdown" tooltip="Separately displays the start and end times for both reading and writing periods." subOption>
                                    <Toggle checked={settings.timeBreakdown} onChange={handleToggle('timeBreakdown')} />
                                </SettingRow>
                                <SettingRow label="Use single line for times" tooltip={<TimeBreakdownGraphic />} subOption>
                                    <Toggle checked={settings.singleLineTime} onChange={handleToggle('singleLineTime')} />
                                </SettingRow>
                            </>
                        )}
                        <SettingRow label="Show exam status" tooltip="Displays text like 'Reading Time' or 'Writing Time' on each card.">
                            <Toggle checked={settings.showStatus} onChange={handleToggle('showStatus')} />
                        </SettingRow>
                        <SettingRow label="Colour-coded alerts" tooltip={<ColorAlertsGraphic />}>
                            <Toggle checked={settings.colorAlerts} onChange={handleToggle('colorAlerts')} />
                        </SettingRow>
                        <SettingRow label="Show countdown timer" tooltip="Displays a live countdown on each exam card.">
                            <Toggle checked={settings.showCountdown} onChange={handleToggle('showCountdown')} />
                        </SettingRow>
                    </Accordion>
                )}
                <Accordion title="Accessibility & Layout">
                   {!isStandardised && (
                        // --- FIX: Using the new, specific handler ---
                        <SettingRow label="Enable Special Provisions" tooltip="Adds options for extra time and rest breaks to exams. Defaults to a 1-column layout.">
                           <Toggle checked={settings.specialProvisions} onChange={handleSpecialProvisionsToggle} />
                       </SettingRow>
                    )}
                    <SettingRow label="Grid Layout" tooltip={<GridLayoutGraphic />}>
                         <select 
                            value={settings.gridLayout} 
                            onChange={handleSelect('gridLayout')} 
                            // This dropdown should never be disabled. The bug is in the LIVE settings modal.
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="1">1 Column</option>
                            <option value="2">2 Columns</option>
                            <option value="3">3 Columns (Default)</option>
                            <option value="4">4 Columns</option>
                            <option value="5">5 Columns</option>
                        </select>
                    </SettingRow>
                    <SettingRow label="Show seconds on main clock" tooltip="Toggles the display of seconds on the main header clock for precision.">
                        <Toggle checked={settings.showSeconds} onChange={handleToggle('showSeconds')} />
                    </SettingRow>
                    <SettingRow label="Use 24-hour clock" tooltip={<TimeFormatGraphic />}>
                        <Toggle checked={settings.is24hr} onChange={handleToggle('is24hr')} />
                    </SettingRow>
                </Accordion>
            </div>
        </div>
    );
};

export default DisplayOptions;
