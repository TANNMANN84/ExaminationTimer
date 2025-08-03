import React from 'react';
import SessionTitle from '../setup/SessionTitle';
import DisplayOptions from '../setup/DisplayOptions';
import ExamList from '../setup/ExamList';
import SetupActions from '../setup/SetupActions';
import { useAppContext } from '../../context/AppContext';

const SessionModeSelector: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { sessionMode } = state;
    
    const baseClass = "px-6 py-3 font-bold rounded-md w-full text-center transition-all duration-200";
    const activeClass = "bg-indigo-600 text-white shadow-lg";
    const inactiveClass = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600";

    return (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Session Mode</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Choose the type of session you are running.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => dispatch({ type: 'SET_SESSION_MODE', payload: 'examinations' })} 
                    className={`${baseClass} ${sessionMode === 'examinations' ? activeClass : inactiveClass}`}
                >
                    Examinations
                </button>
                <button 
                    onClick={() => dispatch({ type: 'SET_SESSION_MODE', payload: 'standardised' })} 
                    className={`${baseClass} ${sessionMode === 'standardised' ? activeClass : inactiveClass}`}
                >
                    Standardised Tests
                </button>
            </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                 <span className="font-semibold">Examinations:</span> For tests with individual timers, reading/writing times, and special provisions (e.g., HSC, Trials).
                 <br />
                 <span className="font-semibold">Standardised Tests:</span> For tests using a central clock and access codes (e.g., NAPLAN, VALID).
             </p>
        </div>
    );
};

const SetupPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fadeIn"> {/* <-- PADDING ADDED HERE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Session Setup</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your session details and display options.</p>
                </div>
            </div>

            <SessionModeSelector />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <SessionTitle />
                    <DisplayOptions />
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm flex flex-col">
                    <ExamList />
                </div>
            </div>

            <SetupActions />
        </div>
    );
};

export default SetupPage;