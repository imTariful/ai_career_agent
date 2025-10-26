
import React from 'react';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
    return (
        <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div onClick={onReset} className="cursor-pointer">
                    <h1 className="text-xl font-bold text-sky-400">
                        <span role="img" aria-label="compass">🧭</span> AI Career Coach
                    </h1>
                    <p className="text-xs text-slate-400">Your Personalized Career Growth Partner</p>
                </div>
                 <button onClick={onReset} className="text-sm text-slate-300 hover:text-white transition-colors">Start Over</button>
            </div>
        </header>
    );
};

export default Header;
