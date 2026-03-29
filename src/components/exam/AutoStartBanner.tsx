import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/useStore';
import { formatClockTime } from '../../utils/time';
import { requestFullscreen } from '../../utils/display';

const AutoStartBanner: React.FC = () => {
    const dispatch = useStore(state => state.dispatch);
    const autoStartTargetTime = useStore(state => state.autoStartTargetTime);
    const settings = useStore(state => state.settings);
    const isLive = useStore(state => state.isLive);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!autoStartTargetTime) return;

        const timer = setInterval(() => {
            const currentTime = Date.now();
            setNow(currentTime);
            if (currentTime >= autoStartTargetTime) {
                requestFullscreen();
                dispatch({ type: 'START_LIVE_SESSION' });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [autoStartTargetTime, dispatch]);


    if (!autoStartTargetTime || isLive) {
        return null;
    }

    const startTime = new Date(autoStartTargetTime);
    const timeRemaining = autoStartTargetTime - now;

    const formatCountdown = (ms: number) => {
        if (ms < 0) return '00:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto mb-6 p-3 bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-center">
            <p className="text-indigo-800 dark:text-indigo-200">
                Exams will automatically commence at {formatClockTime(startTime, settings.is24hr, false)}
                <span className="font-bold tabular-nums"> (in {formatCountdown(timeRemaining)})</span>
            </p>
            <button
                onClick={() => dispatch({ type: 'CANCEL_AUTO_START' })}
                className="ml-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                Cancel Auto-Start
            </button>
        </div>
    );
};

export default AutoStartBanner;