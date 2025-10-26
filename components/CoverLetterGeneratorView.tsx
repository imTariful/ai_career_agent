import React, { useState } from 'react';
import type { LiveJob } from '../types';

interface CoverLetterGeneratorViewProps {
    letter: string;
    job: LiveJob;
    onBack: () => void;
}

const CoverLetterGeneratorView: React.FC<CoverLetterGeneratorViewProps> = ({ letter, job, onBack }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(letter).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Copy Failed');
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Generated Cover Letter for <span className="text-sky-400">{job.title}</span></h2>
            <p className="text-slate-400">Your personalized cover letter for the role at <span className="font-semibold text-slate-300">{job.company}</span> is ready. Copy the text into a document editor for final review.</p>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 font-sans text-slate-300 leading-relaxed">
                <p style={{ whiteSpace: 'pre-wrap' }}>{letter}</p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 w-full sm:w-auto text-center">
                    &larr; Back to Learning Path
                </button>
                <button 
                    onClick={handleCopyToClipboard} 
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500"
                >
                    {copyButtonText}
                </button>
            </div>
        </div>
    );
};

export default CoverLetterGeneratorView;