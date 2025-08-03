
export const formatTime = (ms: number): string => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours)}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatClockTime = (date: Date, is24hr: boolean, showSeconds: boolean): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: is24hr ? '2-digit' : 'numeric',
        minute: '2-digit',
        hour12: !is24hr
    };
    if (showSeconds) {
        options.second = '2-digit';
    }
    return date.toLocaleTimeString('en-AU', options);
};
