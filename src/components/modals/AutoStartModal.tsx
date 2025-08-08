import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';

interface AutoStartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AutoStartModal: React.FC<AutoStartModalProps> = ({ isOpen, onClose }) => {
    const { dispatch } = useAppContext();
    const [time, setTime] = useState('');
    const [error, setError] = useState('');

    const handleSetTime = () => {
        if (!time) {
            setError('Please select a valid time.');
            return;
        }
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        if (startTime <= now) {
            setError('Start time must be in the future.');
            return;
        }

        dispatch({ type: 'SET_AUTO_START_TIME', payload: startTime.getTime() });
        setError('');
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Set Auto-Start Time">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Set Auto-Start Time</h2>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 text-lg"
                />
                {error && <p className="text-red-500 text-sm mt-2 h-4">{error}</p>}
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
                    <button onClick={handleSetTime} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Set Time</button>
                </div>
            </div>
        </Modal>
    );
};

export default AutoStartModal;
