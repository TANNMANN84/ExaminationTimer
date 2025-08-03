import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// This is the interface you correctly identified as needing to be fixed.
// This version provides all the properties that Tooltip.tsx needs.
export interface TooltipContextType {
    showTooltip: (content: ReactNode, target: HTMLElement) => void;
    hideTooltip: () => void;
    tooltipContent: ReactNode | null;
    isTooltipVisible: boolean;
    targetElement: HTMLElement | null;
}

// 1. We create the actual context.
const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

// 2. We create the Provider component.
export const TooltipProvider = ({ children }: { children: ReactNode }) => {
    const [tooltipContent, setTooltipContent] = useState<ReactNode | null>(null);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

    const showTooltip = useCallback((content: ReactNode, target: HTMLElement) => {
        setTooltipContent(content);
        setTargetElement(target);
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltipContent(null);
        setTargetElement(null);
    }, []);

    const isTooltipVisible = tooltipContent !== null && targetElement !== null;

    const value = {
        showTooltip,
        hideTooltip,
        tooltipContent,
        isTooltipVisible,
        targetElement,
    };

    return (
        <TooltipContext.Provider value={value}>
            {children}
        </TooltipContext.Provider>
    );
};

// 3. We create the custom hook.
export const useTooltip = () => {
    const context = useContext(TooltipContext);
    if (context === undefined) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};