import React, { useState, useEffect } from 'react';
import type { JobRecommendation, InterviewQuestion } from '../types';
import { getInterviewQuestions, getAnswerFeedback } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';

interface InterviewPrepViewProps {
    job: JobRecommendation;
    onBack: () => void;
}

const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({ job, onBack }) => {
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setError(null);
                setIsLoadingQuestions(true);
                const questionStrings = await getInterviewQuestions(job.title);
                setQuestions(questionStrings.map(q => ({ question: q })));
            } catch (err) {
                setError('Failed to load interview questions. Please try again.');
                console.error(err);
            } finally {
                setIsLoadingQuestions(false);
            }
        };
        fetchQuestions();
    }, [job.title]);

    const handleAnswerChange = (text: string) => {
        const newQuestions = [...questions];
        newQuestions[currentIndex].answer = text;
        setQuestions(newQuestions);
    };

    const handleSubmitAnswer = async () => {
        const currentQuestion = questions[currentIndex];
        if (!currentQuestion.answer) {
            alert('Please provide an answer.');
            return;
        }

        try {
            setError(null);
            setIsLoadingFeedback(true);
            const feedback = await getAnswerFeedback(currentQuestion.question, currentQuestion.answer, job.title);
            const newQuestions = [...questions];
            newQuestions[currentIndex].feedback = feedback;
            setQuestions(newQuestions);
        } catch (err) {
            setError('Failed to get feedback. Please try again.');
            console.error(err);
        } finally {
            setIsLoadingFeedback(false);
        }
    };

    if (isLoadingQuestions) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <LoadingSpinner />
                <p className="mt-4 text-slate-300">Generating interview questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">
                <p>{error}</p>
                <button onClick={onBack} className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md">Go Back</button>
            </div>
        );
    }
    
    const currentQuestionData = questions[currentIndex];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Interview Practice: <span className="text-sky-400">{job.title}</span></h2>
            
            {questions.length > 0 && <p className="text-slate-400">Question {currentIndex + 1} of {questions.length}</p>}

            <Card>
                <h3 className="text-lg font-semibold text-white">Question:</h3>
                <p className="mt-2 text-slate-300 text-xl">{currentQuestionData?.question}</p>
            </Card>

            <div className="space-y-4">
                 <label htmlFor="answer" className="block text-sm font-medium text-slate-300">Your Answer:</label>
                <textarea
                    id="answer"
                    value={currentQuestionData?.answer || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={8}
                    className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2 disabled:opacity-70 disabled:bg-slate-800"
                    placeholder="Structure your answer clearly. Use the STAR method for behavioral questions."
                    disabled={!!currentQuestionData?.feedback || isLoadingFeedback}
                />
                <div className="flex justify-end">
                    <button 
                        onClick={handleSubmitAnswer}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed"
                        disabled={isLoadingFeedback || !currentQuestionData?.answer || !!currentQuestionData?.feedback}
                    >
                        {isLoadingFeedback ? 'Getting Feedback...' : 'Get Feedback'}
                    </button>
                </div>
            </div>

            {isLoadingFeedback && (
                <div className="flex items-center justify-center p-4 text-slate-400 animate-pulse">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your answer...
                </div>
            )}

            {currentQuestionData?.feedback && (
                <Card className="border-teal-700">
                     <h3 className="text-lg font-semibold text-teal-400">AI Coach Feedback:</h3>
                     <div className="mt-2 text-slate-300 space-y-3 prose prose-invert prose-sm max-w-none">
                         {currentQuestionData.feedback.split('\n').filter(p => p.trim() !== "").map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                     </div>
                </Card>
            )}

            <div className="mt-8 flex justify-between items-center">
                <button 
                    onClick={() => setCurrentIndex(i => i - 1)}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    &larr; Previous
                </button>
                 <button 
                    onClick={() => setCurrentIndex(i => i + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next &rarr;
                </button>
            </div>
             <div className="mt-4 border-t border-slate-700 pt-4">
                 <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300">
                    &larr; Back to Learning Path
                </button>
             </div>
        </div>
    );
};

export default InterviewPrepView;
