import React, { useEffect } from 'react';
import type { CalculatedExam } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatTime, formatClockTime } from '../../utils/time';
import FontControl from './FontControl';
import { useTooltip } from '../../context/TooltipContext';
import { ExamStatusGraphic, StartEndTimelineGraphic } from '../ui/TooltipGraphics';
import { CARD_COLORS } from '../../constants';

interface ExamTimerCardProps {
    exam: CalculatedExam;
}

const ExamTimerCard: React.FC<ExamTimerCardProps> = ({ exam }) => {
    const { state, dispatch } = useAppContext();
    const { settings, isLive, autoStartTargetTime, isPaused: isSessionPaused, sessionMode } = state;
    const { showTooltip, hideTooltip } = useTooltip();

    const { calculatedStatus, timeRemaining, cardClass: alertCardClass, spTimeRemaining, readerWriterTimeRemaining, startTime = 0, readEndTime = 0, writeEndTime = 0 } = exam;

    const { showSpCountdown } = settings;
    const isStandardised = sessionMode === 'standardised';
    
    // --- REFACTORED COLOR LOGIC ---
    let finalCardClass: string;
    let titleColorClass: string;

    if (isStandardised) {
        // Standardised tests are always amber and ignore custom colours.
        finalCardClass = 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900';
        titleColorClass = 'text-amber-900 dark:text-amber-100';
    } else {
        // Use custom color logic for regular exams.
        const customColor = CARD_COLORS.find(c => c.name === exam.color) || CARD_COLORS[0];
        
        if (settings.colorAlerts) {
            finalCardClass = alertCardClass;
            titleColorClass = customColor.name !== 'Default' 
                ? `${customColor.text} ${customColor.darkText}` 
                : 'text-slate-900 dark:text-slate-100';
        } else {
            finalCardClass = `${customColor.bg} ${customColor.darkBg} ${customColor.border} ${customColor.darkBorder}`;
            titleColorClass = `${customColor.text} ${customColor.darkText}`;
        }
    }
    // --- END OF REFACTORED LOGIC ---

    // ... (rest of the component is unchanged, only the final render uses the new classes)

    return (
        <div className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 relative flex flex-col ${finalCardClass}`}>
            <div className="flex-grow">
                <div className="absolute top-2 right-2 flex space-x-1 z-10">
                    {/* ... edit/disruption buttons ... */}
                </div>

                <div className="flex items-center justify-center pr-8 mb-3">
                    {/* ... SP icons ... */}
                    <div className="flex items-center space-x-2">
                        <FontControl elementId={`exam-title-${exam.id}`} direction="down" />
                        <h3 id={`exam-title-${exam.id}`} className={`text-2xl font-bold text-center ${titleColorClass}`} style={{ fontSize: settings.fontSizes[`exam-title-${exam.id}`] || 24 }}>
                            {exam.name}
                        </h3>
                        <FontControl elementId={`exam-title-${exam.id}`} direction="up" />
                    </div>
                </div>
                
                {isStandardised ? (
                    {/* ... access code render ... */}
                ) : (
                    <div className="space-y-2">
                        {/* ... regular exam details ... */}
                    </div>
                )}
            </div>

            <div className="mt-auto">
                {/* ... SP controls ... */}
            </div>
            
            {(exam.isPaused || (isSessionPaused && !exam.isPaused && exam.status === 'running')) && (
                 <div className="absolute inset-0 bg-slate-800/80 text-white flex items-center justify-center font-bold text-2xl rounded-lg z-20">PAUSED</div>
            )}
        </div>
    );
};

export default ExamTimerCard;
