import React, { useEffect } from 'react';
import type { CalculatedExam } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatTime, formatClockTime } from '../../utils/time';
import FontControl from './FontControl';
import { useTooltip } from '../../context/TooltipContext';
import { ExamStatusGraphic, StartEndTimelineGraphic } from '../ui/TooltipGraphics';

interface ExamTimerCardProps {
    exam: CalculatedExam;
}

const ExamTimerCard: React.FC<ExamTimerCardProps> = ({ exam }) => {
    const { state, dispatch } = useAppContext();
    const { settings, isLive, autoStartTargetTime, isPaused: isSessionPaused, sessionMode } = state;
    const { showTooltip, hideTooltip } = useTooltip();

    const { calculatedStatus, timeRemaining, cardClass, spTimeRemaining, readerWriterTimeRemaining, startTime = 0, readEndTime = 0, writeEndTime = 0 } = exam;

    const { showSpCountdown } = settings;
    const isStandardised = sessionMode === 'standardised';

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
    
    const handleEditClick = () => {
        if (isLive) {
            dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'editLiveExam', data: exam.id } });
        } else {
            dispatch({ type: 'SET_EDITING_EXAM_ID', payload: exam.id });
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' });
        }
    };
    
    const handleMouseOver = (content: React.ReactNode) => (e: React.MouseEvent<HTMLElement>) => {
        if (state.ui.showTooltips) {
            showTooltip(content, e.currentTarget);
        }
    };

    const renderAccessCode = () => {
        const code = exam.accessCode || '';
        if (!isStandardised || !exam.hasAccessCode || !code) return null;

        const codeDigits = code.split('');
        const titleFontSize = settings.fontSizes[`access-code-title-${exam.id}`] || 20;
        const digitFontSize = settings.fontSizes[`access-code-digits-${exam.id}`] || 20;
        const isNaplan = settings.sessionTitle === 'NAPLAN';

        const boxWidth = digitFontSize * 1.6;
        const boxHeight = digitFontSize * 2.0;

        const renderedElements: React.ReactElement[] = [];
        for (let i = 0; i < codeDigits.length; i++) {
            renderedElements.push(
                <div
                    key={`digit-${i}`}
                    className="flex items-center justify-center border border-slate-400 dark:border-slate-600 rounded-md font-mono font-bold text-slate-800 dark:text-slate-200"
                    style={{
                        fontSize: `${digitFontSize}px`,
                        width: `${boxWidth}px`,
                        height: `${boxHeight}px`,
                    }}
                >
                    {codeDigits[i]}
                </div>
            );

            const isLastDigit = i === codeDigits.length - 1;
            if (!isLastDigit) {
                if (isNaplan) {
                    if (i === 2 || i === 4) {
                        renderedElements.push(<span key={`hyphen-${i}`} className="text-slate-500 dark:text-slate-400" style={{ fontSize: `${digitFontSize}px`, lineHeight: 1 }}>-</span>);
                    }
                } else {
                    // 3-2-3-2 pattern for other tests
                    if (i === 2 || i === 4 || i === 7 || i === 9) {
                        renderedElements.push(<span key={`hyphen-${i}`} className="text-slate-500 dark:text-slate-400" style={{ fontSize: `${digitFontSize}px`, lineHeight: 1 }}>-</span>);
                    }
                }
            }
        }

        return (
             <div className="my-3 space-y-2">
                 <div className="flex items-center justify-center space-x-2">
                    <FontControl elementId={`access-code-title-${exam.id}`} direction="down" />
                    <p id={`access-code-title-${exam.id}`} className="font-semibold text-slate-800 dark:text-slate-200 text-center" style={{ fontSize: `${titleFontSize}px` }}>
                        Access Code
                    </p>
                    <FontControl elementId={`access-code-title-${exam.id}`} direction="up" />
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <FontControl elementId={`access-code-digits-${exam.id}`} direction="down" />
                     <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                        {renderedElements}
                    </div>
                    <FontControl elementId={`access-code-digits-${exam.id}`} direction="up" />
                </div>
             </div>
        )
    };

    const renderSPControls = () => {
        if (!isLive || !settings.specialProvisions || !settings.showSPLive || isStandardised) return null;
        
        const hasRestBreaks = exam.sp.restBreaks > 0;
        const hasRwTime = exam.sp.readerWriterTime > 0;
        
        if (!hasRestBreaks && !hasRwTime) return null;

        const isRestBreakTimeUp = spTimeRemaining <= 0;
        const isRwTimeUp = readerWriterTimeRemaining <= 0;
        
        const totalRestMillis = exam.sp.restBreaks * 60000;
        const restProgress = totalRestMillis > 0 ? Math.min((exam.sp.restTaken / totalRestMillis) * 100, 100) : 0;
        const restStyle = !showSpCountdown ? {
             background: `linear-gradient(to right, #3730a3 ${restProgress}%, #4f46e5 ${restProgress}%)`
        } : {};

        const totalRwMillis = exam.sp.readerWriterTime * 60000;
        const rwProgress = totalRwMillis > 0 ? Math.min((exam.sp.readerWriterTaken / totalRwMillis) * 100, 100) : 0;
        const rwStyle = !showSpCountdown ? {
            background: `linear-gradient(to right, #6b21a8 ${rwProgress}%, #9333ea ${rwProgress}%)`
        } : {};

        return (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
                {hasRestBreaks && (
                    <div className="text-center">
                        {showSpCountdown && (
                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                Approved Rest Break Time: <span className="tabular-nums">{formatTime(spTimeRemaining)}</span>
                            </p>
                        )}
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_REST_BREAK', payload: exam.id })}
                            disabled={isRestBreakTimeUp || exam.sp.onReaderWriter}
                            style={restStyle}
                            className="mt-1 px-4 py-1 text-white text-sm font-bold rounded-full transition bg-blue-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exam.sp.onRest ? 'End Rest Break' : isRestBreakTimeUp ? 'No Breaks Left' : 'Start Rest Break'}
                        </button>
                    </div>
                )}
                {hasRestBreaks && hasRwTime && <div className="border-t border-blue-200 dark:border-blue-700"></div>}
                {hasRwTime && (
                    <div className="text-center">
                         {showSpCountdown && (
                            <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                Approved R/W Time: <span className="tabular-nums">{formatTime(readerWriterTimeRemaining)}</span>
                            </p>
                        )}
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_READER_WRITER', payload: exam.id })}
                            disabled={isRwTimeUp || exam.sp.onRest}
                            style={rwStyle}
                            className="mt-1 px-4 py-1 text-white text-sm font-bold rounded-full transition bg-purple-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exam.sp.onReaderWriter ? 'End R/W Session' : isRwTimeUp ? 'Allowance Applied' : 'Start Reader/Writer'}
                        </button>
                    </div>
                )}
            </div>
        );
    }
    
    const renderSPIcons = () => {
        if (!settings.specialProvisions || isStandardised) return null;
        return (
            <div className="flex items-center gap-2 mr-3">
                {exam.sp.extraTime > 0 && (
                     <div 
                        onMouseOver={handleMouseOver(`Approved Extra Time: ${exam.sp.extraTime} mins`)} 
                        onMouseOut={hideTooltip}
                        className="cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                )}
                {exam.sp.restBreaks > 0 && (
                    <div 
                        onMouseOver={handleMouseOver(`Approved Rest Breaks: ${exam.sp.restBreaks} mins`)} 
                        onMouseOut={hideTooltip}
                        className="cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" /></svg>
                    </div>
                )}
                {exam.sp.readerWriterTime > 0 && (
                     <div 
                        onMouseOver={handleMouseOver(`Approved Reader/Writer Time: ${exam.sp.readerWriterTime} mins`)} 
                        onMouseOut={hideTooltip}
                        className="cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                           <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300 relative flex flex-col ${cardClass}`}>
            <div className="flex-grow">
                <div className="absolute top-2 right-2 flex space-x-1 z-10">
                    {isLive && exam.status === 'running' && (
                        <button 
                            onClick={() => dispatch({type: 'SET_DISRUPTION_TARGET', payload: exam.id})} 
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
                </div>

                <div className="flex items-start space-x-2">
                    <FontControl elementId={`exam-title-${exam.id}`} direction="down" />
                    <div className="flex items-center pr-8 flex-grow">
                        {renderSPIcons()}
                        <h3 id={`exam-title-${exam.id}`} className="text-2xl font-bold text-slate-900 dark:text-slate-100" style={{ fontSize: settings.fontSizes[`exam-title-${exam.id}`] || 24 }}>
                            {exam.name}
                        </h3>
                    </div>
                     <FontControl elementId={`exam-title-${exam.id}`} direction="up" />
                </div>
                
                {isStandardised ? renderAccessCode() : (
                    <div className="my-3 space-y-2">
                        {settings.showStatus && (
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
                        )}
                        
                        {settings.showTimes && (
                            <div className="flex items-center space-x-2">
                                <FontControl elementId={`exam-times-${exam.id}`} direction="down" />
                                <div 
                                    id={`exam-times-${exam.id}`} 
                                    className="flex-grow text-xl font-semibold text-slate-800 dark:text-slate-200 space-y-1 tabular-nums cursor-help" 
                                    style={{ fontSize: settings.fontSizes[`exam-times-${exam.id}`] || 20 }}
                                    onMouseOver={handleMouseOver(<StartEndTimelineGraphic start={new Date(startTime)} end={new Date(writeEndTime)} is24hr={settings.is24hr} />)}
                                    onMouseOut={hideTooltip}
                                >
                                   {showRealTimes ? (
                                        settings.singleLineTime ? (
                                             <p>
                                                {settings.timeBreakdown 
                                                    ? `R: ${formatClockTime(new Date(startTime), settings.is24hr, false)}-${formatClockTime(new Date(readEndTime), settings.is24hr, false)} | W: ${formatClockTime(new Date(readEndTime), settings.is24hr, false)}-${formatClockTime(new Date(writeEndTime), settings.is24hr, false)}`
                                                    : `Start: ${formatClockTime(new Date(startTime), settings.is24hr, false)} - End: ${formatClockTime(new Date(writeEndTime), settings.is24hr, false)}`
                                                }
                                             </p>
                                        ) : (
                                            <>
                                                <p>Start: {formatClockTime(new Date(startTime), settings.is24hr, false)}</p>
                                                {settings.timeBreakdown && <p>Reading End: {formatClockTime(new Date(readEndTime), settings.is24hr, false)}</p>}
                                                <p>End: {formatClockTime(new Date(writeEndTime), settings.is24hr, false)}</p>
                                            </>
                                        )
                                   ) : (
                                        settings.singleLineTime ? (
                                            <p>Start: --:-- - End: --:--</p>
                                        ) : (
                                            <>
                                                <p>Start: --:--</p>
                                                <p>End: --:--</p>
                                            </>
                                        )
                                   )}
                                </div>
                                <FontControl elementId={`exam-times-${exam.id}`} direction="up" />
                            </div>
                        )}

                        {settings.showCountdown && (
                            <div className="flex items-center space-x-2 mt-2">
                                <FontControl elementId={`exam-countdown-${exam.id}`} direction="down" />
                                <p 
                                    id={`exam-countdown-${exam.id}`} 
                                    className="flex-grow text-center text-4xl font-bold tabular-nums text-slate-800 dark:text-slate-200"
                                    style={{fontSize: settings.fontSizes[`exam-countdown-${exam.id}`] || 36}}
                                >
                                    {formatTime(timeRemaining)}
                                </p>
                                <FontControl elementId={`exam-countdown-${exam.id}`} direction="up" />
                            </div>
                        )}
                    </div>
                )}

                {exam.optionalInfo && (
                    <div className="flex items-start space-x-2 mt-4">
                        <FontControl elementId={`optional-info-${exam.id}`} direction="down" />
                        <p id={`optional-info-${exam.id}`} className="text-slate-600 dark:text-slate-400 flex-grow" style={{fontSize: settings.fontSizes[`optional-info-${exam.id}`] || 14}}>
                            {exam.optionalInfo}
                        </p>
                        <FontControl elementId={`optional-info-${exam.id}`} direction="up" />
                    </div>
                )}
            </div>

            <div className="mt-auto">
                {exam.sp.onRest ? (
                    <div className="mt-4 p-4 bg-blue-600 text-white rounded-md text-center">
                        <h4 className="text-xl font-bold">ON REST BREAK</h4>
                        {showSpCountdown && (
                            <p className="text-3xl font-bold tabular-nums my-2">{formatTime(spTimeRemaining)}</p>
                        )}
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_REST_BREAK', payload: exam.id })}
                            className="mt-2 px-6 py-2 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-blue-100 transition"
                        >
                            End Rest & Resume Exam
                        </button>
                    </div>
                ) : exam.sp.onReaderWriter ? (
                    <div className="mt-4 p-4 bg-purple-600 text-white rounded-md text-center">
                        <h4 className="text-xl font-bold">READER/WRITER ACTIVE</h4>
                        {showSpCountdown && (
                            <p className="text-3xl font-bold tabular-nums my-2">{formatTime(readerWriterTimeRemaining)}</p>
                        )}
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_READER_WRITER', payload: exam.id })}
                            className="mt-2 px-6 py-2 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-purple-100 transition"
                        >
                            Reader/writer Not Active
                        </button>
                    </div>
                ) : (
                    renderSPControls()
                )}
            </div>
            
            {(exam.isPaused || (isSessionPaused && !exam.isPaused && exam.status === 'running')) && (
                 <div className="absolute inset-0 bg-slate-800/80 text-white flex items-center justify-center font-bold text-2xl rounded-lg z-20">PAUSED</div>
            )}

        </div>
    );
};

export default ExamTimerCard;