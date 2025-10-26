
import React from 'react';
import type { JobRecommendation, SkillGap } from '../types';
import Card from './common/Card';
import Pill from './common/Pill';

interface SkillGapAnalysisProps {
    job: JobRecommendation;
    analysis: SkillGap;
    onBack: () => void;
    onNext: (job: JobRecommendation) => void;
}

const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ job, analysis, onBack, onNext }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Skill Gap Analysis for <span className="text-sky-400">{job.title}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-teal-400">Your Strengths</h3>
                    <p className="text-sm text-slate-400 mb-4">Skills you already have for this role.</p>
                    <div className="flex flex-wrap gap-2">
                        {analysis.strengths.length > 0 ? (
                            analysis.strengths.map(skill => <Pill key={skill} text={skill} color="teal" />)
                        ) : (
                            <p className="text-sm text-slate-500">No matching skills identified.</p>
                        )}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-amber-400">Skill Gaps</h3>
                    <p className="text-sm text-slate-400 mb-4">Skills to develop to excel in this role.</p>
                    <div className="flex flex-wrap gap-2">
                        {analysis.gaps.length > 0 ? (
                            analysis.gaps.map(skill => <Pill key={skill} text={skill} color="amber" />)
                        ) : (
                             <p className="text-sm text-slate-500">Great job! No significant skill gaps found.</p>
                        )}
                    </div>
                </Card>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 w-full sm:w-auto text-center">
                    &larr; Back to Recommendations
                </button>
                <button 
                    onClick={() => onNext(job)} 
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                    disabled={analysis.gaps.length === 0}
                >
                    Create Learning Path
                </button>
            </div>
        </div>
    );
};

export default SkillGapAnalysis;
