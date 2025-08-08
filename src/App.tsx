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
import GeniusModal from './components/modals/GeniusModal';
import NaplanWizardModal from './components/modals/NaplanWizardModal';
import StandardPresetModal from './components/modals/StandardPresetModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { exportSession } from './utils/export';

const App: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

    useWakeLock(state.isLive);

    useEffect(() => {
        // Corrected logic for showing the Welcome Modal
        const hasSeenWelcome = sessionStorage.getItem('welcomeShown');
        if (!hasSeenWelcome) {
            setWelcomeModalOpen(true);
        }
    }, []);

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

    useHotkeys('ctrl+s, command+s', (e) => {
        e.preventDefault();
        exportSession(state);
    }, [state]);

    useHotkeys('ctrl+o, command+o', (e) => {
        e.preventDefault();
        document.getElementById('import-file-input')?.click();
    });

    const handleWelcomeClose = () => {
        setWelcomeModalOpen(false);
        sessionStorage.setItem('welcomeShown', 'true');
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

                {/* The individual modal components are rendered here with the correct props */}
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
                <GeniusModal 
                    isOpen={state.ui.activeModal === 'genius'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                 <NaplanWizardModal 
                    isOpen={state.ui.activeModal === 'naplanWizard'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                 <StandardPresetModal 
                    isOpen={state.ui.activeModal === 'standardPreset'}
                    onClose={() => dispatch({ type: 'SET_ACTIVE_MODAL', payload: null })}
                />
                 <SettingsModal 
                    isOpen={false} // This seems to be unused, keeping it as-is from original
                    onClose={() => {}}
                />
            </div>
        </div>
    );
};

export default App;
