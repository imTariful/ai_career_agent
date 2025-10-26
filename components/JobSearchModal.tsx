import React from 'react';
import type { LiveJob } from '../types';
import LoadingSpinner from './common/LoadingSpinner';

interface JobSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    jobs: LiveJob[] | null;
    isLoading: boolean;
    error: string | null;
    onGenerateCoverLetter: (job: LiveJob) => void;
    isResumeGenerated: boolean;
}

const JobSearchModal: React.FC<JobSearchModalProps> = ({ isOpen, onClose, jobTitle, jobs, isLoading, error, onGenerateCoverLetter, isResumeGenerated }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Live Jobs for <span className="text-sky-400">{jobTitle}</span></h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col justify-center items-center h-64">
                             <div className="flex flex-col items-center justify-center space-y-4">
                                <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-slate-300 text-lg animate-pulse">Searching for live job postings...</p>
                            </div>
                        </div>
                    )}
                    {error && (
                         <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && jobs && (
                        <div className="space-y-4">
                            {jobs.length > 0 ? jobs.map((job, index) => (
                                <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-sky-700 transition-colors">
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-white">{job.title}</h3>
                                        <p className="text-sm text-slate-300">{job.company}</p>
                                        <p className="text-xs text-slate-400 mt-1">{job.location}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <button 
                                            onClick={() => onGenerateCoverLetter(job)}
                                            title={!isResumeGenerated ? "Generate a resume first to create a cover letter" : `Generate cover letter for ${job.title}`}
                                            disabled={!isResumeGenerated}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:cursor-not-allowed disabled:text-slate-400 transition-colors"
                                        >
                                            Generate Letter
                                        </button>
                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700">
                                            View Job
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-400 text-center py-8">No live jobs found. This could be a temporary issue or there are no current listings matching your specific criteria.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSearchModal;