import React from 'react';
import type { CVData, PersonalData, Experience, Education, Skill } from '../types';
import { Section } from './Section';

interface CVFormProps {
    cvData: CVData;
    setCvData: React.Dispatch<React.SetStateAction<CVData>>;
    onGenerate: (field: keyof CVData, prompt: string, index?: number) => void;
    generating: Record<string, boolean>;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
     <textarea {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" rows={4} />
);

const GenerateButton: React.FC<{onClick: () => void; isLoading: boolean}> = ({ onClick, isLoading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="mt-2 flex items-center justify-center w-full bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-md hover:bg-indigo-200 transition duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed text-sm"
    >
        {isLoading ? (
             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zM2 6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V6z"/><path d="M11 9a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9z"/></svg>
        )}
        {isLoading ? 'Generating...' : 'Generate with AI'}
    </button>
);


export const CVForm: React.FC<CVFormProps> = ({ cvData, setCvData, onGenerate, generating }) => {
    
    const handleChange = <T extends keyof CVData, >(section: T, value: CVData[T]) => {
        setCvData(prev => ({ ...prev, [section]: value }));
    };

    const handlePersonalChange = (field: keyof PersonalData, value: string) => {
        handleChange('personal', { ...cvData.personal, [field]: value });
    };

    // FIX: Replaced the generic `handleItemChange` with an overloaded function to ensure type safety.
    // The previous implementation used a generic `T` that was not correctly inferred from the `section` argument,
    // causing `keyof T` to resolve to only the common properties (i.e., 'id'), leading to type errors.
    // This overloaded function correctly maps the `section` string to the appropriate item type and its keys.
    function handleItemChange(section: 'experience', index: number, field: keyof Experience, value: string): void;
    function handleItemChange(section: 'education', index: number, field: keyof Education, value: string): void;
    function handleItemChange(section: 'skills', index: number, field: keyof Skill, value: string): void;
    function handleItemChange(section: 'experience' | 'education' | 'skills', index: number, field: string, value: string) {
        const items = [...cvData[section]];
        // The `any` cast is necessary here because TypeScript cannot infer the correlation
        // between the `section` string and the type of `items[index]` inside the function body.
        // The overloads ensure type safety at the call site.
        items[index] = { ...(items[index] as any), [field]: value };
        handleChange(section, items as any);
    }

    const handleAddItem = (section: 'experience' | 'education' | 'skills') => {
        const newItem = {
            experience: { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' },
            education: { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '' },
            skills: { id: Date.now().toString(), name: '' },
        }[section];
        handleChange(section, [...cvData[section], newItem] as any);
    };

    const handleRemoveItem = (section: 'experience' | 'education' | 'skills', index: number) => {
        const items = [...cvData[section]];
        items.splice(index, 1);
        handleChange(section, items as any);
    };

    return (
        <form className="space-y-8">
            <Section title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-700">Full Name</label>
                        <Input value={cvData.personal.name} onChange={e => handlePersonalChange('name', e.target.value)} />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">Job Title</label>
                        <Input value={cvData.personal.jobTitle} onChange={e => handlePersonalChange('jobTitle', e.target.value)} />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Email</label>
                        <Input type="email" value={cvData.personal.email} onChange={e => handlePersonalChange('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Phone</label>
                        <Input value={cvData.personal.phone} onChange={e => handlePersonalChange('phone', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700">Address</label>
                        <Input value={cvData.personal.address} onChange={e => handlePersonalChange('address', e.target.value)} />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">LinkedIn Profile</label>
                        <Input value={cvData.personal.linkedin} onChange={e => handlePersonalChange('linkedin', e.target.value)} />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">Website/Portfolio</label>
                        <Input value={cvData.personal.website} onChange={e => handlePersonalChange('website', e.target.value)} />
                    </div>
                </div>
            </Section>

            <Section title="Professional Summary">
                <Textarea value={cvData.summary} onChange={e => handleChange('summary', e.target.value)} placeholder="Write a brief summary about yourself..."/>
                <GenerateButton 
                    isLoading={!!generating['summary']}
                    onClick={() => onGenerate('summary', `Based on this CV data: ${JSON.stringify(cvData)}, write a professional summary of 2-4 sentences.`)}
                />
            </Section>

            <Section title="Work Experience">
                {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-700">Company</label>
                                <Input value={exp.company} onChange={e => handleItemChange('experience', index, 'company', e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Role</label>
                                <Input value={exp.role} onChange={e => handleItemChange('experience', index, 'role', e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Start Date</label>
                                <Input value={exp.startDate} onChange={e => handleItemChange('experience', index, 'startDate', e.target.value)} />
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">End Date</label>
                                <Input value={exp.endDate} onChange={e => handleItemChange('experience', index, 'endDate', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="font-semibold text-gray-700">Description</label>
                                <Textarea value={exp.description} onChange={e => handleItemChange('experience', index, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." />
                                <GenerateButton 
                                    isLoading={!!generating[`experience-${index}`]}
                                    onClick={() => onGenerate('experience', `Write 2-3 bullet points for a CV describing the role of a ${exp.role} at ${exp.company}. Focus on quantifiable achievements.`, index)}
                                />
                            </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                           </svg>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddItem('experience')} className="mt-4 font-semibold text-indigo-600 hover:text-indigo-800">+ Add Experience</button>
            </Section>

            <Section title="Education">
                 {cvData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative bg-gray-50">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-700">Institution</label>
                                <Input value={edu.institution} onChange={e => handleItemChange('education', index, 'institution', e.target.value)} />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">Degree/Certificate</label>
                                <Input value={edu.degree} onChange={e => handleItemChange('education', index, 'degree', e.target.value)} />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">Start Date</label>
                                <Input value={edu.startDate} onChange={e => handleItemChange('education', index, 'startDate', e.target.value)} />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">End Date</label>
                                <Input value={edu.endDate} onChange={e => handleItemChange('education', index, 'endDate', e.target.value)} />
                            </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                           </svg>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddItem('education')} className="mt-4 font-semibold text-indigo-600 hover:text-indigo-800">+ Add Education</button>
            </Section>

            <Section title="Skills">
                {cvData.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-2">
                        <Input value={skill.name} onChange={e => handleItemChange('skills', index, 'name', e.target.value)} placeholder="e.g. React" />
                        <button type="button" onClick={() => handleRemoveItem('skills', index)} className="text-red-500 hover:text-red-700 p-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                           </svg>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddItem('skills')} className="mt-4 font-semibold text-indigo-600 hover:text-indigo-800">+ Add Skill</button>
            </Section>
        </form>
    );
};