
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg hover:shadow-sky-500/10 hover:border-sky-700 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
