import React from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../context/AppContext';
import type { ConfirmActionType } from '../../types';

const CONFIRM_DETAILS: Record<ConfirmActionType, { title: string; message: string; confirmText?: string }> = {
    deleteExam: { title: 'Delete Exam?', message: 'Are you sure you want to permanently delete this examination?' },
    clearAll: { title: 'Clear All Exams?', message: 'This will delete all examinations you have added. This cannot be undone.' },
    resetAll: { title: 'Reset All Settings?', message: 'This will restore all display options to their defaults and clear all exams.' },
    endSession: { title: 'End Session?', message: 'This will stop all timers and return to the setup page. Exams and settings will be saved.', confirmText: 'End Session' },
    endAndReset: { title: 'End & Reset Session?', message: 'This will stop all timers, clear all exams, and reset all settings.' },
    abandon: { title: 'Abandon Session?', message: 'This will permanently stop all timers. This action cannot be undone.' },
    editLiveExam: { title: 'Edit Live Exam?', message: 'Editing an exam during a live session may cause confusion. Are you sure?', confirmText: 'Proceed' },
    import: { title: 'Import Session?', message: 'This will overwrite your current exams and settings. Are you sure?', confirmText: 'Import' },
};


const ConfirmModal: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { type, data } = state.ui.confirmAction;
    const { sessionMode } = state;

    const isOpen = state.ui.activeModal === 'confirm' && type !== null;

    const handleClose = () => {
        dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: null } });
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: null });
    };

    const handleConfirm = () => {
        if (!type) return;

        switch (type) {
            case 'deleteExam':
                dispatch({ type: 'DELETE_EXAM', payload: data });
                break;
            case 'clearAll':
                dispatch({ type: 'CLEAR_ALL_EXAMS' });
                break;
            case 'resetAll':
                dispatch({ type: 'RESET_ALL' });
                break;
            case 'import':
                dispatch({ type: 'IMPORT_SESSION', payload: data });
                break;
            case 'endSession':
                dispatch({ type: 'END_SESSION', payload: { shouldReset: false } });
                break;
            case 'endAndReset':
                dispatch({ type: 'END_SESSION', payload: { shouldReset: true } });
                break;
            case 'editLiveExam':
                dispatch({ type: 'SET_EDITING_EXAM_ID', payload: data });
                dispatch({ type: 'SET_ACTIVE_MODAL', payload: 'exam' });
                // We don't close the confirm modal here, because SET_ACTIVE_MODAL will handle it
                return; // Return early to avoid handleClose
            // Other cases will be handled elsewhere, this modal just confirms
            default:
                // For unhandled cases, we just close the modal.
                break;
        }

        handleClose();
    };

    if (!isOpen || !type) return null;

    let details = { ...CONFIRM_DETAILS[type] };

    if (type === 'endSession' && sessionMode === 'standardised') {
        details.title = 'Finish Session?';
        details.message = 'This will end the session and return you to the setup page.';
        details.confirmText = 'Finish Session';
    }


    return (
        <Modal isOpen={isOpen} onClose={handleClose} ariaLabel={details.title}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{details.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{details.message}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                    >
                        {details.confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;