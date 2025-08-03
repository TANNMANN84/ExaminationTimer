import type { AppState } from "../types";
import { formatClockTime } from "./time";

export const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

export const exportSession = (state: AppState) => {
    const sessionData = {
        sessionMode: state.sessionMode,
        settings: state.settings,
        exams: state.exams
    };
    const jsonString = JSON.stringify(sessionData, null, 2);
    const title = state.settings.sessionTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    const filename = `ExamTimer_Session_${title}_${date}.json`;
    downloadTextFile(jsonString, filename);
};


export const exportSessionLog = (state: AppState) => {
    const { settings, exams, sessionLog } = state;

    let logContent = `EXAMINATION SESSION LOG\n===========================\n\n`;
    logContent += `SESSION DETAILS\n-------------------------\n`;
    logContent += `Title: ${settings.sessionTitle}\n`;
    logContent += `Date: ${new Date().toLocaleDateString('en-AU')}\n\n`;

    logContent += `EVENT TIMELINE\n-------------------------\n`;
    logContent += sessionLog.join('\n');
    logContent += `\n\nEXAM SUMMARY AT SESSION END\n-------------------------\n`;

    exams.forEach(exam => {
        const totalDurationMins = exam.readMins + (exam.writeHrs * 60) + exam.writeMins;
        const totalSPMins = exam.sp.extraTime + exam.sp.restBreaks + (exam.sp.readerWriterTime || 0);

        logContent += `\n- Exam: ${exam.name}\n`;
        if (settings.sessionTitle === 'NAPLAN' && exam.accessCode) {
            logContent += `  - Test Access Code: ${exam.accessCode}\n`;
        }
        if (exam.startTime && exam.writeEndTime) {
             logContent += `  - Start: ${formatClockTime(new Date(exam.startTime), settings.is24hr, true)}\n`;
             logContent += `  - Final End: ${formatClockTime(new Date(exam.writeEndTime), settings.is24hr, true)}\n`;
        }
        logContent += `  - Scheduled Duration: ${totalDurationMins} mins\n`;
        if (exam.sp.studentName) {
            logContent += `  - Student with Provisions: ${exam.sp.studentName}\n`;
        }
        if (totalSPMins > 0) {
            logContent += `  - Provisions Allowance: ${totalSPMins} mins (Extra Time: ${exam.sp.extraTime}, Rest Breaks: ${exam.sp.restBreaks}, Reader/Writer: ${exam.sp.readerWriterTime || 0})\n`;
        }
        logContent += `  - Final Status: ${exam.status}\n`;
    });

    const title = settings.sessionTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(logContent, `Exam_Log_${title}_${date}.txt`);
};