
import React, { forwardRef } from 'react';
import type { CVData } from '../types';

interface CVPreviewProps {
    data: CVData;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
    const { personal, summary, experience, education, skills } = data;

    return (
        <div ref={ref} className="bg-white shadow-2xl rounded-lg p-8 w-full aspect-[210/297] scale-95 origin-top transform transition-transform duration-300">
            <div className="flex flex-col h-full text-sm">
                {/* Header */}
                <header className="text-center border-b-2 border-gray-200 pb-4 mb-4">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-wide">{personal.name || 'Your Name'}</h1>
                    <h2 className="text-xl font-semibold text-indigo-600 mt-1">{personal.jobTitle || 'Your Job Title'}</h2>
                    <div className="flex justify-center items-center space-x-4 mt-3 text-gray-600 text-xs">
                        <span>{personal.email}</span>
                        {personal.phone && <span>&bull;</span>}
                        <span>{personal.phone}</span>
                        {personal.address && <span>&bull;</span>}
                        <span>{personal.address}</span>
                    </div>
                     <div className="flex justify-center items-center space-x-4 mt-1 text-indigo-500 text-xs">
                        <span>{personal.linkedin}</span>
                        {personal.website && <span>&bull;</span>}
                        <span>{personal.website}</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow">
                    {/* Summary */}
                    <section className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">Summary</h3>
                        <p className="text-gray-700 leading-relaxed text-xs">{summary}</p>
                    </section>

                    {/* Experience */}
                    <section className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">Work Experience</h3>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-base font-semibold text-gray-800">{exp.role}</h4>
                                    <p className="text-xs font-medium text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                </div>
                                <p className="text-sm font-medium text-indigo-600">{exp.company}</p>
                                <p className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                     <section className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">Education</h3>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-base font-semibold text-gray-800">{edu.institution}</h4>
                                    <p className="text-xs font-medium text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p className="text-sm font-medium text-indigo-600">{edu.degree}</p>
                            </div>
                        ))}
                    </section>

                     {/* Skills */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.filter(s => s.name).map(skill => (
                                <span key={skill.id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{skill.name}</span>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
});
