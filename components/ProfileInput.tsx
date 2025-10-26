import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileInputProps {
    onSubmit: (profile: UserProfile) => void;
    onDreamCompanySubmit: (profile: UserProfile, companyName: string) => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ onSubmit, onDreamCompanySubmit }) => {
    const [experience, setExperience] = useState('');
    const [skills, setSkills] = useState('');
    const [goals, setGoals] = useState('');
    const [dreamCompany, setDreamCompany] = useState('');

    const handleGeneralSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!experience || !skills || !goals) {
            alert("Please fill out all profile fields.");
            return;
        }
        onSubmit({ experience, skills, goals });
    };
    
    const handleDreamCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!experience || !skills || !goals || !dreamCompany) {
            alert("Please fill out all profile fields and the dream company name.");
            return;
        }
        onDreamCompanySubmit({ experience, skills, goals }, dreamCompany);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Let's build your career profile</h2>
                <p className="mt-1 text-slate-400">Provide some details so our AI can tailor its recommendations for you.</p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-slate-300">Work Experience & Education</label>
                    <textarea
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"
                        placeholder="e.g., 5 years as a software developer at XYZ Corp. Bachelor's in Computer Science."
                    />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-slate-300">Skills & Interests</label>
                    <input
                        id="skills"
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"
                        placeholder="e.g., Python, React, SQL, Project Management, Graphic Design"
                    />
                     <p className="mt-1 text-xs text-slate-500">Separate skills with a comma.</p>
                </div>
                <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-slate-300">Career Goals</label>
                    <textarea
                        id="goals"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"
                        placeholder="e.g., Transition into data science, find a remote leadership role, or start my own tech business."
                    />
                </div>

                <div className="border-t border-slate-700 pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Get General Recommendations</h3>
                    <p className="text-sm text-slate-400">Get a list of job roles that match your overall profile.</p>
                    <div className="flex justify-end">
                        <button onClick={handleGeneralSubmit} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500">
                            Get Recommendations
                        </button>
                    </div>
                </div>

                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative flex justify-center"><span className="bg-slate-800 px-3 text-base font-medium text-slate-400">Or</span></div>
                </div>

                <div className="border-t border-slate-700 pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Target Your Dream Company</h3>
                     <p className="text-sm text-slate-400">Enter a specific company to get a detailed roadmap on how to land a job there.</p>
                    <div>
                        <label htmlFor="dreamCompany" className="block text-sm font-medium text-slate-300">Company Name</label>
                        <input
                            id="dreamCompany"
                            type="text"
                            value={dreamCompany}
                            onChange={(e) => setDreamCompany(e.target.value)}
                            className="mt-1 block w-full bg-slate-900/50 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                            placeholder="e.g., Google, Netflix, Stripe"
                        />
                    </div>
                     <div className="flex justify-end">
                        <button onClick={handleDreamCompanySubmit} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500">
                            Generate Company Roadmap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInput;