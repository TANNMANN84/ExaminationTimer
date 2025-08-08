// src/hooks/useExamCalculations.ts

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Exam } from '../types/exam';

// This is the custom hook that will be used to calculate the exam times
// for the exam cards. It will take the exam object as an argument and
// return the calculated exam times.
export const useExamCalculations = (exam: Exam) => {
    const { state } = useAppContext();
    const { isLive, sessionStartTime, autoStartTargetTime } = state;

    // The useMemo hook is used to memoize the calculated exam times so that
    // they are not recalculated on every render.
    const calculatedExam = useMemo(() => {
        const calculatedExam = { ...exam } as any;

        if (isLive && sessionStartTime) {
            // If the session is live, we use the session start time from the state
            const readMillis = exam.readMins * 60000;
            const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp.extraTime || 0)) * 60000;

            calculatedExam.startTime = sessionStartTime;
            calculatedExam.readEndTime = sessionStartTime + readMillis;
            calculatedExam.writeEndTime = calculatedExam.readEndTime + writeMillis;
        } else if (autoStartTargetTime) {
            // If autostart is set (but not yet live), calculate times based on the target time for the preview
            const sessionStartTime = autoStartTargetTime;
            const readMillis = exam.readMins * 60000;
            const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp.extraTime || 0)) * 60000;

            calculatedExam.startTime = sessionStartTime;
            calculatedExam.readEndTime = sessionStartTime + readMillis;
            calculatedExam.writeEndTime = calculatedExam.readEndTime + writeMillis;
        }
        
        return calculatedExam;
    }, [exam, isLive, sessionStartTime, autoStartTargetTime]);

    return calculatedExam;
};
