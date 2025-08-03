import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div 
                className="accordion-header flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <svg className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <div className={`accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] p-6 pt-0' : 'max-h-0'}`}>
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;