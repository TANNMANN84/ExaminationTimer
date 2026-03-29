import React from 'react';
import type { CalculatedExam, Settings } from '../../../types';
import { formatTime } from '../../../utils/time';

interface SpControlsProps {
    exam: CalculatedExam;
    settings: Settings;
    isLive: boolean;
    isStandardised: boolean;
    spTimeRemaining: number;
    readerWriterTimeRemaining: number;
    showSpCountdown: boolean;
    onToggleRestBreak: () => void;
    onToggleReaderWriter: () => void;
}

const SpControls: React.FC<SpControlsProps> = ({
    exam,
    settings,
    isLive,
    isStandardised,
    spTimeRemaining,
    readerWriterTimeRemaining,
    showSpCountdown,
    onToggleRestBreak,
    onToggleReaderWriter,
}) => {
    if (!isLive || !settings.specialProvisions || !settings.showSPLive || isStandardised) return null;
    
    if (exam.sp.onRest) {
        return (
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 border-2 border-blue-400 dark:border-blue-500 text-slate-700 dark:text-slate-300 rounded-md text-center">
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">EXAM PAUSED: REST BREAK</h4>
                <p className="text-2xl font-semibold my-2 tabular-nums">
                    Time on break: {Math.floor((Date.now() - (exam.sp.restStartTime || Date.now())) / 60000)} min(s)
                </p>
                <button
                    onClick={onToggleRestBreak}
                    disabled={!exam.canEndRestBreak}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {!exam.canEndRestBreak ? 'Minimum 5 mins required' : 'End Rest & Resume Exam'}
                </button>
            </div>
        );
    }

    if (exam.sp.onReaderWriter) {
        return (
            <div className="mt-4 p-4 bg-purple-600 text-white rounded-md text-center">
                <h4 className="text-xl font-bold">READER/WRITER ACTIVE</h4>
                {showSpCountdown && (
                    <p className="text-3xl font-bold tabular-nums my-2">{formatTime(readerWriterTimeRemaining)}</p>
                )}
                <button
                    onClick={onToggleReaderWriter}
                    className="mt-2 px-6 py-2 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-purple-100 transition"
                >
                    Reader/writer Not Active
                </button>
            </div>
        );
    }

    const hasRestBreaks = exam.sp.restBreaks > 0;
    const hasRwTime = exam.sp.readerWriterTime > 0;
    
    if (!hasRestBreaks && !hasRwTime) return null;

    const isRestBreakTimeUp = spTimeRemaining <= 0;
    const isRwTimeUp = readerWriterTimeRemaining <= 0;
    
    const totalRestMillis = exam.sp.restBreaks * 60000;
    const restProgress = totalRestMillis > 0 ? Math.min((exam.sp.restTaken / totalRestMillis) * 100, 100) : 0;
    const restStyle = !showSpCountdown ? {
          background: `linear-gradient(to right, #3730a3 ${restProgress}%, #4f46e5 ${restProgress}%)`
    } : {};

    const totalRwMillis = exam.sp.readerWriterTime * 60000;
    const rwProgress = totalRwMillis > 0 ? Math.min((exam.sp.readerWriterTaken / totalRwMillis) * 100, 100) : 0;
    const rwStyle = !showSpCountdown ? {
        background: `linear-gradient(to right, #6b21a8 ${rwProgress}%, #9333ea ${rwProgress}%)`
    } : {};

    return (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
            {hasRestBreaks && (
                <div className="text-center">
                    {showSpCountdown && (
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                            Approved Rest Break Time: <span className="tabular-nums">{formatTime(spTimeRemaining)}</span>
                        </p>
                    )}
                    <button
                        onClick={onToggleRestBreak}
                        disabled={isRestBreakTimeUp || !exam.canStartRestBreak}
                        style={restStyle}
                        className="mt-1 px-4 py-1 text-white text-sm font-bold rounded-full transition bg-blue-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRestBreakTimeUp ? 'No Breaks Left' : (!exam.canStartRestBreak ? 'Allowance < 5 mins' : 'Start Rest Break')}
                    </button>
                </div>
            )}
            {hasRestBreaks && hasRwTime && <div className="border-t border-blue-200 dark:border-blue-700"></div>}
            {hasRwTime && (
                <div className="text-center">
                     {showSpCountdown && (
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                            Approved R/W Time: <span className="tabular-nums">{formatTime(readerWriterTimeRemaining)}</span>
                        </p>
                    )}
                    <button
                        onClick={onToggleReaderWriter}
                        disabled={isRwTimeUp}
                        style={rwStyle}
                        className="mt-1 px-4 py-1 text-white text-sm font-bold rounded-full transition bg-purple-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRwTimeUp ? 'Allowance Applied' : 'Start Reader/Writer'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpControls;