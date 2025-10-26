import React, { useState } from 'react';
import type { ResumeFeedback } from '../types';
import Card from './common/Card';

interface ResumeFeedbackViewProps {
    feedback?: ResumeFeedback | null;
    onResumeSubmit?: (resumeText: string, targetRole: string) => void;
    onBack?: () => void;
}

const ResumeFeedbackView: React.FC<ResumeFeedbackViewProps> = ({ feedback, onResumeSubmit, onBack }) => {
    const [resumeText, setResumeText] = useState('');
    const [targetRole, setTargetRole] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeText || !targetRole) {
            alert("Please paste your resume and specify a target role.");
            return;
        }
        if(onResumeSubmit) {
            onResumeSubmit(resumeText, targetRole);
        }
    };

    if (feedback) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Resume Feedback</h2>
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-sky-400">Overall Impression</h3>
                        <p className="mt-2 text-slate-300">{feedback.impression}</p>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-sky-400">Content Suggestions</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-slate-300">
                            {feedback.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </Card>
                     <Card>
                        <h3 className="text-lg font-semibold text-sky-400">Structure &amp; Formatting Analysis</h3>
                        <ul className="mt-2 list-disc list-inside space-y-2 text-slate-300">
                            {feedback.formattingFeedback.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-sky-400">Rewritten Professional Summary</h3>
                        <blockquote className="mt-2 p-4 bg-slate-900/50 border-l-4 border-sky-500 text-slate-300 italic">
                            <p>{feedback.rewrittenSummary}</p>
                        </blockquote>
                    </Card>
                </div>
                 <div className="mt-8">
                    <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300">
                        &larr; Back to Main Page
                    </button>
                </div>
            </div>
        );
    }
    
    // Render form if no feedback
    return (
        <div className="space-y-6">
            <div>
                 <h2 className="text-2xl font-bold text-white">Get Instant Resume Feedback</h2>
                 <p className="mt-1 text-slate-400">Paste your resume and a target job title to get AI-powered suggestions.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                     <label htmlFor="targetRole" className="block text-sm font-medium text-slate-300">Target Job Role</label>
                     <input
                        id="targetRole"
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"
                        placeholder="e.g., Senior Product Manager"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-slate-300">Paste your resume text</label>
                    <textarea
                        id="resume"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"
                        placeholder="Paste the full text of your resume here..."
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500">
                        Analyze Resume
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResumeFeedbackView;