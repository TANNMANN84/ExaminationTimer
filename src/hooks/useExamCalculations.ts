import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTimer } from './useTimer';
import type { CalculatedExam, Exam } from '../types';

export const useExamCalculations = (): { examsToRender: CalculatedExam[] } => {
    const { state } = useAppContext();
    const { exams, settings, isLive, isPaused: isSessionPaused, autoStartTargetTime, sessionMode } = state;
    const { now } = useTimer();

    const examsToRender = useMemo(() => {
        const isStandardised = sessionMode === 'standardised';

        return exams.map((exam: Exam): CalculatedExam => {
            const calculatedExam: Partial<CalculatedExam> = { ...exam };

            // --- Determine Start/End Times ---
            if (isLive) {
                // In a live session, times are already fixed in the state, so we do nothing here.
            } else if (autoStartTargetTime) {
                // This is the corrected block for preview times with autostart
                const sessionStartTime = autoStartTargetTime;
                const readMillis = exam.readMins * 60000;
                const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp.extraTime || 0)) * 60000;

                calculatedExam.startTime = sessionStartTime;
                calculatedExam.readEndTime = sessionStartTime + readMillis;
                calculatedExam.writeEndTime = calculatedExam.readEndTime + writeMillis;
            } else {
                // In preview mode without autostart, we don't calculate start/end times.
            }
            
            const { readEndTime = 0, writeEndTime = 0 } = calculatedExam;

            // --- Determine Status, Time Remaining, and Card Class ---
            let currentStatus = 'Preview';
            let timeRemaining = (exam.readMins + exam.writeHrs * 60 + exam.writeMins + exam.sp.extraTime) * 60000;
            
            let cardClass = isStandardised
                ? 'bg-amber-50 dark:bg-amber-900/30'
                : 'bg-white dark:bg-slate-800';

            const isGloballyPaused = isSessionPaused && !exam.isPaused;

            if (isLive && !isStandardised) {
                if (exam.status === 'abandoned') {
                    currentStatus = 'Abandoned';
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-60 is-abandoned';
                } else if (exam.status === 'finished') {
                    currentStatus = 'Finished';
                    timeRemaining = 0;
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-70';
                } else {
                    if (now.getTime() < readEndTime) {
                        currentStatus = 'Reading Time';
                        timeRemaining = readEndTime - now.getTime();
                        if (settings.colorAlerts) cardClass = 'bg-sky-100 dark:bg-sky-900/50';
                    } else {
                        currentStatus = 'Writing Time';
                        timeRemaining = writeEndTime - now.getTime();
                        if (settings.colorAlerts) {
                            cardClass = timeRemaining <= 10 * 60 * 1000 ? 'bg-amber-100 dark:bg-amber-800/30' : 'bg-green-100 dark:bg-green-800/40';
                        }
                    }

                    if (exam.isPaused || isGloballyPaused) {
                        currentStatus = 'Paused';
                    } else if (exam.sp.onRest) {
                        currentStatus = 'On Rest Break';
                    } else if (exam.sp.onReaderWriter) {
                        currentStatus = 'Reader/Writer Active';
                    }
                }
            }
            
            const totalBreakMillis = exam.sp.restBreaks * 60000;
            const currentBreakDuration = exam.sp.onRest ? (now.getTime() - (exam.sp.restStartTime || now.getTime())) : 0;
            calculatedExam.spTimeRemaining = totalBreakMillis - exam.sp.restTaken - currentBreakDuration;

            const totalRwMillis = exam.sp.readerWriterTime * 60000;
            const currentRwDuration = exam.sp.onReaderWriter ? (now.getTime() - (exam.sp.readerWriterStartTime || now.getTime())) : 0;
            calculatedExam.readerWriterTimeRemaining = totalRwMillis - exam.sp.readerWriterTaken - currentRwDuration;
            
            calculatedExam.calculatedStatus = currentStatus;
            calculatedExam.timeRemaining = timeRemaining;
            calculatedExam.cardClass = cardClass;

            return calculatedExam as CalculatedExam;
        });

    }, [exams, settings, isLive, isSessionPaused, autoStartTargetTime, now, sessionMode]);

    return { examsToRender };
};
