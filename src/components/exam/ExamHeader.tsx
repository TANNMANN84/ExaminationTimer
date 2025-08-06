import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import FontControl from './FontControl';

const ExamHeader: React.FC = () => {
    const { state } = useAppContext();
    const { settings, sessionMode } = state;
    // Get the new separated date strings from our updated hook
    const { timeValue, timePeriod, dayString, dateString } = useTimer();
    const isStandardised = sessionMode === 'standardised';

    const gridLayoutClass = settings.showCrest
        ? 'grid-cols-[auto,1.5fr,auto,1fr]'
        : 'grid-cols-[1.5fr,auto,1fr]';

    return (
        <header className="p-4 border-b-4 border-slate-200 dark:border-slate-700 mb-6">
            <div className={`grid ${gridLayoutClass} items-center gap-x-6 w-full`}>

                {/* --- Column 1: Crest --- */}
                {settings.showCrest && (
                    <div className="flex justify-start">
                        <img src={settings.crestUrl} alt="School Crest" className="h-20 w-auto object-contain" />
                    </div>
                )}

                {/* --- Column 2: Title & School Info (Now on separate lines) --- */}
                <div className="flex flex-col items-start text-left">
                    <div className="flex items-center space-x-2">
                        <FontControl elementId="header-session-title" direction="down" />
                        <h1 id="header-session-title" className="text-4xl lg:text-5xl font-bold" style={{fontSize: settings.fontSizes['header-session-title']}}>
                            {settings.sessionTitle}
                        </h1>
                        <FontControl elementId="header-session-title" direction="up" />
                    </div>
                    {/* School Name */}
                    {settings.showSchool && (
                         <div className="flex items-center space-x-2 mt-1">
                            <FontControl elementId="header-school-info" direction="down" />
                            <p id="header-school-info" className="text-xl text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-school-info']}}>
                                {settings.schoolName}
                            </p>
                            <FontControl elementId="header-school-info" direction="up" />
                        </div>
                    )}
                    {/* Centre Number (only shows if school name is also shown) */}
                    {settings.showSchool && !isStandardised && settings.showCentre && (
                        <p className="text-xl text-slate-500 dark:text-slate-400 mt-1 pl-8">
                           Centre: {settings.centreNumber}
                        </p>
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

                {/* --- Column 4: Date (Now multi-line and centered) --- */}
                <div className="flex flex-col items-center text-center">
                     <div className="flex items-center space-x-2">
                        <FontControl elementId="header-date" direction="down" />
                        <div>
                            <p className="text-2xl font-semibold text-slate-500 dark:text-slate-400">
                                {dayString}
                            </p>
                            <p id="header-date" className="text-2xl font-semibold text-slate-500 dark:text-slate-400" style={{fontSize: settings.fontSizes['header-date']}}>
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
