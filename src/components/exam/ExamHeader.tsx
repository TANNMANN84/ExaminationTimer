import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import FontControl from './FontControl';

const ExamHeader: React.FC = () => {
    const { state } = useAppContext();
    const { settings, sessionMode } = state;
    const { timeValue, timePeriod, dayString, dateString } = useTimer();
    const isStandardised = sessionMode === 'standardised';

    const gridLayoutClass = settings.showCrest
        ? 'grid-cols-[auto,1fr,auto,1fr]'
        : 'grid-cols-[1fr,auto,1fr]';

    const dateFontSize = settings.fontSizes['header-date'];

    return (
        <header className="p-4 border-b-4 border-slate-200 dark:border-slate-700 mb-6">
            <div className={`grid ${gridLayoutClass} items-center gap-x-6 w-full`}>

                {/* --- Column 1: Crest --- */}
                {settings.showCrest && (
                    <div className="flex justify-start">
                        <img src={settings.crestUrl} alt="School Crest" className="h-20 w-auto object-contain" />
                    </div>
                )}

                {/* --- Column 2: Title & School Info (Padding Added) --- */}
                <div className="flex flex-col items-center text-center py-2">
                    <div className="flex items-center space-x-2">
                        <FontControl elementId="header-session-title" direction="down" />
                        <h1 id="header-session-title" className="text-4xl lg:text-5xl font-bold" style={{fontSize: settings.fontSizes['header-session-title']}}>
                            {settings.sessionTitle}
                        </h1>
                        <FontControl elementId="header-session-title" direction="up" />
                    </div>
                    
                    {settings.showSchool && (
                         <div className="flex items-center space-x-2 mt-1">
                            <FontControl elementId="header-school-info" direction="down" />
                            <p id="header-school-info" className="text-xl text-slate-700 dark:text-slate-300" style={{fontSize: settings.fontSizes['header-school-info']}}>
                                {settings.schoolName}
                            </p>
                            <FontControl elementId="header-school-info" direction="up" />
                        </div>
                    )}

                    {settings.showSchool && !isStandardised && settings.showCentre && (
                        <div className="flex items-center space-x-2 mt-1">
                            <FontControl elementId="header-centre-number" direction="down" />
                            <p id="header-centre-number" className="text-xl text-slate-700 dark:text-slate-300" style={{fontSize: settings.fontSizes['header-centre-number']}}>
                               Centre: {settings.centreNumber}
                            </p>
                            <FontControl elementId="header-centre-number" direction="up" />
                        </div>
                    )}
                </div>

                {/* --- Column 3: Main Clock --- */}
                <div className="flex justify-center items-baseline space-x-2">
                    <FontControl elementId="header-time" direction="down" />
                    <div className="flex items-baseline">
                        <p id="header-time" className="text-7xl font-bold tracking-tighter tabular-nums" style={{fontSize: settings.fontSizes['header-time']}}>
                            {timeValue}
                        </p>
                        {timePeriod && (
                            <p className="text-5xl font-bold tabular-nums ml-2" style={{fontSize: (settings.fontSizes['header-time'] || 120) / 2}}>
                                {timePeriod}
                            </p>
                        )}
                    </div>
                    <FontControl elementId="header-time" direction="up" />
                </div>

                {/* --- Column 4: Date (Padding Added) --- */}
                <div className="flex flex-col items-center text-center py-2">
                     <div className="flex items-center space-x-2">
                        <FontControl elementId="header-date" direction="down" />
                        <div id="header-date-wrapper">
                            <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300" style={{fontSize: dateFontSize}}>
                                {dayString}
                            </p>
                            {/* FIX: Added margin-top to this line to create space */}
                            <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mt-1" style={{fontSize: dateFontSize}}>
                                {dateString}
                            </p>
                        </div>
                        <FontControl elementId="header-date" direction="up" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ExamHeader;
