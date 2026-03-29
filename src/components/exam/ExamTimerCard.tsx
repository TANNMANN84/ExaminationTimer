import React, { useEffect, useCallback, useState } from 'react';
import type { CalculatedExam } from '../../types';
import { useStore } from '../../context/useStore';
import { formatTime, formatClockTime } from '../../utils/time';
import FontControl from './FontControl';
import { useTooltip } from '../../context/TooltipContext';
import { ExamStatusGraphic, StartEndTimelineGraphic } from '../ui/TooltipGraphics';
import AccessCodeDisplay from './card-components/AccessCodeDisplay';
import SpControls from './card-components/SpControls';
import SpIcons from './card-components/SpIcons';

interface ExamTimerCardProps {
    exam: CalculatedExam;
}

const ExamTimerCard: React.FC<ExamTimerCardProps> = ({ exam }) => {
    const dispatch = useStore(state => state.dispatch);
    const settings = useStore(state => state.settings);
    const isLive = useStore(state => state.isLive);
    const autoStartTargetTime = useStore(state => state.autoStartTargetTime);
    const isSessionPaused = useStore(state => state.isPaused);
    const sessionMode = useStore(state => state.sessionMode);
    const showTooltips = useStore(state => state.ui.showTooltips);
    
    const { showTooltip, hideTooltip } = useTooltip();

    const { calculatedStatus, timeRemaining, cardClass, spTimeRemaining, readerWriterTimeRemaining, startTime = 0, readEndTime = 0, writeEndTime = 0 } = exam;

    const { showSpCountdown } = settings;
    const isStandardised = sessionMode === 'standardised';

    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (isStandardised) return;

        if (exam.sp.onRest && spTimeRemaining <= 0) {
            dispatch({ type: 'TOGGLE_REST_BREAK', payload: exam.id });
        }
        if (exam.sp.onReaderWriter && readerWriterTimeRemaining <= 0) {
            dispatch({ type: 'TOGGLE_READER_WRITER', payload: exam.id });
        }
    }, [exam.sp.onRest, exam.sp.onReaderWriter, spTimeRemaining, readerWriterTimeRemaining, dispatch, exam.id, isStandardised]);


    const showRealTimes = isLive || autoStartTargetTime;
    
    const handleEditClick = useCallback(() => {
        if (isLive) {
            dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'editLiveExam', data: exam.id } });
        } else {
            dispatch({ type: 'SET_EDITING_EXAM_ID', payload: exam.id });
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' });
        }
    }, [isLive, dispatch, exam.id]);
    
    const handleMouseOver = useCallback((content: React.ReactNode) => (e: React.MouseEvent<HTMLElement>) => {
        if (showTooltips) {
            showTooltip(content, e.currentTarget);
        }
    }, [showTooltips, showTooltip]);

    const handleToggleRestBreak = useCallback(() => {
        dispatch({ type: 'TOGGLE_REST_BREAK', payload: exam.id });
    }, [dispatch, exam.id]);

    const handleToggleReaderWriter = useCallback(() => {
        dispatch({ type: 'TOGGLE_READER_WRITER', payload: exam.id });
    }, [dispatch, exam.id]);

    const handleReportDisruption = useCallback(() => {
        dispatch({ type: 'SET_DISRUPTION_TARGET', payload: exam.id });
    }, [dispatch, exam.id]);

    const handleResumeExam = useCallback(() => {
        dispatch({ type: 'RESUME_SESSION', payload: { examId: exam.id } });
    }, [dispatch, exam.id]);

    return (
        <div className={`p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300 relative flex flex-col ${cardClass}`}>
            <div className="flex-grow">
                <div className="absolute top-2 right-2 flex space-x-1 z-30">
                    {isLive && exam.status === 'running' && (
                        <button 
                            onClick={handleReportDisruption} 
                            onMouseOver={handleMouseOver(`Report a disruption for "${exam.name}"`)}
                            onMouseOut={hideTooltip}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition" 
                            aria-label={`Disruption for ${exam.name}`}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l7.135 13.621a1.75 1.75 0 01-1.503 2.53H2.625a1.75 1.75 0 01-1.503-2.53L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                        </button>
                    )}
                     <button 
                         onClick={handleEditClick} 
                         onMouseOver={handleMouseOver(`Edit "${exam.name}"`)}
                         onMouseOut={hideTooltip}
                         className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" 
                         aria-label={`Edit ${exam.name}`}
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                     </button>
                    {exam.status === 'finished' && (
                         <button 
                             onClick={() => setIsCollapsed(prev => !prev)} 
                             onMouseOver={handleMouseOver(isCollapsed ? `Expand "${exam.name}"` : `Collapse "${exam.name}"`)}
                             onMouseOut={hideTooltip}
                             className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" 
                             aria-label={isCollapsed ? `Expand ${exam.name}` : `Collapse ${exam.name}`}
                         >
                             {isCollapsed ? (
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                 </svg>
                             ) : (
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                     <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                 </svg>
                             )}
                         </button>
                    )}
                </div>

                {/* --- FIX: EXAM TITLE (CENTERED) --- */}
                <div className="flex items-center justify-center pr-8 mb-3">
                    <SpIcons 
                        exam={exam} 
                        settings={settings} 
                        isStandardised={isStandardised} 
                        onMouseOver={handleMouseOver} 
                        onMouseOut={hideTooltip} 
                    />
                    <div className="flex items-center space-x-2 min-w-0">
                        <FontControl elementId={`exam-title-${exam.id}`} direction="down" />
                        <h3 id={`exam-title-${exam.id}`} className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center min-w-0 break-words leading-tight" style={{ fontSize: settings.fontSizes[`exam-title-${exam.id}`] || 24 }}>
                            {exam.name}
                        </h3>
                        <FontControl elementId={`exam-title-${exam.id}`} direction="up" />
                        {exam.sp.showStudentName && exam.sp.studentName && (
                            <span className="ml-2 px-3 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm font-bold rounded-full whitespace-nowrap">
                                {exam.sp.studentName}
                            </span>
                        )}
                    </div>
                </div>
                
                {isCollapsed ? (
                    <div className="flex justify-center mt-2">
                        <p className="text-2xl font-bold flex items-center gap-2 text-green-700 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Finished
                        </p>
                    </div>
                ) : (
                    <>
                        {isStandardised ? <AccessCodeDisplay exam={exam} settings={settings} isStandardised={isStandardised} /> : (
                            <div className="space-y-2">
                                {/* --- FIX: STATUS (LEFT-ALIGNED) --- */}
                                {settings.showStatus && (
                            <div className="flex justify-start">
                                <p 
                                    onMouseOver={handleMouseOver(<ExamStatusGraphic status={calculatedStatus} />)}
                                    onMouseOut={hideTooltip}
                                    className={`text-xl font-semibold flex items-center gap-2 cursor-help ${exam.status === 'finished' ? 'text-green-700 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}
                                >
                                    {exam.status === 'finished' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {calculatedStatus}
                                </p>
                            </div>
                        )}
                        
                        {/* --- FIX: EXAM TIMES (LEFT-ALIGNED) --- */}
                        {settings.showTimes && (
                            <div 
                                className="tabular-nums cursor-help flex justify-start" 
                                onMouseOver={handleMouseOver(<StartEndTimelineGraphic start={new Date(startTime)} end={new Date(writeEndTime)} is24hr={settings.is24hr} />)}
                                onMouseOut={hideTooltip}
                            >
                                <div className="flex items-center space-x-2">
                                    <FontControl elementId={`exam-times-${exam.id}`} direction="down" />
                                    <div id={`exam-times-${exam.id}`} className="text-xl font-semibold text-slate-800 dark:text-slate-200 space-y-1 leading-snug" style={{ fontSize: settings.fontSizes[`exam-times-${exam.id}`] || 20 }}>
                                        {showRealTimes ? (
                                            settings.singleLineTime ? (
                                                <div className="flex flex-wrap items-center gap-x-3">
                                                    {settings.timeBreakdown ? (
                                                        <>
                                                            <span><span className="text-slate-500 dark:text-slate-400 font-medium">R:</span> {formatClockTime(new Date(startTime), settings.is24hr, false)} - {formatClockTime(new Date(readEndTime), settings.is24hr, false)}</span>
                                                            <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
                                                            <span><span className="text-slate-500 dark:text-slate-400 font-medium">W:</span> {formatClockTime(new Date(readEndTime), settings.is24hr, false)} - {formatClockTime(new Date(writeEndTime), settings.is24hr, false)}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span><span className="text-slate-500 dark:text-slate-400 font-medium">Start:</span> {formatClockTime(new Date(startTime), settings.is24hr, false)}</span>
                                                            <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
                                                            <span><span className="text-slate-500 dark:text-slate-400 font-medium">End:</span> {formatClockTime(new Date(writeEndTime), settings.is24hr, false)}</span>
                                                        </>
                                                    )}
                                                </div>
                                             ) : (
                                                 <>
                                                     <p><span className="text-slate-500 dark:text-slate-400 font-medium">Start:</span> {formatClockTime(new Date(startTime), settings.is24hr, false)}</p>
                                                     {settings.timeBreakdown && <p><span className="text-slate-500 dark:text-slate-400 font-medium">Reading End:</span> {formatClockTime(new Date(readEndTime), settings.is24hr, false)}</p>}
                                                     <p><span className="text-slate-500 dark:text-slate-400 font-medium">End:</span> {formatClockTime(new Date(writeEndTime), settings.is24hr, false)}</p>
                                                 </>
                                             )
                                         ) : (
                                             settings.singleLineTime ? (
                                                 <div className="flex flex-wrap items-center gap-x-3">
                                                     <span><span className="text-slate-500 dark:text-slate-400 font-medium">Start:</span> --:--</span>
                                                     <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>
                                                     <span><span className="text-slate-500 dark:text-slate-400 font-medium">End:</span> --:--</span>
                                                 </div>
                                             ) : (
                                                 <>
                                                     <p><span className="text-slate-500 dark:text-slate-400 font-medium">Start:</span> --:--</p>
                                                     <p><span className="text-slate-500 dark:text-slate-400 font-medium">End:</span> --:--</p>
                                                 </>
                                             )
                                        )}
                                    </div>
                                    <FontControl elementId={`exam-times-${exam.id}`} direction="up" />
                                </div>
                            </div>
                        )}

                        {/* --- FIX: COUNTDOWN (CENTERED) --- */}
                        {settings.showCountdown && (
                            <div className="flex items-center justify-center space-x-2 pt-2">
                                <FontControl elementId={`exam-countdown-${exam.id}`} direction="down" />
                                <p 
                                    id={`exam-countdown-${exam.id}`} 
                                    className="text-center text-4xl font-bold tabular-nums text-slate-800 dark:text-slate-200 leading-tight"
                                    style={{fontSize: settings.fontSizes[`exam-countdown-${exam.id}`] || 36}}
                                >
                                    {formatTime(timeRemaining)}
                                </p>
                                <FontControl elementId={`exam-countdown-${exam.id}`} direction="up" />
                            </div>
                        )}
                    </div>
                )}

                {/* --- FIX: OPTIONAL INFO (LEFT-ALIGNED) --- */}
                {exam.optionalInfo && (
                    <div className="flex items-start space-x-2 mt-4 min-w-0">
                        <FontControl elementId={`optional-info-${exam.id}`} direction="down" />
                                <p id={`optional-info-${exam.id}`} className="text-slate-600 dark:text-slate-400 flex-grow min-w-0 break-words leading-normal" style={{fontSize: settings.fontSizes[`optional-info-${exam.id}`] || 14}}>
                                    {exam.optionalInfo}
                                </p>
                                <FontControl elementId={`optional-info-${exam.id}`} direction="up" />
                            </div>
                        )}
                    </>
                )}
            </div>

            {!isCollapsed && (
                <div className="mt-auto">
                        <SpControls 
                            exam={exam} 
                            settings={settings} 
                            isLive={isLive} 
                            isStandardised={isStandardised} 
                            spTimeRemaining={spTimeRemaining} 
                            readerWriterTimeRemaining={readerWriterTimeRemaining} 
                            showSpCountdown={showSpCountdown} 
                            onToggleRestBreak={handleToggleRestBreak} 
                            onToggleReaderWriter={handleToggleReaderWriter} 
                        />
                </div>
            )}
            
            {(exam.isPaused || (isSessionPaused && !exam.isPaused && exam.status === 'running')) && (
                 <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm text-white flex flex-col items-center justify-center p-6 text-center rounded-lg z-20">
                     <span className="font-bold text-3xl tracking-widest mb-2">PAUSED</span>
                     <span className="font-medium text-xl text-slate-300 mb-6">{exam.name}</span>
                     {exam.isPaused && (
                         <button 
                             onClick={handleResumeExam}
                             className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded-full shadow-lg transition"
                         >
                             Resume Exam
                         </button>
                     )}
                 </div>
            )}

        </div>
    );
};

export default React.memo(ExamTimerCard, (prevProps, nextProps) => {
    const prev = prevProps.exam;
    const next = nextProps.exam;

    return (
        prev.id === next.id &&
        prev.name === next.name &&
        prev.optionalInfo === next.optionalInfo &&
        prev.accessCode === next.accessCode &&
        prev.hasAccessCode === next.hasAccessCode &&
        prev.status === next.status &&
        prev.isPaused === next.isPaused &&
        prev.calculatedStatus === next.calculatedStatus &&
        prev.timeRemaining === next.timeRemaining &&
        prev.spTimeRemaining === next.spTimeRemaining &&
        prev.readerWriterTimeRemaining === next.readerWriterTimeRemaining &&
        prev.canStartRestBreak === next.canStartRestBreak &&
        prev.canEndRestBreak === next.canEndRestBreak &&
        prev.cardClass === next.cardClass &&
        prev.sp.onRest === next.sp.onRest &&
        prev.sp.onReaderWriter === next.sp.onReaderWriter &&
        prev.sp.extraTime === next.sp.extraTime &&
        prev.sp.restBreaks === next.sp.restBreaks &&
        prev.sp.readerWriterTime === next.sp.readerWriterTime &&
        prev.startTime === next.startTime &&
        prev.readEndTime === next.readEndTime &&
        prev.writeEndTime === next.writeEndTime
    );
});
