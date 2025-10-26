import React from 'react';
import type { DreamCompanyRoadmap, LearningResource } from '../types';
import Card from './common/Card';
import Pill from './common/Pill';

interface DreamCompanyViewProps {
    roadmap: DreamCompanyRoadmap;
    onBack: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <Card>
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sky-400">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-sky-400">{title}</h3>
        </div>
        <div className="mt-4 pl-11 text-slate-300 space-y-4">{children}</div>
    </Card>
);

const ResourceList: React.FC<{ title: string, resources: LearningResource[] }> = ({ title, resources }) => {
    if (resources.length === 0) return null;
    return (
        <div>
            <h5 className="font-semibold text-slate-300 text-sm mb-2">{title}</h5>
            <div className="flex flex-wrap gap-2">
                {resources.map(res => (
                    <a key={res.name} href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:text-sky-300 bg-sky-900/50 px-2 py-1 rounded-md border border-sky-800 transition-colors flex items-center gap-1">
                        {res.name}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                ))}
            </div>
        </div>
    );
};

const DreamCompanyView: React.FC<DreamCompanyViewProps> = ({ roadmap, onBack }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Your Roadmap to <span className="text-sky-400">{roadmap.companyName}</span></h2>
                <p className="mt-2 text-slate-400">Here is your personalized, AI-generated strategic plan to land your dream job.</p>
            </div>

            <div className="space-y-6">
                <SectionCard title="A Beginner's Guideline" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>}>
                     <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                        {roadmap.beginnerIntroduction.split('\n').filter(p => p).map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </SectionCard>

                <SectionCard title="Company Profile" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375M9 12h6.375m-6.375 5.25h6.375M5.25 6.75h.008v.008H5.25v-.008zm.008 5.25h.008v.008H5.25v-.008zm0 5.25h.008v.008H5.25v-.008zm13.5-5.25h.008v.008h-.008v-.008zm0 5.25h.008v.008h-.008v-.008zM18.75 6.75h.008v.008h-.008V6.75z" /></svg>}>
                    <p>{roadmap.companyProfile}</p>
                </SectionCard>
                
                <SectionCard title="Target Roles For You" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m0 13.5v2.25m0-13.5c-1.356 0-2.67.31-3.86.855-1.178.53-2.241 1.285-3.08 2.228M3 21c-1.356 0-2.67-.31-3.86-.855-1.178-.53-2.241 1.285-3.08-2.228M21 21c1.356 0 2.67-.31 3.86-.855 1.178.53 2.241 1.285 3.08-2.228M21 3c1.356 0 2.67.31 3.86.855 1.178.53 2.241 1.285 3.08-2.228M4.14 15.86c-.53.178-1.07.318-1.64.404M4.14 8.14c-.53-.178-1.07-.318-1.64-.404" /></svg>}>
                    {roadmap.targetRoles.map(role => (
                        <div key={role.title} className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                            <h4 className="font-bold text-white">{role.title}</h4>
                            <p className="text-sm text-slate-400 mt-1">{role.reasoning}</p>
                        </div>
                    ))}
                </SectionCard>

                <SectionCard title="Skills Roadmap & Resources" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002z" /></svg>}>
                     {roadmap.skillsRoadmap.map(item => (
                        <div key={item.skill} className="p-4 bg-slate-900/50 rounded-md border border-slate-700">
                            <h4 className="font-bold text-white">{item.skill}</h4>
                            <p className="text-sm text-slate-400 mt-1 mb-4">{item.reasoning}</p>
                            <div className="space-y-3 border-t border-slate-700 pt-3">
                                <ResourceList title="Video Courses" resources={item.resources.videoCourses} />
                                <ResourceList title="YouTube Tutorials" resources={item.resources.youtubeTutorials} />
                                <ResourceList title="Books" resources={item.resources.books} />
                                <ResourceList title="Articles & PDFs" resources={item.resources.articlesAndPdfs} />
                            </div>
                        </div>
                    ))}
                </SectionCard>

                <SectionCard title="Networking Strategy" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.25 0m4.5 0a3.75 3.75 0 01-5.25 0M3 18.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72M12 12a3.75 3.75 0 01-7.5 0c0-2.071 1.679-3.75 3.75-3.75S12 9.929 12 12z" /></svg>}>
                    <ul className="list-disc list-inside space-y-2">
                        {roadmap.networkingStrategy.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </SectionCard>
                
                <SectionCard title="Opportunities to Watch" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}>
                    <div className="flex flex-wrap gap-2">
                        {roadmap.opportunities.map(opp => (
                             <a key={opp.title} href={opp.url} target="_blank" rel="noopener noreferrer" className="text-sm">
                                <Pill text={opp.title} color="teal" />
                            </a>
                        ))}
                    </div>
                </SectionCard>
                
                <SectionCard title="Resume Tailoring Tips" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}>
                    <ul className="list-disc list-inside space-y-2">
                        {roadmap.resumeTips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </SectionCard>
            </div>
            
             <div className="mt-8 pt-6 border-t border-slate-700 flex justify-start">
                 <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300">
                    &larr; Back to Profile
                </button>
            </div>
        </div>
    );
};

export default DreamCompanyView;