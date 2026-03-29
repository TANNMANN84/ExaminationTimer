import React from 'react';
import Modal from '../ui/Modal';
import { useStore } from '../../context/useStore';
import { version as appVersion } from '../../../package.json';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    const crestUrl = useStore(state => state.settings.crestUrl);

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="About & Changelog">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-4xl text-center max-h-[90vh] overflow-y-auto">
                {crestUrl && crestUrl !== '' && (
                    <img src={crestUrl} alt="School Crest" className="h-24 w-auto mx-auto mb-4" />
                )}

                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100">
                    Examination Timer App <span className="text-indigo-500 dark:text-indigo-400 text-4xl">v{appVersion}</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
                    A comprehensive tool for managing and displaying examination timers.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-sm text-slate-600 dark:text-slate-300">
                    <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">✓ Customisable</h3>
                        <p>Tailor display options for any exam type, from HSC to NAPLAN.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">✓ Special Provisions</h3>
                        <p>An array of special provision options to support the needs of individual students.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">✓ Live Controls</h3>
                        <p>Pause, edit, and manage disruptions during a live session.</p>
                    </div>
                </div>

                {/* --- WHAT'S NEW SECTION --- */}
                <div className="mt-8 text-left bg-white dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">What's New in v{appVersion}</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                        <li>
                            <strong>Enhanced Pause Controls:</strong> You can now easily identify and resume individual paused exams directly from the pause overlay.
                        </li>
                        <li>
                            <strong>Improved Layout Responsiveness:</strong> Exam controls, headers, and action buttons now intelligently adapt to smaller screens and split-window views.
                        </li>
                        <li>
                            <strong>Smarter Auto-Start:</strong> Auto-Start now handles next-day scheduling seamlessly and properly requests fullscreen mode.
                        </li>
                         <li>
                            <strong>Under-the-Hood Upgrades:</strong> A completely rewritten state management engine ensures faster performance, rock-solid timers, and better reliability.
                        </li>
                    </ul>
                </div>
                {/* --- END OF WHAT'S NEW SECTION --- */}

                <button
                    onClick={onClose}
                    className="mt-10 px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg rounded-lg shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default WelcomeModal;
