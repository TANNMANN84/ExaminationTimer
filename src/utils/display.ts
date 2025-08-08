// src/utils/display.ts

export const requestFullscreen = async () => {
    // Check if the document is not already in fullscreen
    if (document.fullscreenElement) {
        return;
    }
    
    try {
        await document.documentElement.requestFullscreen();
    } catch (err) {
        // Log error if fullscreen request fails, but don't block the process
        console.error(`Error attempting to enable full-screen mode:`, err);
    }
};

export const activateWakelock = async () => {
    // Check if the Wake Lock API is supported
    if ('wakeLock' in navigator) {
        try {
            // Request a screen wake lock
            await navigator.wakeLock.request('screen');
        } catch (err) {
            // Log error if wake lock request fails, but don't block the process
            console.error(`Error attempting to activate wake lock:`, err);
        }
    } else {
        console.warn('Wake Lock API is not supported in this browser.');
    }
};
