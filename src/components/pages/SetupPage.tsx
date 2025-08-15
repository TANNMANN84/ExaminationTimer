import React from 'react';
import SessionTitle from '../setup/SessionTitle';
import DisplayOptions from '../setup/DisplayOptions';
import ExamList from '../setup/ExamList';
import SetupActions from '../setup/SetupActions';
import { useAppContext } from '../../context/AppContext';

// The SessionModeSelector remains the same as our last change
const SessionModeSelector: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { sessionMode } = state;
    
    const examinationsColor = "bg-indigo-600";
    const standardisedColor = "bg-teal-600"; 

    const baseClass = "px-6 py-3 font-bold rounded-md w-full text-center transition-all duration-200";
    const activeClassExaminations = `${examinationsColor} text-white shadow-lg`;
    const activeClassStandardised = `${standardisedColor} text-white shadow-lg`;
    const inactiveClass = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600";

    return (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Session Mode</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Choose the type of session you are running.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => dispatch({ type: 'SET_SESSION_MODE', payload: 'examinations' })} 
                    className={`${baseClass} ${sessionMode === 'examinations' ? activeClassExaminations : inactiveClass}`}
                >
                    Examinations
                </button>
                <button 
                    onClick={() => dispatch({ type: 'SET_SESSION_MODE', payload: 'standardised' })} 
                    className={`${baseClass} ${sessionMode === 'standardised' ? activeClassStandardised : inactiveClass}`}
                >
                    Standardised Tests
                </button>
            </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  <span className="font-semibold">Examinations:</span> For tests with individual timers, special provisions, etc.
                  <br />
                  <span className="font-semibold">Standardised Tests:</span> For tests using a central clock and access codes.
             </p>
        </div>
    );
};


const SetupPage: React.FC = () => {
    // 1. Get the sessionMode from the context
    const { state } = useAppContext();
    const { sessionMode } = state;

    // 2. Define the background class based on the mode
    const backgroundClass = sessionMode === 'standardised' 
        ? 'bg-teal-50 dark:bg-teal-900/20' 
        : 'bg-transparent'; // Default is no extra background

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Session Setup</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your session details and display options.</p>
                </div>
            </div>

            <SessionModeSelector />

            {/* 3. Apply the dynamic background class and some padding */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 rounded-lg transition-colors duration-300 ${backgroundClass}`}>
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