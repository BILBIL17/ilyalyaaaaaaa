
export interface PersonalData {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    jobTitle: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface CVData {
    personal: PersonalData;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}
