
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

        update(); // Start immediately

        return () => clearTimeout(timeoutId);
    }, []); // Runs once and self-regulates

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: is24hr ? '2-digit' : 'numeric',
        minute: '2-digit',
        hour12: !is24hr,
    };
    if (showSeconds) {
        timeOptions.second = '2-digit';
    }

    const timeString = now.toLocaleTimeString('en-AU', timeOptions);
    const dateString = now.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return { now, timeString, dateString };
};
