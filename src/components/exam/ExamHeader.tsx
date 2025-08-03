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
        <header className="text-center mb-6">
            <div className="flex justify-center items-center space-x-2">
                {settings.showCrest && (
                    <img src={settings.crestUrl} alt="School Crest" className="h-16 w-auto object-contain" />
                )}
                <div id="header-title-wrapper" className="flex items-center space-x-2">
                    <FontControl elementId="header-session-title" direction="down" />
                    <div>
                        <h1 id="header-session-title" className="text-3xl font-bold text-slate-900 dark:text-slate-50" style={{fontSize: settings.fontSizes['header-session-title']}}>
                            {settings.sessionTitle}
                        </h1>
                         <div id="header-school-wrapper" className="flex items-center justify-center space-x-2">
                            <FontControl elementId="header-school-info" direction="down" />
                            <p id="header-school-info" className="text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-school-info']}}>
                                {settings.showSchool && settings.schoolName}
                                {/* 3. ADD THE '!isStandardised' CHECK HERE... */}
                                {settings.showSchool && !isStandardised && settings.showCentre && " - "} 
                                {/* ... AND HERE */}
                                {!isStandardised && settings.showCentre && settings.centreNumber}
                            </p>
                            <FontControl elementId="header-school-info" direction="up" />
                        </div>
                    </div>
                     <FontControl elementId="header-session-title" direction="up" />
                </div>
            </div>
            <div id="header-time-wrapper" className="mt-4 flex justify-center items-center space-x-2">
                <FontControl elementId="header-time" direction="down" />
                <p id="header-time" className="text-7xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 tabular-nums" style={{fontSize: settings.fontSizes['header-time']}}>
                    {timeString}
                </p>
                 <FontControl elementId="header-time" direction="up" />
            </div>
             <div id="header-date-wrapper" className="mt-1 flex justify-center items-center space-x-2">
                <FontControl elementId="header-date" direction="down" />
                <p id="header-date" className="text-xl font-semibold text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-date']}}>
                    {dateString}
                </p>
                <FontControl elementId="header-date" direction="up" />
            </div>
        </header>
    );
};

export default ExamHeader;