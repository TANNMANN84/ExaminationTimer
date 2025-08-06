import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const useTimer = () => {
    const { state } = useAppContext();
    const { is24hr, showSeconds } = state.settings;
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        let timeoutId: number;
        
        const update = () => {
            const currentDate = new Date();
            setNow(currentDate);
            const msUntilNextSecond = 1000 - currentDate.getMilliseconds();
            timeoutId = window.setTimeout(update, msUntilNextSecond);
        };

        update();

        return () => clearTimeout(timeoutId);
    }, []);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: !is24hr,
    };

    if (showSeconds) {
        timeOptions.second = '2-digit';
    }

    const fullTimeString = now.toLocaleTimeString('en-AU', timeOptions);
    
    let timeValue = fullTimeString;
    let timePeriod = '';

    if (!is24hr) {
        const parts = fullTimeString.split(' ');
        timeValue = parts[0];
        timePeriod = parts[1] || '';
    }

    // --- UPDATED DATE LOGIC ---
    // Create two separate strings for the date
    const dayString = now.toLocaleDateString('en-AU', { weekday: 'long' });
    const dateString = now.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Return all the separated values
    return { now, timeValue, timePeriod, dayString, dateString };
};
