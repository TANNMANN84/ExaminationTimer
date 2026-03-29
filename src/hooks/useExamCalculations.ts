import { useMemo } from 'react';
import { useStore } from '../context/useStore';
import { useTimer } from './useTimer';
import type { CalculatedExam, Exam } from '../types';

const MIN_BREAK_MILLIS = 5 * 60 * 1000;

export const useExamCalculations = (): { examsToRender: CalculatedExam[] } => {
    const exams = useStore(state => state.exams);
    const settings = useStore(state => state.settings);
    const isLive = useStore(state => state.isLive);
    const isSessionPaused = useStore(state => state.isPaused);
    const autoStartTargetTime = useStore(state => state.autoStartTargetTime);
    const sessionMode = useStore(state => state.sessionMode);
    const globalPauseStartTime = useStore(state => state.pauseStartTime);

    const { now } = useTimer();

    const examsToRender = useMemo(() => {
        const isStandardised = sessionMode === 'standardised';

        return exams.map((exam: Exam): CalculatedExam => {
            const calculatedExam: Partial<CalculatedExam> = { ...exam };

            if (isLive) {
                // Live session times are fixed in state
            } else if (autoStartTargetTime) {
                const sessionStartTime = autoStartTargetTime;
                const readMillis = exam.readMins * 60000;
                const writeMillis = ((exam.writeHrs * 60) + exam.writeMins + (exam.sp.extraTime || 0)) * 60000;

                calculatedExam.startTime = sessionStartTime;
                calculatedExam.readEndTime = sessionStartTime + readMillis;
                calculatedExam.writeEndTime = calculatedExam.readEndTime + writeMillis;
            }
            
            const { readEndTime = 0, writeEndTime = 0 } = calculatedExam;

            // Freeze the visual timer calculation if the exam is actively paused
            let mainTimerNow = now.getTime();
            if (exam.isPaused && exam.pauseStartTime) {
                mainTimerNow = exam.pauseStartTime;
            } else if (isSessionPaused && !exam.isPaused && globalPauseStartTime) {
                mainTimerNow = globalPauseStartTime;
            } else if (exam.sp.onRest && exam.sp.restStartTime) {
                mainTimerNow = exam.sp.restStartTime;
            } else if (exam.sp.onReaderWriter && exam.sp.readerWriterStartTime) {
                mainTimerNow = exam.sp.readerWriterStartTime;
            }

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
                    if (mainTimerNow < readEndTime) {
                        currentStatus = 'Reading Time';
                        timeRemaining = readEndTime - mainTimerNow;
                        if (settings.colorAlerts) cardClass = 'bg-sky-100 dark:bg-sky-900/50';
                    } else {
                        currentStatus = 'Writing Time';
                        timeRemaining = writeEndTime - mainTimerNow;
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
            
            // Calculate SP Break Time (Rounded to nearest minute for UI display)
            const totalBreakMillis = exam.sp.restBreaks * 60000;
            const rawCurrentBreakDuration = exam.sp.onRest ? (now.getTime() - (exam.sp.restStartTime || now.getTime())) : 0;
            const currentBreakDurationRounded = Math.round(rawCurrentBreakDuration / 60000) * 60000;
            
            calculatedExam.spTimeRemaining = totalBreakMillis - exam.sp.restTaken - currentBreakDurationRounded;

            calculatedExam.canStartRestBreak = !exam.sp.onRest && (calculatedExam.spTimeRemaining >= MIN_BREAK_MILLIS);
            calculatedExam.canEndRestBreak = exam.sp.onRest && (rawCurrentBreakDuration >= MIN_BREAK_MILLIS);

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
