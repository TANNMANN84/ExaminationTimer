import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTimer } from './useTimer';
import type { CalculatedExam, Exam } from '../types';

export const useExamCalculations = (): { examsToRender: CalculatedExam[] } => {
    const { state } = useAppContext();
    const { exams, settings, isLive, isPaused: isSessionPaused, autoStartTargetTime, sessionMode } = state;
    const { now } = useTimer();

    const examsToRender = useMemo(() => {
        // This is the one, correct definition for isStandardised, based on the session mode.
        const isStandardised = sessionMode === 'standardised';

        return exams.map((exam: Exam): CalculatedExam => {
            const calculatedExam: Partial<CalculatedExam> = { ...exam };

            // --- Determine Start/End Times ---
            if (isLive) {
                // In a live session, times are already fixed in the state, so we do nothing here.
            } else {
                // In preview mode, we don't calculate start/end times.
                // The component will show placeholders instead, which is correct.
            }
            
            const { readEndTime = 0, writeEndTime = 0 } = calculatedExam;

            // --- Determine Status, Time Remaining, and Card Class ---
            let currentStatus = 'Preview';
            let timeRemaining = (exam.readMins + exam.writeHrs * 60 + exam.writeMins + exam.sp.extraTime) * 60000;
            
            // Set the base background color based on the test type
            let cardClass = isStandardised
                ? 'bg-amber-50 dark:bg-amber-900/30' // Yellow tint for standardised tests
                : 'bg-white dark:bg-slate-800';   // Default white for regular exams

            const isGloballyPaused = isSessionPaused && !exam.isPaused;

            // The detailed status-based coloring should only apply to regular (non-standardised) examinations
            if (isLive && !isStandardised) { // This block determines the status and appearance for live, non-standardised exams.
                if (exam.status === 'abandoned') {
                    currentStatus = 'Abandoned';
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-60 is-abandoned';
                } else if (exam.status === 'finished') {
                    currentStatus = 'Finished';
                    timeRemaining = 0;
                    cardClass = 'bg-slate-200 dark:bg-slate-700 opacity-70';
                } else {
                    // First, determine the base phase (reading vs. writing) and set time/colors accordingly.
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

                    // Then, override the status string if an overlay state (like pause) is active.
                    // The time remaining and color from the base phase are preserved.
                    if (exam.isPaused || isGloballyPaused) {
                        currentStatus = 'Paused';
                    } else if (exam.sp.onRest) {
                        currentStatus = 'On Rest Break';
                    } else if (exam.sp.onReaderWriter) {
                        currentStatus = 'Reader/Writer Active';
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
