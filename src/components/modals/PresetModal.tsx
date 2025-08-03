import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StandardPresetModal from './StandardPresetModal';
import NaplanWizardModal from './NaplanWizardModal';

interface PresetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose }) => {
    const { state } = useAppContext();
    const { sessionMode, settings } = state;

    const showNaplanWizard = sessionMode === 'standardised' && settings.sessionTitle === 'NAPLAN';

    if (showNaplanWizard) {
        return <NaplanWizardModal isOpen={isOpen} onClose={onClose} />;
    }
    
    return <StandardPresetModal isOpen={isOpen} onClose={onClose} />;
};

export default PresetModal;
