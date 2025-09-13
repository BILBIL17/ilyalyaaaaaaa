
import { useState } from 'react';
import type { CVData } from '../types';

const initialCVData: CVData = {
    personal: {
        name: 'Jane Doe',
        jobTitle: 'Senior Frontend Engineer',
        email: 'jane.doe@example.com',
        phone: '123-456-7890',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/janedoe',
        website: 'janedoe.dev'
    },
    summary: 'Experienced Senior Frontend Engineer with over 8 years of expertise in creating responsive, high-performance web applications using React, TypeScript, and modern JavaScript frameworks. Proven ability to lead projects, mentor junior developers, and collaborate effectively with cross-functional teams to deliver exceptional user experiences.',
    experience: [
        {
            id: 'exp1',
            company: 'Tech Solutions Inc.',
            role: 'Senior Frontend Engineer',
            startDate: 'Jan 2020',
            endDate: 'Present',
            description: 'Led the development of a customer-facing analytics dashboard using React and D3.js, resulting in a 30% increase in user engagement. Mentored a team of 4 junior developers.'
        },
        {
            id: 'exp2',
            company: 'Web Innovators',
            role: 'Frontend Developer',
            startDate: 'Jun 2016',
            endDate: 'Dec 2019',
            description: 'Developed and maintained client websites using HTML, CSS, and JavaScript. Collaborated with designers to implement pixel-perfect user interfaces.'
        }
    ],
    education: [
        {
            id: 'edu1',
            institution: 'University of Technology',
            degree: 'B.S. in Computer Science',
            startDate: 'Sep 2012',
            endDate: 'May 2016'
        }
    ],
    skills: [
        { id: 'skill1', name: 'React' },
        { id: 'skill2', name: 'TypeScript' },
        { id: 'skill3', name: 'JavaScript (ES6+)' },
        { id: 'skill4', name: 'Tailwind CSS' },
        { id: 'skill5', name: 'Node.js' },
        { id: 'skill6', name: 'GraphQL' },
    ]
};

export const useCVData = () => {
    const [cvData, setCvData] = useState<CVData>(initialCVData);
    return { cvData, setCvData };
};
