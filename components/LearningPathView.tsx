import React from 'react';
import type { JobRecommendation, LearningPath } from '../types';
import Card from './common/Card';

interface LearningPathViewProps {
    job: JobRecommendation;
    path: LearningPath;
    onBack: () => void;
    onReset: () => void;
    completedSteps: number[];
    onToggleStep: (month: number) => void;
    onGetAssessment: () => void;
    assessment: string | null;
    isLoadingAssessment: boolean;
    onStartInterviewPrep: (job: JobRecommendation) => void;
    onStartResumeGeneration: () => void;
}

const LearningPathView: React.FC<LearningPathViewProps> = ({ 
    job, path, onBack, onReset, 
    completedSteps, onToggleStep, onGetAssessment, assessment, isLoadingAssessment,
    onStartInterviewPrep, onStartResumeGeneration
}) => {
    const progress = path.length > 0 ? Math.round((completedSteps.length / path.length) * 100) : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Personalized Learning Path to Become a <span className="text-sky-400">{job.title}</span></h2>
            <p className="text-slate-400">Follow this {path.length}-month plan to gain the skills you need. Check off items as you complete them to track your progress.</p>
            
            {/* Progress Tracker */}
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Your Progress</h3>
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div 
                        className="bg-teal-500 h-4 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-slate-400 mt-1">{progress}% Complete</p>
            </div>

            <div className="space-y-8 mt-6">
                {path.sort((a, b) => a.month - b.month).map(step => {
                    const isCompleted = completedSteps.includes(step.month);
                    return (
                        <div key={step.month} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <label className="cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        className="hidden"
                                        checked={isCompleted}
                                        onChange={() => onToggleStep(step.month)}
                                    />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ring-4 ring-slate-700 transition-colors duration-300 ${
                                        isCompleted ? 'bg-teal-600 text-white' : 'bg-sky-500 text-white'
                                    }`}>
                                        {isCompleted ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        ) : step.month}
                                    </div>
                                </label>
                                {step.month < path.length && <div className="w-px h-20 bg-slate-600 mt-2"></div>}
                            </div>
                            <div className={`flex-grow pt-1 transition-opacity duration-300 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
                                <h3 className={`text-lg font-bold text-white ${isCompleted ? 'line-through' : ''}`}>{step.title}</h3>
                                <p className="mt-1 text-slate-300">{step.description}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-slate-400 text-sm mb-2">Recommended Resources:</h4>
                                    <ul className="space-y-2">
                                        {step.resources.map(res => (
                                            <li key={res.name}>
                                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline text-sm flex items-center gap-1">
                                                    {res.name}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <Card className="mt-8">
                <h3 className="text-lg font-semibold text-white">AI Progress Assessment</h3>
                <p className="text-sm text-slate-400 mb-4">Get personalized feedback from your AI coach based on your completed steps.</p>
                <button 
                    onClick={onGetAssessment} 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoadingAssessment || completedSteps.length === 0}
                >
                    {isLoadingAssessment ? 'Analyzing...' : 'Get AI Feedback'}
                </button>
                {isLoadingAssessment && (
                    <div className="mt-4 text-sm text-slate-400 animate-pulse">Your coach is reviewing your progress...</div>
                )}
                {assessment && !isLoadingAssessment && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-md border border-slate-700 text-slate-300">
                         <p>{assessment}</p>
                    </div>
                )}
            </Card>

            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 w-full sm:w-auto text-center">
                    &larr; Back to Skill Gap
                </button>
                <div className="flex flex-col sm:flex-row-reverse gap-4 w-full sm:w-auto">
                    <button 
                        onClick={() => onStartInterviewPrep(job)} 
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                    >
                        Practice for Interview &rarr;
                    </button>
                     <button 
                        onClick={onStartResumeGeneration}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                    >
                        Generate ATS-Friendly Resume
                    </button>
                     <button 
                        onClick={onReset} 
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                    >
                        Start New Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearningPathView;
