import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTimer } from './useTimer';
import type { CalculatedExam, Exam } from '../types';

export const useExamCalculations = (): { examsToRender: CalculatedExam[] } => {
    const { state } = useAppContext();
    const { exams, settings, isLive, isPaused: isSessionPaused, autoStartTargetTime, sessionMode } = state;
    const { now } = useTimer();

    const examsToRender = useMemo(() => {
        let lastEndTime = autoStartTargetTime || now.getTime();
        const isStandardised = sessionMode === 'standardised'; // Define this for convenience

        return exams.map((exam: Exam): CalculatedExam => {
            const calculatedExam: Partial<CalculatedExam> = { ...exam };

            // --- Determine Start/End Times ---
            if (isLive) {
                // In a live session, times are fixed in the state.
            } else {
                // In preview, calculate cascading times.
                calculatedExam.startTime = lastEndTime;
                const readMillis = exam.readMins * 60000;
                const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp?.extraTime || 0)) * 60000;
                calculatedExam.readEndTime = calculatedExam.startTime + readMillis;
                calculatedExam.writeEndTime = calculatedExam.readEndTime + writeMillis;
                lastEndTime = calculatedExam.writeEndTime;
            }
            
            const { readEndTime = 0, writeEndTime = 0 } = calculatedExam;

            // --- Determine Status, Time Remaining, and Card Class ---
            let currentStatus = 'Preview';
            let timeRemaining = (exam.readMins + exam.writeHrs * 60 + exam.writeMins + exam.sp.extraTime) * 60000;
            
            // --- THIS IS THE CORRECTED LOGIC ---
            let cardClass = isStandardised
                ? 'bg-amber-50 dark:bg-amber-900/30' // Use yellow tint for standardised tests
                : 'bg-white dark:bg-slate-800';   // Default to white for regular exams

            const isGloballyPaused = isSessionPaused && !exam.isPaused;

            // The status-based coloring should only apply to regular examinations
            if (isLive && !isStandardised) {
                 if (exam.status === 'abandoned') {
                    currentStatus = 'Abandoned';
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-60 is-abandoned';
                } else if (exam.status === 'finished') {
                    currentStatus = 'Finished';
                    timeRemaining = 0;
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-70';
                } else if (exam.isPaused || isGloballyPaused) {
                    currentStatus = 'Paused';
                    timeRemaining = writeEndTime - now.getTime();
                } else if (exam.sp.onRest) {
                    currentStatus = 'On Rest Break';
                    timeRemaining = writeEndTime - now.getTime();
                } else if (exam.sp.onReaderWriter) {
                    currentStatus = 'Reader/Writer Active';
                    timeRemaining = writeEndTime - now.getTime();
                } else if (now.getTime() < readEndTime) {
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
            }
            
            // Calculate SP Break Time
            const totalBreakMillis = exam.sp.restBreaks * 60000;
            const currentBreakDuration = exam.sp.onRest ? (now.getTime() - (exam.sp.restStartTime || now.getTime())) : 0;
            calculatedExam.spTimeRemaining = totalBreakMillis - exam.sp.restTaken - currentBreakDuration;

            // Calculate Reader/Writer Time
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