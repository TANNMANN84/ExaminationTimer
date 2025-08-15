import React, { useRef } from 'react';

import { useAppContext } from '../../context/AppContext';

import { useTooltip } from '../../context/TooltipContext';

import { exportSession } from '../../utils/export';



const SetupActions: React.FC = () => {

    const { state, dispatch } = useAppContext();

    const { exams } = state;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { showTooltip, hideTooltip } = useTooltip();



    const handleMouseOver = (tooltipText: string) => (e: React.MouseEvent<HTMLButtonElement>) => {

        if(state.ui.showTooltips) showTooltip(tooltipText, e.currentTarget);

    }



    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];

        if (!file) return;



        const reader = new FileReader();

        reader.onload = (e) => {

            try {

                const result = e.target?.result;

                if (typeof result === 'string') {

                    const data = JSON.parse(result);

                    if (data.settings && data.exams) {

                        dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'import', data } });

                    } else {

                        alert("Invalid session file.");

                    }

                }

            } catch (error) {

                alert("Error parsing session file.");

            }

        };

        reader.readAsText(file);

        event.target.value = ''; // Reset input

    };



    const handleExport = () => {

        exportSession(state);

    };



    return (

        <div className="mt-16 flex justify-center">

            <div className="w-full max-w-7xl px-4 md:px-8">

                <div className="flex flex-col md:flex-row items-center justify-between bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-lg">

                    <div className="flex items-center space-x-2">

                        <button

                            onMouseOver={handleMouseOver("Import a session from a .json file (Ctrl+O).")}

                            onMouseOut={hideTooltip}

                            onClick={() => fileInputRef.current?.click()}

                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"

                        >

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>

                            <span>Import</span>

                        </button>

                        <input id="import-file-input" type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileImport} />

                        <button

                            onMouseOver={handleMouseOver("Export the current session to a .json file (Ctrl+S).")}

                            onMouseOut={hideTooltip}

                            onClick={handleExport}

                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"

                        >

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>

                            <span>Export</span>

                        </button>

                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">

                        <button

                            onMouseOver={handleMouseOver("Resets all display options and clears all exams.")}

                            onMouseOut={hideTooltip}

                            onClick={() => dispatch({ type: 'SET_CONFIRM_ACTION', payload: { type: 'resetAll' }})}

                            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"

                        >

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path d="M4 9a9 9 0 0114.53-2.85L20 5M20 15a9 9 0 01-14.53 2.85L4 19" /></svg>

                            <span>Reset All</span>

                        </button>

                        <button

                            onMouseOver={handleMouseOver("Go to the live screen to preview the display.")}

                            onMouseOut={hideTooltip}

                            onClick={() => dispatch({ type: 'PREVIEW_EXAMS' })}

                            disabled={exams.length === 0}

                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"

                        >

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

                            <span>Preview Exams</span>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};



export default SetupActions;