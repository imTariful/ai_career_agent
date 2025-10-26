import React from 'react';
import type { JobRecommendation } from '../types';
import Card from './common/Card';
import Pill from './common/Pill';

interface RecommendationsProps {
    recommendations: JobRecommendation[];
    onSelectJob: (job: JobRecommendation) => void;
    onFindJobs: (job: JobRecommendation) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, onSelectJob, onFindJobs }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Top 5 Job Recommendations For You</h2>
            <p className="text-slate-400">Based on your profile, here are some roles where you could thrive. Select one to analyze your skill gap.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                    <Card key={index} className="flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-sky-400">{rec.title}</h3>
                            <p className="mt-2 text-sm text-slate-300">{rec.description}</p>
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-slate-400 mb-2">Key Skills:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {rec.skills.map(skill => <Pill key={skill} text={skill} />)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex-shrink-0 flex items-center gap-3">
                             <button 
                                onClick={() => onSelectJob(rec)} 
                                className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                             >
                                Analyze Skill Gap
                             </button>
                             <button
                                onClick={() => onFindJobs(rec)}
                                title="Find live jobs for this role"
                                className="w-full text-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                              >
                                Find Live Jobs
                              </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;