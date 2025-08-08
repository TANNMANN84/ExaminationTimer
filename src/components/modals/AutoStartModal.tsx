import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { requestFullscreen, activateWakelock } from '../../utils/display';

interface Props {
    onClose: () => void;
}

const AutoStartModal: React.FC<Props> = ({ onClose }) => {
    const { dispatch } = useAppContext();
    // Use native Date methods to get 'HH:MM' format, removing date-fns
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false }));

    const handleSetAutoStart = async () => {
        const [hours, minutes] = time.split(':');
        if (hours && minutes) {
            await requestFullscreen();
            await activateWakelock();

            const targetTime = new Date();
            targetTime.setHours(Number(hours), Number(minutes), 0, 0);

            if (targetTime.getTime() < Date.now()) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            dispatch({ type: 'SET_AUTO_START_TIME', payload: targetTime.getTime() });
            onClose();
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Set Auto-Start Time</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                The session will automatically commence at the specified time.
            </p>
            <div className="flex justify-center items-center mb-6">
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="p-2 border rounded-md text-2xl font-mono bg-slate-50 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600"
                />
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSetAutoStart}
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Set Time & Start
                </button>
            </div>
        </div>
    );
};

export default AutoStartModal;
