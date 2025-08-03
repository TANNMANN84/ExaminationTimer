
import { useState, useEffect } from 'react';

export const useWakeLock = (isLocked: boolean) => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    let newWakeLock: WakeLockSentinel | null = null;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isLocked) {
        try {
          newWakeLock = await navigator.wakeLock.request('screen');
          setWakeLock(newWakeLock);
          console.log('Screen Wake Lock is active.');
          
          newWakeLock.addEventListener('release', () => {
            console.log('Screen Wake Lock was released.');
            setWakeLock(null);
          });

        } catch (err: any) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
      }
    };

    if (isLocked) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      if (newWakeLock) {
        newWakeLock.release();
      }
    };
  }, [isLocked]);

  return wakeLock;
};
