import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/AppContext';
import WelcomeModal from './components/modals/WelcomeModal';
import SetupPage from './components/pages/SetupPage';
import ExamPage from './components/pages/ExamPage';
import Footer from './components/ui/Footer';
import { useWakeLock } from './hooks/useWakeLock';
import { Tooltip } from './components/ui/Tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import ConfirmModal from './components/modals/ConfirmModal';
import PresetModal from './components/modals/PresetModal';
import ExamModal from './components/modals/ExamModal';
import LiveSettingsModal from './components/modals/LiveSettingsModal';
import AutoStartModal from './components/modals/AutoStartModal';
import DisruptionModal from './components/modals/DisruptionModal';
import { exportSession } from './utils/export';
// 1. IMPORT our new wizard modals
import NaplanWizardModal from './components/modals/NaplanWizardModal';
import CheckinWizardModal from './components/modals/CheckinWizardModal';

const App: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

    useWakeLock(state.isLive);

    useEffect(() => {
        const handleSystemThemeChange = () => {
            if (state.ui.theme === 'dark' || 
                (state.ui.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        handleSystemThemeChange();
        const systemThemeWatcher = window.matchMedia('(prefers-color-scheme: dark)');
        systemThemeWatcher.addEventListener('change', handleSystemThemeChange);
        return () => {
            systemThemeWatcher.removeEventListener('change', handleSystemThemeChange);
        };
    }, [state.ui.theme]);

    useEffect(() => {
        const manageFullscreen = async () => {
            try {
                if (state.isLive && !document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                } else if (!state.isLive && document.fullscreenElement) {
                    await document.exitFullscreen();
                }
            } catch (err: any) {
                 console.error(`Fullscreen Error: ${err.message} (${err.name})`);
            }
        };
        manageFullscreen();
    }, [state.isLive]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = 'Are you sure you want to leave? Your live exam session will be interrupted.';
        };

        if (state.isLive) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [state.isLive]);

    useEffect(() => {
        if (!sessionStorage.getItem('welcomeShown')) {
            setWelcomeModalOpen(true);
        }
    }, []);

    useHotkeys('ctrl+s, command+s', (e: KeyboardEvent) => {
        e.preventDefault();
        exportSession(state);
    }, [state]);
     useHotkeys('ctrl+o, command+o', (e: KeyboardEvent) => {
        e.preventDefault();
        document.getElementById('import-file-input')?.click();
    });

    const handleWelcomeClose = () => {
        sessionStorage.setItem('welcomeShown', 'true');
        setWelcomeModalOpen(false);
    };

    const containerClasses = [
        state.ui.showFontControls ? 'show-font-controls' : '',
    ].join(' ');

    return (
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 antialiased min-h-screen">
            <div id="app-container" className={`group ${containerClasses} pb-16`}>
                {state.currentPage === 'setup' && <SetupPage />}
                {state.currentPage === 'exam' && <ExamPage />}

                <Footer />

                <WelcomeModal
                    isOpen={welcomeModalOpen}
                    onClose={handleWelcomeClose}
                />
                <Tooltip />

                <ConfirmModal />
                
                <PresetModal
                    isOpen={state.ui.activeModal === 'preset'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                <ExamModal 
                    isOpen={state.ui.activeModal === 'exam'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                <LiveSettingsModal
                    isOpen={state.ui.activeModal === 'liveSettings'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                <AutoStartModal
                    isOpen={state.ui.activeModal === 'autoStart'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                <DisruptionModal
                    isOpen={state.ui.activeModal === 'emergency'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />

                {/* 2. RENDER the new wizard modals */}
                <NaplanWizardModal
                    isOpen={state.ui.activeModal === 'naplanWizard'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                <CheckinWizardModal
                    isOpen={state.ui.activeModal === 'checkInWizard'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
            </div>
        </div>
    );
};

export default App;