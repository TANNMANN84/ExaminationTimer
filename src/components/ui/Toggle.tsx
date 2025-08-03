import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, name }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                name={name}
                checked={checked} 
                onChange={onChange} 
                className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    );
};

export default Toggle;