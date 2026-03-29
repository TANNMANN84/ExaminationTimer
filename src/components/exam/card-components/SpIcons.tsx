import React from 'react';
import type { CalculatedExam, Settings } from '../../../types';

interface SpIconsProps {
    exam: CalculatedExam;
    settings: Settings;
    isStandardised: boolean;
    onMouseOver: (content: React.ReactNode) => (e: React.MouseEvent<HTMLElement>) => void;
    onMouseOut: () => void;
}

const SpIcons: React.FC<SpIconsProps> = ({ exam, settings, isStandardised, onMouseOver, onMouseOut }) => {
    if (!settings.specialProvisions || isStandardised) return null;
    
    return (
        <div className="flex items-center gap-2 mr-3">
            {exam.sp.extraTime > 0 && (
                 <div 
                     onMouseOver={onMouseOver(`Approved Extra Time: ${exam.sp.extraTime} mins`)} 
                     onMouseOut={onMouseOut}
                     className="cursor-pointer"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
            )}
            {exam.sp.restBreaks > 0 && (
                <div 
                     onMouseOver={onMouseOver(`Approved Rest Breaks: ${exam.sp.restBreaks} mins`)} 
                     onMouseOut={onMouseOut}
                     className="cursor-pointer"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" /></svg>
                 </div>
            )}
            {exam.sp.readerWriterTime > 0 && (
                  <div 
                     onMouseOver={onMouseOver(`Approved Reader/Writer Time: ${exam.sp.readerWriterTime} mins`)} 
                     onMouseOut={onMouseOut}
                     className="cursor-pointer"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                 </div>
            )}
        </div>
    );
}

export default SpIcons;