import React from 'react';
import type { CalculatedExam, Settings } from '../../../types';
import FontControl from '../FontControl';

interface AccessCodeDisplayProps {
    exam: CalculatedExam;
    settings: Settings;
    isStandardised: boolean;
}

const AccessCodeDisplay: React.FC<AccessCodeDisplayProps> = ({ exam, settings, isStandardised }) => {
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
                if (i === 2 || i === 4 || i === 7 || i === 9) {
                    renderedElements.push(<span key={`hyphen-${i}`} className="text-slate-500 dark:text-slate-400" style={{ fontSize: `${digitFontSize}px`, lineHeight: 1 }}>-</span>);
                }
            }
        }
    }

    return (
        <div className="my-3 space-y-2 min-w-0">
            <div className="flex items-center justify-center space-x-2 min-w-0">
                <FontControl elementId={`access-code-title-${exam.id}`} direction="down" />
                <p id={`access-code-title-${exam.id}`} className="font-semibold text-slate-800 dark:text-slate-200 text-center min-w-0 break-words leading-tight" style={{ fontSize: `${titleFontSize}px` }}>
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
    );
};

export default AccessCodeDisplay;