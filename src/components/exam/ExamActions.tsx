import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTooltip } from '../../context/TooltipContext';

const Fab: React.FC<{
    onClick: () => void;
    tooltipText: string;
    children: React.ReactNode;
    color?: string;
    className?: string;
    isLocked?: boolean;
    isActive?: boolean; // 1. ADD THE NEW 'isActive' PROP
}> = ({ onClick, tooltipText, children, color = 'bg-white dark:bg-slate-700', className = '', isLocked = false, isActive = false }) => {
    const { state } = useAppContext();
    const { showTooltip, hideTooltip } = useTooltip();
    
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(state.ui.showTooltips) showTooltip(tooltipText, e.currentTarget);
    }
    
    // 2. UPDATE THE STYLING LOGIC TO INCLUDE 'isActive'
    const activeClass = isLocked || isActive ? 'bg-indigo-600 text-white' : `${color} text-slate-700 dark:text-slate-200`;
    
    return (
        <button
            onClick={onClick}
            onMouseOver={handleMouseOver}
            onMouseOut={hideTooltip}
            className={`p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 w-12 h-12 flex items-center justify-center transition-all hover:brightness-95 dark:hover:brightness-125 ${activeClass} ${className}`}
        >
            {children}
        </button>
    );
};

const ActionButton: React.FC<{
    onClick: () => void,
    tooltipText: string,
    children: React.ReactNode,
    className?: string
}> = ({ onClick, tooltipText, children, className = '' }) => {
   const { state } = useAppContext();
    const { showTooltip, hideTooltip } = useTooltip();
    
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(state.ui.showTooltips) showTooltip(tooltipText, e.currentTarget);
    }

    return (
       <button 
            onClick={onClick}
            onMouseOver={handleMouseOver}
            onMouseOut={hideTooltip}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition ${className}`}
        >
            {children}
        </button>
    );
}

const ExamActions: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { isLive, ui, sessionMode } = state;

    const handleCommence = () => {
        dispatch({ type: 'START_LIVE_SESSION' });
    }

    return (
        <div className="fixed bottom-16 right-4 flex items-end space-x-2 z-50">
            <div className={`flex items-center space-x-2 transition-all duration-300 ${ui.fabsCollapsed ? 'hidden' : ''}`}>
                {/* Controls */}
                <Fab tooltipText="Live display settings" onClick={() => dispatch({type: 'SET_ACTIVE_MODAL', payload: 'liveSettings'})}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </Fab>
                 <Fab tooltipText="Lock/Unlock global font size changes." isLocked={ui.fontLockEnabled} onClick={() => dispatch({ type: 'TOGGLE_FONT_LOCK' })}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        {ui.fontLockEnabled 
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        }
                    </svg>
                </Fab>
                {/* 3. USE THE NEW 'isActive' PROP AND CONNECT IT TO THE STATE */}
                <Fab tooltipText="Toggle font size controls" isActive={ui.showFontControls} onClick={() => dispatch({ type: 'TOGGLE_FONT_CONTROLS' })}>
                    <span className="select-none font-bold text-lg">Aa</span>
                </Fab>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {!isLive ? (
                        <>
                             <ActionButton onClick={() => dispatch({type: 'SET_ACTIVE_MODAL', payload: 'autoStart'})} tooltipText="Set a specific time for the exams to commence automatically." className="bg-slate-600 text-white hover:bg-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Auto-Start</span>
                             </ActionButton>
                             <ActionButton onClick={() => dispatch({ type: 'END_SESSION', payload: {shouldReset: false} })} tooltipText="Go back to the setup page to add or remove exams." className="bg-slate-600 text-white hover:bg-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                                <span>Return to Setup</span>
                             </ActionButton>
                             <ActionButton onClick={handleCommence} tooltipText="Start all exam timers. This will begin the session." className="bg-green-600 text-white hover:bg-green-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Commence</span>
                             </ActionButton>
                        </>
                    ) : sessionMode === 'standardised' ? (
                        <>
                            <ActionButton onClick={() => dispatch({type: 'SET_DISRUPTION_TARGET', payload: null})} tooltipText="Report a disruption for the entire session." className="bg-amber-500 text-white hover:bg-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Disruption</span>
                            </ActionButton>
                            <ActionButton onClick={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: {type: 'endSession'} })} tooltipText="Finish the live session and return to the setup page." className="bg-indigo-600 text-white hover:bg-indigo-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" /></svg>
                                <span>Finish Session</span>
                            </ActionButton>
                        </>
                    ) : (
                        <>
                            <ActionButton onClick={() => dispatch({type: 'SET_DISRUPTION_TARGET', payload: null})} tooltipText="Report a disruption for the entire session." className="bg-amber-500 text-white hover:bg-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <span>Disruption</span>
                            </ActionButton>
                            <ActionButton onClick={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: {type: 'endSession'} })} tooltipText="End the live session and return to the setup page." className="bg-indigo-600 text-white hover:bg-indigo-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" /></svg>
                                <span>End Session</span>
                            </ActionButton>
                            <ActionButton onClick={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: {type: 'endAndReset'} })} tooltipText="End the session and clear all exams and settings." className="bg-red-600 text-white hover:bg-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                <span>End & Reset</span>
                            </ActionButton>
                        </>
                    )}
                </div>
            </div>
             <Fab color="bg-indigo-600 text-white" tooltipText={ui.fabsCollapsed ? 'Show actions' : 'Hide actions'} onClick={() => dispatch({type: 'TOGGLE_FABS'})}>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-transform duration-300 ${!ui.fabsCollapsed ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </Fab>
        </div>
    );
};

export default ExamActions;