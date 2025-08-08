import { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { TooltipProvider } from './context/TooltipContext';
import SetupPage from './components/pages/SetupPage';
import ExamPage from './components/pages/ExamPage';
import Modal from './components/ui/Modal';
import WelcomeModal from './components/modals/WelcomeModal';
import ExamModal from './components/modals/ExamModal';
import PresetModal from './components/modals/PresetModal';
import StandardPresetModal from './components/modals/StandardPresetModal';
import NaplanWizardModal from './components/modals/NaplanWizardModal';
import ConfirmModal from './components/modals/ConfirmModal';
import DisruptionModal from './components/modals/DisruptionModal';
import LiveSettingsModal from './components/modals/LiveSettingsModal';
import AutoStartModal from './components/modals/AutoStartModal';
import GeniusModal from './components/modals/GeniusModal';

const AppContent = () => {
    const { state, dispatch } = useAppContext();
    const { currentPage, ui: { activeModal, confirmAction }, exams } = state;

    useEffect(() => {
        // Apply theme class to the root element
        const root = window.document.documentElement;
        const currentTheme = state.ui.theme;

        if (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [state.ui.theme]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (state.isLive) {
                const confirmationMessage = 'A session is currently live. Are you sure you want to leave? This will end the session.';
                e.returnValue = confirmationMessage;
                return confirmationMessage;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [state.isLive]);

    useEffect(() => {
        // Show welcome modal only if there are no exams and it hasn't been shown before
        if (exams.length === 0 && localStorage.getItem('hasSeenWelcomeModal') !== 'true') {
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'welcome' });
            localStorage.setItem('hasSeenWelcomeModal', 'true');
        }
    }, [exams.length, dispatch]);

    const handleCloseModal = () => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: null });
    };

    const handleConfirm = () => {
        if (confirmAction.type) {
            dispatch(confirmAction);
            dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: null } });
        }
        handleCloseModal();
    };

    return (
        <>
            {currentPage === 'setup' && <SetupPage />}
            {currentPage === 'exam' && <ExamPage />}

            <Modal isOpen={!!activeModal} onClose={handleCloseModal}>
                {activeModal === 'welcome' && <WelcomeModal onClose={handleCloseModal} />}
                {activeModal === 'exam' && <ExamModal onClose={handleCloseModal} />}
                {activeModal === 'preset' && <PresetModal onClose={handleCloseModal} />}
                {activeModal === 'standardPreset' && <StandardPresetModal onClose={handleCloseModal} />}
                {activeModal === 'naplanWizard' && <NaplanWizardModal onClose={handleCloseModal} />}
                {activeModal === 'emergency' && <DisruptionModal onClose={handleCloseModal} />}
                {activeModal === 'liveSettings' && <LiveSettingsModal onClose={handleCloseModal} />}
                {activeModal === 'autoStart' && <AutoStartModal onClose={handleCloseModal} />}
                {activeModal === 'confirm' && (
                    <ConfirmModal
                        action={confirmAction.type || ''}
                        onConfirm={handleConfirm}
                        onCancel={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: null } })}
                    />
                )}
                 {activeModal === 'genius' && <GeniusModal onClose={handleCloseModal} />}
            </Modal>
        </>
    );
};


const App = () => {
    return (
        <AppProvider>
            <TooltipProvider>
                <AppContent />
            </TooltipProvider>
        </AppProvider>
    );
};

export default App;
