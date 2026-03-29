
import { useEffect } from 'react';

export const useWakeLock = (isLocked: boolean) => {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isLocked && document.visibilityState === 'visible') {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('Screen Wake Lock is active.');
          
          wakeLock.addEventListener('release', () => {
            console.log('Screen Wake Lock was released.');
            wakeLock = null;
          });
        } catch (err: any) {
          console.error(`Wake Lock error: ${err.message}`);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (isLocked && document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock();
      }
    };

    if (isLocked) {
      requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release().catch(() => {});
        wakeLock = null;
      }
    };
  }, [isLocked]);
};
