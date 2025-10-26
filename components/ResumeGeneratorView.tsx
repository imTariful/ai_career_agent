import React, { useState } from 'react';
import type { GeneratedResume } from '../types';

interface ResumeGeneratorViewProps {
    resume: GeneratedResume;
    jobTitle: string;
    onBack: () => void;
}

const ResumeGeneratorView: React.FC<ResumeGeneratorViewProps> = ({ resume, jobTitle, onBack }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const generatePlainTextResume = () => {
        let text = `${resume.name}\n`;
        text += `${resume.email} | ${resume.phone} | ${resume.linkedin}\n\n`;
        text += `--- PROFESSIONAL SUMMARY ---\n${resume.summary}\n\n`;
        text += `--- SKILLS ---\n`;
        text += `Technical: ${resume.skills.technical.join(', ')}\n`;
        text += `Soft: ${resume.skills.soft.join(', ')}\n\n`;
        text += `--- WORK EXPERIENCE ---\n\n`;
        resume.experience.forEach(exp => {
            text += `${exp.role.toUpperCase()} | ${exp.company}\n${exp.duration}\n`;
            exp.points.forEach(point => {
                text += `  • ${point}\n`;
            });
            text += '\n';
        });
        text += `--- EDUCATION ---\n\n`;
        resume.education.forEach(edu => {
            text += `${edu.degree}, ${edu.university} | ${edu.duration}\n`;
        });
        return text;
    };

    const handleCopyToClipboard = () => {
        const resumeText = generatePlainTextResume();
        navigator.clipboard.writeText(resumeText).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Copy Failed');
        });
    };

    const handleDownloadResume = () => {
        const resumeText = generatePlainTextResume();
        const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = resume.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        a.download = `${safeName}_resume.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Generated Resume for <span className="text-sky-400">{jobTitle}</span></h2>
            <p className="text-slate-400">This resume is ATS-friendly and tailored for your target role. Copy the text or download it for your records.</p>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 md:p-8 font-sans text-sm text-slate-300 leading-relaxed">
                {/* Header */}
                <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-white tracking-wider">{resume.name.toUpperCase()}</h3>
                    <p className="text-slate-400 mt-1">{resume.email} | {resume.phone} | {resume.linkedin}</p>
                </div>

                {/* Summary */}
                <section>
                    <h4 className="font-bold text-sky-400 border-b-2 border-slate-700 pb-1 mb-2 text-sm tracking-widest">PROFESSIONAL SUMMARY</h4>
                    <p className="text-slate-300">{resume.summary}</p>
                </section>
                
                {/* Skills */}
                <section className="mt-4">
                    <h4 className="font-bold text-sky-400 border-b-2 border-slate-700 pb-1 mb-2 text-sm tracking-widest">SKILLS</h4>
                    <div>
                       <p><span className="font-semibold text-white">Technical:</span> {resume.skills.technical.join(', ')}</p>
                       <p className="mt-1"><span className="font-semibold text-white">Soft:</span> {resume.skills.soft.join(', ')}</p>
                    </div>
                </section>

                {/* Experience */}
                <section className="mt-4">
                    <h4 className="font-bold text-sky-400 border-b-2 border-slate-700 pb-1 mb-2 text-sm tracking-widest">WORK EXPERIENCE</h4>
                    {resume.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h5 className="font-bold text-white text-base">{exp.role.toUpperCase()}</h5>
                                <p className="text-xs text-slate-400 font-mono">{exp.duration}</p>
                            </div>
                            <p className="italic text-slate-300 text-sm">{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300 pl-2">
                                {exp.points.map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
                {/* Education */}
                <section className="mt-4">
                    <h4 className="font-bold text-sky-400 border-b-2 border-slate-700 pb-1 mb-2 text-sm tracking-widest">EDUCATION</h4>
                     {resume.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-baseline">
                            <p><span className="font-bold text-white">{edu.degree}</span>, {edu.university}</p>
                            <p className="text-xs text-slate-400 font-mono">{edu.duration}</p>
                        </div>
                     ))}
                </section>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={onBack} className="text-sm text-sky-400 hover:text-sky-300 w-full sm:w-auto text-center">
                    &larr; Back to Learning Path
                </button>
                <div className="flex flex-col-reverse sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                        onClick={handleDownloadResume} 
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                    >
                        Download (.txt)
                    </button>
                    <button 
                        onClick={handleCopyToClipboard} 
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500"
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeGeneratorView;