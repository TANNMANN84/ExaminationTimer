import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTooltip } from '../../context/TooltipContext';
import type { Theme } from '../../types';

const FooterButton: React.FC<{
    onClick: () => void;
    tooltipText: string;
    children: React.ReactNode;
}> = ({ onClick, tooltipText, children }) => {
    const { showTooltip, hideTooltip } = useTooltip();
    const { state } = useAppContext();

    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(state.ui.showTooltips) showTooltip(tooltipText, e.currentTarget);
    }

    return (
        <button
            onClick={onClick}
            onMouseOver={handleMouseOver}
            onMouseOut={hideTooltip}
            className="flex items-center justify-center h-10 w-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
            {children}
        </button>
    );
}

const ThemeSwitcher: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { theme } = state.ui;

    const cycleTheme = () => {
        const nextTheme: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
        dispatch({ type: 'SET_THEME', payload: nextTheme });
    };

    const getIcon = () => {
        if (theme === 'light') {
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
        }
        if (theme === 'dark') {
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
        }
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    };

    const tooltipText = `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to change)`;

    return (
        <FooterButton onClick={cycleTheme} tooltipText={tooltipText}>
            {getIcon()}
        </FooterButton>
    );
};


const Footer: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { ui } = state;

    return (
        <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 p-2 flex justify-between items-center z-40">
            <div className="flex items-center space-x-2">
                 <ThemeSwitcher />
                <FooterButton
                    onClick={() => dispatch({ type: 'TOGGLE_TOOLTIPS' })}
                    tooltipText="Toggle help tooltips"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${ui.showTooltips ? 'text-indigo-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </FooterButton>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                Examination Timer App - v7.6 <br />
                Author: Andrew Tann 2025
            </div>
        </footer>
    );
};

export default Footer;