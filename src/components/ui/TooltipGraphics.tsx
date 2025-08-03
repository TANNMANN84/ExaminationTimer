import React from 'react';
import { formatClockTime } from '../../utils/time';
import { useAppContext } from '../../context/AppContext'; // Use the correct path you found

// This line is now incorrect and must be removed.
// import { SCHOOL_CREST_URL } from '../../constants';

const Graphic: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => (
    <div className="flex flex-col items-center gap-2 w-full">
        {title && <span className="font-bold text-white dark:text-slate-900">{title}</span>}
        {children}
    </div>
);

const MiniCard: React.FC<{ className: string, title: string, status: string }> = ({ className, title, status }) => (
    <div className={`p-1.5 rounded text-left shadow-md ${className}`} style={{ width: '5.5rem' }}>
        <div className="text-xs font-bold leading-tight">{title}</div>
        <div className="text-[10px] leading-tight mt-0.5">{status}</div>
    </div>
);


export const ColorAlertsGraphic: React.FC = () => (
    <Graphic title="Changes card background on status.">
        <div className="flex items-center justify-center gap-1.5 mt-1">
            <MiniCard className="bg-sky-100 border border-sky-300 text-sky-800" title="Exam 1" status="Reading Time" />
            <MiniCard className="bg-green-100 border border-green-300 text-green-800" title="Exam 2" status="Writing Time" />
            <MiniCard className="bg-amber-100 border border-amber-300 text-amber-800" title="Exam 3" status="Ending Soon" />
        </div>
    </Graphic>
);

export const GridLayoutGraphic: React.FC = () => (
    <Graphic title="Choose the number of columns for the exam screen.">
        <div className="flex items-end justify-center gap-1 mt-1 w-24 h-12 bg-slate-700 dark:bg-slate-600 p-1 rounded">
            <div className="w-1/3 h-5/6 bg-slate-400 dark:bg-slate-400 rounded-sm"></div>
            <div className="w-1/3 h-full bg-slate-400 dark:bg-slate-400 rounded-sm"></div>
            <div className="w-1/3 h-4/6 bg-slate-400 dark:bg-slate-400 rounded-sm"></div>
        </div>
    </Graphic>
);

export const TimeBreakdownGraphic: React.FC = () => (
    <Graphic title="Condenses start/end times onto a single line.">
        <div className="text-xs space-y-2 text-slate-300 dark:text-slate-300 bg-slate-700 dark:bg-slate-700 p-2 rounded w-full mt-1">
            <div>
                <p className="font-bold text-white dark:text-white mb-1">Multi-line (default)</p>
                <p>Start: 9:00 AM</p>
                <p>End: 11:00 AM</p>
            </div>
            <div>
                <p className="font-bold text-white dark:text-white mb-1">Single-line (enabled)</p>
                <p>Start: 9:00 AM - End: 11:00 AM</p>
            </div>
        </div>
    </Graphic>
);

// THIS COMPONENT IS NOW FIXED
export const CrestGraphic: React.FC = () => {
    const { state } = useAppContext(); 
    const { crestUrl } = state.settings;

    return (
        <Graphic title="Shows the school crest image in the header.">
            <div className="w-28 h-12 bg-slate-700 dark:bg-slate-600 p-2 rounded flex items-center justify-center gap-2 mt-1">
                <img src={crestUrl} alt="School Crest" className="h-8 w-auto object-contain" />
                <span className="text-slate-300 font-bold text-sm">Session Title</span>
            </div>
        </Graphic>
    )
};

export const TimeFormatGraphic: React.FC = () => (
    <Graphic title="Switches between AM/PM and 24-hour time format.">
        <div className="text-sm space-y-2 text-slate-300 dark:text-slate-300 bg-slate-700 dark:bg-slate-700 p-2 rounded w-full mt-1 text-left">
            <p><span className='font-bold text-white dark:text-white'>12-Hour:</span> 3:30 PM</p>
            <p><span className='font-bold text-white dark:text-white'>24-Hour:</span> 15:30</p>
        </div>
    </Graphic>
)

const statusMap: Record<string, { icon: React.ReactNode, text: string, colorClass: string }> = {
    'Reading Time': { icon: '📖', text: 'Students are reading, not writing.', colorClass: 'text-sky-400' },
    'Writing Time': { icon: '✍️', text: 'Writing period is active.', colorClass: 'text-green-400' },
    'On Rest Break': { icon: '🧘', text: 'Student is on a scheduled rest break.', colorClass: 'text-indigo-400' },
    'Reader/Writer Active': { icon: '👥', text: 'A reader/writer is assisting the student.', colorClass: 'text-purple-400' },
    'Paused': { icon: '⏸️', text: 'The timer is paused.', colorClass: 'text-slate-400' },
    'Finished': { icon: '🏁', text: 'The exam has concluded.', colorClass: 'text-slate-400' },
    'Abandoned': { icon: '❌', text: 'The exam was abandoned.', colorClass: 'text-red-400' },
    'Preview': { icon: '👀', text: 'This is a preview before the session starts.', colorClass: 'text-slate-400' },
};

export const ExamStatusGraphic: React.FC<{ status: string }> = ({ status }) => {
    const details = statusMap[status] || statusMap['Preview'];
    return (
        <Graphic>
            <div className="flex items-center gap-2">
                <span className="text-2xl">{details.icon}</span>
                <span className={`font-bold ${details.colorClass}`}>{status}</span>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300">{details.text}</p>
        </Graphic>
    );
};

export const StartEndTimelineGraphic: React.FC<{ start: Date, end: Date, is24hr: boolean }> = ({ start, end, is24hr }) => {
    return (
        <Graphic title="Exam Timeline">
            <div className="flex items-center justify-between w-full text-xs text-slate-300 dark:text-slate-300 px-2">
                <span>{formatClockTime(start, is24hr, false)}</span>
                <span>{formatClockTime(end, is24hr, false)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-600 dark:bg-slate-500 rounded-full flex items-center relative">
                <div className="absolute left-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-800 dark:border-slate-200"></div>
                <div className="absolute right-0 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-slate-800 dark:border-slate-200"></div>
            </div>
        </Graphic>
    )
}