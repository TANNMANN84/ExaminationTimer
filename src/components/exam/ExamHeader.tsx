import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import FontControl from './FontControl';

const ExamHeader: React.FC = () => {
    const { state } = useAppContext();
    // 1. ADD 'sessionMode' TO THE LIST OF THINGS WE GET FROM STATE
    const { settings, sessionMode } = state; 
    const { timeString, dateString } = useTimer();

    // 2. DEFINE 'isStandardised' LOCALLY
    const isStandardised = sessionMode === 'standardised';
    
return (
    <header className="p-4 border-b-4 border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-[auto,1.5fr,2fr,1.5fr] items-center gap-x-6 w-full">

            {/* --- Column 1: Crest --- */}
            <div className="flex justify-start">
                {settings.showCrest && (
                    <img src={settings.crestUrl} alt="School Crest" className="h-20 w-auto object-contain" />
                )}
            </div>

            {/* --- Column 2: Title & School Info --- */}
            <div className="flex flex-col items-start text-left">
                <div className="flex items-center space-x-2">
                    <FontControl elementId="header-session-title" direction="down" />
                    <h1 id="header-session-title" className="text-4xl lg:text-5xl font-bold" style={{fontSize: settings.fontSizes['header-session-title']}}>
                        {settings.sessionTitle}
                    </h1>
                    <FontControl elementId="header-session-title" direction="up" />
                </div>

                <div className="flex items-center space-x-2 mt-1">
                    <FontControl elementId="header-school-info" direction="down" />
                    <p id="header-school-info" className="text-xl text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-school-info']}}>
                        {settings.showSchool && settings.schoolName}
                        {settings.showSchool && !isStandardised && settings.showCentre && " - "}
                        {!isStandardised && settings.showCentre && settings.centreNumber}
                    </p>
                    <FontControl elementId="header-school-info" direction="up" />
                </div>
            </div>

            {/* --- Column 3: Main Clock (Large & Centred) --- */}
            <div className="flex justify-center items-center space-x-2">
                <FontControl elementId="header-time" direction="down" />
                <p id="header-time" className="text-7xl font-bold tracking-tighter tabular-nums" style={{fontSize: settings.fontSizes['header-time']}}>
                    {timeString}
                </p>
                <FontControl elementId="header-time" direction="up" />
            </div>

            {/* --- Column 4: Date (Right-aligned) --- */}
            <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                    <FontControl elementId="header-date" direction="down" />
                    <p id="header-date" className="text-2xl font-semibold text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-date']}}>
                        {dateString}
                    </p>
                    <FontControl elementId="header-date" direction="up" />
                </div>
            </div>

        </div>
    </header>
);
};

export default ExamHeader;
