import React from 'react';
import { useStore } from '../../context/useStore';
import StandardPresetModal from './StandardPresetModal';
import NaplanWizardModal from './NaplanWizardModal';

interface PresetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose }) => {
    const sessionMode = useStore(state => state.sessionMode);
    const settings = useStore(state => state.settings);

    const showNaplanWizard = sessionMode === 'standardised' && settings.sessionTitle === 'NAPLAN';

    if (showNaplanWizard) {
        return <NaplanWizardModal isOpen={isOpen} onClose={onClose} />;
    }
    
    return <StandardPresetModal isOpen={isOpen} onClose={onClose} />;
};

export default PresetModal;
