
import React from 'react';

interface PillProps {
    text: string;
    color?: 'sky' | 'teal' | 'amber';
}

const Pill: React.FC<PillProps> = ({ text, color = 'sky' }) => {
    const colorClasses = {
        sky: 'bg-sky-900/50 text-sky-300 border border-sky-800',
        teal: 'bg-teal-900/50 text-teal-300 border border-teal-800',
        amber: 'bg-amber-900/50 text-amber-300 border border-amber-800'
    };
    
    return (
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClasses[color]}`}>
            {text}
        </span>
    );
};

export default Pill;
