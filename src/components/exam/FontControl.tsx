import React from 'react';
import { useStore } from '../../context/useStore';

interface FontControlProps {
    elementId: string;
    direction: 'up' | 'down';
}

const FontControl: React.FC<FontControlProps> = ({ elementId, direction }) => {
    const dispatch = useStore(state => state.dispatch);

    const handleClick = () => {
        dispatch({ type: 'UPDATE_FONT_SIZE', payload: { elementId, direction } });
    };

    return (
        <button
            onClick={handleClick}
            className="hidden group-[.show-font-controls]:inline-flex items-center justify-center p-1 text-slate-400 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 font-control"
            aria-label={`${direction === 'up' ? 'Increase' : 'Decrease'} font size for ${elementId}`}
        >
            {direction === 'up' ? '+' : '−'}
        </button>
    );
};

export default FontControl;