import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import FontControl from './FontControl';

const ExamHeader: React.FC = () => {
    const { state } = useAppContext();
    const { settings } = state;
    const { timeValue, timePeriod, dayString, dateString } = useTimer();

    // 1. REVERT to the original balanced grid layout.
    // The two `1fr` columns will take up equal space, keeping the clock centered.
    const gridLayoutClass = settings.showCrest
        ? 'grid-cols-[auto,1fr,auto,1fr]'
        : 'grid-cols-[1fr,auto,1fr]';

    const dateFontSize = settings.fontSizes['header-date'];

    return (
        <header className="p-4 border-b-4 border-slate-200 dark:border-slate-700 mb-6">
            <div className={`grid ${gridLayoutClass} items-center gap-x-6 w-full`}>

                {/* --- Crest --- */}
                {settings.showCrest && (
                    <div className="flex justify-start">
                        <img src={settings.crestUrl} alt="School Crest" className="h-20 w-auto object-contain" />
                    </div>
                )}

                {/* --- Title & School Info --- */}
                {/* 2. ADD `min-w-0`. This allows the flexible title column to shrink if the text inside is too long, preventing it from breaking the layout. */}
                <div className="flex flex-col items-center text-center py-2 min-w-0">
                    <div className="flex items-center space-x-2">
                        <FontControl elementId="header-session-title" direction="down" />
                        <h1 id="header-session-title" className="font-bold whitespace-nowrap" style={{fontSize: settings.fontSizes['header-session-title']}}>
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
                </div>

                {/* --- Main Clock --- */}
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

                {/* --- Date --- */}
                <div className="flex flex-col items-center text-center pb-4 min-w-0">
                     <div className="flex items-center space-x-2">
                         <FontControl elementId="header-date" direction="down" />
                         <div id="header-date-wrapper">
                             <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300" style={{fontSize: dateFontSize}}>
                                 {dayString}
                             </p>
                             <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mt-2" style={{fontSize: dateFontSize}}>
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