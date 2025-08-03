import React from 'react';
import { useTooltip } from '../../context/TooltipContext';
import { useAppContext } from '../../context/AppContext';

interface SettingRowProps {
    label: string;
    tooltip: React.ReactNode;
    children: React.ReactNode;
    subOption?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, tooltip, children, subOption = false }) => {
    const { showTooltip, hideTooltip } = useTooltip();
    const { state } = useAppContext();
    
    const handleShowTooltip = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        if (state.ui.showTooltips) {
            showTooltip(tooltip, e.currentTarget);
        }
    };

    return (
        <div className={`flex items-center justify-between ${subOption ? 'pl-6' : ''}`}>
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    onMouseOver={handleShowTooltip}
                    onFocus={handleShowTooltip}
                    onMouseOut={hideTooltip}
                    onBlur={hideTooltip}
                    className="flex-shrink-0"
                    aria-label={`Info about ${label}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </button>
                <span className={`text-slate-700 dark:text-slate-300 ${subOption ? 'text-sm' : ''}`}>{label}</span>
            </div>
            {children}
        </div>
    );
};

export default SettingRow;