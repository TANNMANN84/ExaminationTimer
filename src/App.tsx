import React, { useEffect } from 'react';
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
import GeniusModal from './components/modals/GeniusModal';
import NaplanWizardModal from './components/modals/NaplanWizardModal';
import StandardPresetModal from './components/modals/StandardPresetModal';
import { exportSession } from './utils/export';

const App: React.FC = () => {
    const { state, dispatch } = useAppContext();

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
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [state.ui.theme]);
    
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (state.isLive) {
                e.preventDefault();
                e.returnValue = 'A live session is active. Are you sure you want to leave?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [state.isLive]);

    useEffect(() => {
        const welcomeShown = sessionStorage.getItem('welcomeShown');
        if (!welcomeShown) {
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'welcome' });
        }
    }, [dispatch]);

    useHotkeys('ctrl+s, command+s', (e) => {
        e.preventDefault();
        exportSession(state);
    }, [state]);

    useHotkeys('ctrl+o, command+o', (e) => {
        e.preventDefault();
        document.getElementById('import-file-input')?.click();
    });
    
    const handleCloseModal = () => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: null });
    };

    const handleWelcomeClose = () => {
        sessionStorage.setItem('welcomeShown', 'true');
        handleCloseModal();
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
                    isOpen={state.ui.activeModal === 'welcome'}
                    onClose={handleWelcomeClose}
                />
                <Tooltip />

                <ConfirmModal />
                
                <PresetModal
                    isOpen={state.ui.activeModal === 'preset'}
                    onClose={handleCloseModal}
                />
                <ExamModal 
                    isOpen={state.ui.activeModal === 'exam'}
                    onClose={handleCloseModal}
                />
                <LiveSettingsModal
                    isOpen={state.ui.activeModal === 'liveSettings'}
                    onClose={handleCloseModal}
                />
                <AutoStartModal
                    isOpen={state.ui.activeModal === 'autoStart'}
                    onClose={handleCloseModal}
                />
                <DisruptionModal
                    isOpen={state.ui.activeModal === 'emergency'}
                    onClose={handleCloseModal}
                />
                <GeniusModal 
                    isOpen={state.ui.activeModal === 'genius'}
                    onClose={handleCloseModal}
                />
                 <NaplanWizardModal 
                    isOpen={state.ui.activeModal === 'naplanWizard'}
                    onClose={handleCloseModal}
                />
                 <StandardPresetModal 
                    isOpen={state.ui.activeModal === 'standardPreset'}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default App;
