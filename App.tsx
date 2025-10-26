import React, { useState, useCallback, useEffect } from 'react';
import { AppPhase, UserProfile, JobRecommendation, SkillGap, LearningPath, ResumeFeedback, GeneratedResume, LiveJob, DreamCompanyRoadmap } from './types';
import { getJobRecommendations, getSkillGapAnalysis, getLearningPath, getResumeFeedback, getAIAssessment, generateResume, findLiveJobs, generateCoverLetter, getDreamCompanyRoadmap } from './services/geminiService';
import Header from './components/common/Header';
import ProfileInput from './components/ProfileInput';
import Recommendations from './components/Recommendations';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import LearningPathView from './components/LearningPathView';
import ResumeFeedbackView from './components/ResumeFeedbackView';
import InterviewPrepView from './components/InterviewPrepView';
import ResumeGeneratorView from './components/ResumeGeneratorView';
import CoverLetterGeneratorView from './components/CoverLetterGeneratorView';
import DreamCompanyView from './components/DreamCompanyView';
import LoadingSpinner from './components/common/LoadingSpinner';
import JobSearchModal from './components/JobSearchModal';

const SESSION_STORAGE_KEY = 'ai-career-coach-session';

const App: React.FC = () => {
    const [phase, setPhase] = useState<AppPhase>(AppPhase.PROFILE_INPUT);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
    const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
    const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [resumeFeedback, setResumeFeedback] = useState<ResumeFeedback | null>(null);
    const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
    const [dreamCompanyRoadmap, setDreamCompanyRoadmap] = useState<DreamCompanyRoadmap | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for progress tracking
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [progressAssessment, setProgressAssessment] = useState<string | null>(null);
    const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);

    // State for Job Search Modal
    const [isJobSearchModalOpen, setIsJobSearchModalOpen] = useState<boolean>(false);
    const [jobSearchTarget, setJobSearchTarget] = useState<JobRecommendation | null>(null);
    const [liveJobs, setLiveJobs] = useState<LiveJob[] | null>(null);
    const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
    const [jobSearchError, setJobSearchError] = useState<string | null>(null);
    const [coverLetterTargetJob, setCoverLetterTargetJob] = useState<LiveJob | null>(null);

    const handleProfileSubmit = useCallback(async (profile: UserProfile) => {
        setIsLoading(true);
        setError(null);
        setUserProfile(profile);
        // Save profile-only session
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ profile }));
        try {
            const recs = await getJobRecommendations(profile);
            setRecommendations(recs);
            setPhase(AppPhase.RECOMMENDATIONS);
        } catch (err) {
            setError('Failed to get job recommendations. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleDreamCompanySubmit = useCallback(async (profile: UserProfile, companyName: string) => {
        setIsLoading(true);
        setError(null);
        setUserProfile(profile);
        // Clear previous session data except profile
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ profile }));
        try {
            const roadmap = await getDreamCompanyRoadmap(profile, companyName);
            setDreamCompanyRoadmap(roadmap);
            setPhase(AppPhase.DREAM_COMPANY_ROADMAP);
        } catch (err) {
            setError('Failed to generate dream company roadmap. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);


    // Load session from localStorage on initial render
    useEffect(() => {
        const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        let handled = false;
        if (savedSessionRaw) {
            try {
                const session = JSON.parse(savedSessionRaw);
                // Check for a full, restorable learning path session
                if (session.path && session.job && session.profile) {
                    setUserProfile(session.profile);
                    setSelectedJob(session.job);
                    setLearningPath(session.path);
                    setGeneratedResume(session.resume || null);
                    setCompletedSteps(session.completedSteps || []);
                    setPhase(AppPhase.LEARNING_PATH);
                    handled = true;
                } else if (session.profile) {
                    // Fallback to just restoring the profile and fetching new recommendations
                    handleProfileSubmit(session.profile);
                    handled = true;
                }
            } catch (error) {
                console.error("Failed to parse saved session:", error);
                localStorage.removeItem(SESSION_STORAGE_KEY);
            }
        }
        if (!handled) {
            setIsLoading(false);
        }
    }, [handleProfileSubmit]);

    const handleSelectJobForAnalysis = useCallback(async (job: JobRecommendation) => {
        if (!userProfile) return;
        setIsLoading(true);
        setError(null);
        setSelectedJob(job);
        try {
            const analysis = await getSkillGapAnalysis(userProfile.skills.split(','), job);
            setSkillGap(analysis);
            setPhase(AppPhase.SKILL_GAP);
        } catch (err) {
            setError('Failed to analyze skill gap. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [userProfile]);
    
    const handleSelectJobForLearningPath = useCallback(async (job: JobRecommendation) => {
        if (!userProfile || !skillGap) return;
        setIsLoading(true);
        setError(null);
        setSelectedJob(job);
        try {
            const path = await getLearningPath(job.title, userProfile.skills.split(','), skillGap.gaps);
            setLearningPath(path);
            const newCompletedSteps: number[] = [];
            setCompletedSteps(newCompletedSteps);
            setPhase(AppPhase.LEARNING_PATH);

            // Save the full session to local storage
            const session = {
                profile: userProfile,
                job: job,
                path: path,
                completedSteps: newCompletedSteps,
            };
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

        } catch (err) {
            setError('Failed to generate learning path. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [userProfile, skillGap]);

    const handleResumeSubmit = useCallback(async (resumeText: string, targetRole: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const feedback = await getResumeFeedback(resumeText, targetRole);
            setResumeFeedback(feedback);
            setPhase(AppPhase.RESUME_FEEDBACK);
        } catch (err) {
            setError('Failed to get resume feedback. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleStartInterviewPrep = useCallback((job: JobRecommendation) => {
        setSelectedJob(job);
        setPhase(AppPhase.INTERVIEW_PREP);
        setError(null);
    }, []);

    const handleStartResumeGeneration = useCallback(async () => {
        if (!userProfile || !selectedJob) return;

        setIsLoading(true);
        setError(null);
        setPhase(AppPhase.RESUME_GENERATOR);
        
        try {
            const resume = await generateResume(userProfile, selectedJob);
            setGeneratedResume(resume);
            
            // Save resume to session
             const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
             if (savedSessionRaw) {
                 const session = JSON.parse(savedSessionRaw);
                 session.resume = resume;
                 localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
             }

        } catch (err) {
            setError('Failed to generate resume. Please try again.');
            console.error(err);
            setPhase(AppPhase.LEARNING_PATH); // Go back to previous phase on error
        } finally {
            setIsLoading(false);
        }
    }, [userProfile, selectedJob]);


    const handleToggleStep = (month: number) => {
        const newSteps = completedSteps.includes(month)
            ? completedSteps.filter(m => m !== month)
            : [...completedSteps, month];
        
        setCompletedSteps(newSteps);
        
        // Update session in localStorage
        const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSessionRaw) {
            try {
                const session = JSON.parse(savedSessionRaw);
                session.completedSteps = newSteps;
                localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
            } catch {
                // Could fail if data is corrupted, ignore for now
            }
        }
        setProgressAssessment(null); // Clear old assessment on progress change
    };
    
    const handleGetAssessment = async () => {
        if (!selectedJob || !learningPath) return;

        setIsLoadingAssessment(true);
        setError(null);
        try {
            const assessment = await getAIAssessment(selectedJob.title, learningPath, completedSteps);
            setProgressAssessment(assessment);
        } catch (err) {
            setError("Failed to get AI assessment. Please try again.");
            setProgressAssessment(null);
            console.error(err);
        } finally {
            setIsLoadingAssessment(false);
        }
    };

    const handleFindLiveJobs = useCallback(async (job: JobRecommendation) => {
        if (!userProfile) return;
        setJobSearchTarget(job);
        setIsJobSearchModalOpen(true);
        setIsLoadingJobs(true);
        setLiveJobs(null);
        setJobSearchError(null);

        try {
            const jobs = await findLiveJobs(job.title, userProfile.goals);
            setLiveJobs(jobs);
        } catch (err) {
            setJobSearchError('Failed to find live jobs. The AI may not have found relevant postings or formatted the response correctly. Please try again.');
            console.error(err);
        } finally {
            setIsLoadingJobs(false);
        }
    }, [userProfile]);

    const handleCloseJobSearch = () => {
        setIsJobSearchModalOpen(false);
        setJobSearchTarget(null);
        setLiveJobs(null);
        setIsLoadingJobs(false);
        setJobSearchError(null);
    };

    const handleGenerateCoverLetter = useCallback(async (job: LiveJob) => {
        if (!userProfile || !generatedResume) {
            alert("Please generate a resume first to create a tailored cover letter.");
            return;
        }
        handleCloseJobSearch();
        setIsLoading(true);
        setError(null);
        setCoverLetterTargetJob(job);
        setPhase(AppPhase.COVER_LETTER_GENERATOR);

        try {
            const letter = await generateCoverLetter(userProfile, generatedResume, job);
            setGeneratedCoverLetter(letter);
        } catch(err) {
            setError('Failed to generate cover letter. Please try again.');
            console.error(err);
            setPhase(AppPhase.LEARNING_PATH); // Go back on error
        } finally {
            setIsLoading(false);
        }

    }, [userProfile, generatedResume]);

    const handleBack = (targetPhase: AppPhase) => {
        setError(null);
        setPhase(targetPhase);
    };
    
    const reset = () => {
        setPhase(AppPhase.PROFILE_INPUT);
        setUserProfile(null);
        setRecommendations([]);
        setSelectedJob(null);
        setSkillGap(null);
        setLearningPath(null);
        setResumeFeedback(null);
        setGeneratedResume(null);
        setGeneratedCoverLetter(null);
        setDreamCompanyRoadmap(null);
        setCompletedSteps([]);
        setProgressAssessment(null);
        setError(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
        }

        if (error) {
            return <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">
                <p>{error}</p>
                <button onClick={() => { setError(null); setIsLoading(false); }} className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md">Try Again</button>
            </div>;
        }

        switch (phase) {
            case AppPhase.PROFILE_INPUT:
                return <ProfileInput onSubmit={handleProfileSubmit} onDreamCompanySubmit={handleDreamCompanySubmit} />;
            case AppPhase.RECOMMENDATIONS:
                return <Recommendations recommendations={recommendations} onSelectJob={handleSelectJobForAnalysis} onFindJobs={handleFindLiveJobs} />;
            case AppPhase.SKILL_GAP:
                if (selectedJob && skillGap) {
                    return <SkillGapAnalysis job={selectedJob} analysis={skillGap} onBack={() => handleBack(AppPhase.RECOMMENDATIONS)} onNext={handleSelectJobForLearningPath} />;
                }
                return null;
            case AppPhase.LEARNING_PATH:
                 if (selectedJob && learningPath) {
                    return <LearningPathView 
                                job={selectedJob} 
                                path={learningPath} 
                                onBack={() => handleBack(AppPhase.SKILL_GAP)} 
                                onReset={reset}
                                completedSteps={completedSteps}
                                onToggleStep={handleToggleStep}
                                onGetAssessment={handleGetAssessment}
                                assessment={progressAssessment}
                                isLoadingAssessment={isLoadingAssessment}
                                onStartInterviewPrep={handleStartInterviewPrep}
                                onStartResumeGeneration={handleStartResumeGeneration}
                            />;
                }
                return null;
            case AppPhase.RESUME_FEEDBACK:
                if (resumeFeedback) {
                    return <ResumeFeedbackView feedback={resumeFeedback} onBack={() => setPhase(AppPhase.PROFILE_INPUT)} />;
                }
                // Fallback to show the form again if feedback is not available
                return <ResumeFeedbackView onResumeSubmit={handleResumeSubmit} />;
             case AppPhase.INTERVIEW_PREP:
                if (selectedJob) {
                    return <InterviewPrepView
                                job={selectedJob}
                                onBack={() => handleBack(AppPhase.LEARNING_PATH)}
                            />;
                }
                return null;
            case AppPhase.RESUME_GENERATOR:
                if (generatedResume && selectedJob) {
                    return <ResumeGeneratorView
                        resume={generatedResume}
                        jobTitle={selectedJob.title}
                        onBack={() => handleBack(AppPhase.LEARNING_PATH)}
                    />
                }
                return null;
            case AppPhase.COVER_LETTER_GENERATOR:
                if (generatedCoverLetter && coverLetterTargetJob) {
                    return <CoverLetterGeneratorView
                        letter={generatedCoverLetter}
                        job={coverLetterTargetJob}
                        onBack={() => handleBack(AppPhase.LEARNING_PATH)}
                    />
                }
                return null;
            case AppPhase.DREAM_COMPANY_ROADMAP:
                if (dreamCompanyRoadmap) {
                    return <DreamCompanyView roadmap={dreamCompanyRoadmap} onBack={() => handleBack(AppPhase.PROFILE_INPUT)} />;
                }
                return null;
            default:
                return <ProfileInput onSubmit={handleProfileSubmit} onDreamCompanySubmit={handleDreamCompanySubmit} />;
        }
    };

    const isResumePhase = phase === AppPhase.RESUME_FEEDBACK && !resumeFeedback;

    return (
        <div className="min-h-screen bg-slate-900 font-sans">
            <Header onReset={reset} />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-10 border border-slate-700">
                        {renderContent()}

                        {phase === AppPhase.PROFILE_INPUT && !isLoading && !dreamCompanyRoadmap && (
                            <>
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-slate-700"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-slate-800 px-2 text-sm text-slate-400">Or</span>
                                    </div>
                                </div>
                                <ResumeFeedbackView onResumeSubmit={handleResumeSubmit} />
                            </>
                        )}

                        {isResumePhase && (
                            <button onClick={() => setPhase(AppPhase.PROFILE_INPUT)} className="mt-4 text-sm text-sky-400 hover:text-sky-300">
                                &larr; Back to Profile Input
                            </button>
                        )}
                    </div>
                </div>
            </main>
             {jobSearchTarget && (
                <JobSearchModal
                    isOpen={isJobSearchModalOpen}
                    onClose={handleCloseJobSearch}
                    jobTitle={jobSearchTarget.title}
                    jobs={liveJobs}
                    isLoading={isLoadingJobs}
                    error={jobSearchError}
                    onGenerateCoverLetter={handleGenerateCoverLetter}
                    isResumeGenerated={!!generatedResume}
                />
            )}
        </div>
    );
};

export default App;