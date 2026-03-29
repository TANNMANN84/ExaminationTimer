import { useEffect } from 'react';
import type { AppState } from '../types';

export const useSessionPersistence = (state: AppState) => {
    useEffect(() => {
        const stateToSave = {
            settings: state.settings,
            exams: state.exams,
            sessionMode: state.sessionMode,
            isLive: state.isLive,
            currentPage: state.currentPage,
            isPaused: state.isPaused,
            pauseStartTime: state.pauseStartTime,
            pauseDurationTotal: state.pauseDurationTotal,
            autoStartTargetTime: state.autoStartTargetTime,
            sessionLog: state.sessionLog,
            ui: {
                showTooltips: state.ui.showTooltips,
                fontLockEnabled: state.ui.fontLockEnabled,
                fabsCollapsed: state.ui.fabsCollapsed,
                theme: state.ui.theme,
                showFontControls: state.ui.showFontControls,
            },
        };
        localStorage.setItem('examTimerState', JSON.stringify(stateToSave));
    }, [
        state.settings,
        state.exams,
        state.sessionMode,
        state.isLive,
        state.currentPage,
        state.isPaused,
        state.pauseStartTime,
        state.pauseDurationTotal,
        state.autoStartTargetTime,
        state.sessionLog,
        state.ui.showTooltips,
        state.ui.fontLockEnabled,
        state.ui.fabsCollapsed,
        state.ui.theme,
        state.ui.showFontControls,
    ]);
};