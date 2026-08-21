export interface CvBuilderHeader {
	name: string;
	title: string;
	address: string;
	phone: string;
	email: string;
	linkedin: string;
	github: string;
	portfolio: string;
}

export interface CvBuilderCompetency {
	category: string;
	skills: string;
}

export interface CvBuilderExperience {
	title: string;
	company: string;
	location: string;
	date: string;
	responsibilities: string[];
}

export interface CvBuilderEducation {
	degree: string;
	institution: string;
	date: string;
	details: string;
}

export interface CvBuilderCertification {
	title: string;
	issuer: string;
	date: string;
}

export interface CvBuilderLanguage {
	language: string;
	level: string;
}

export interface CvBuilderReference {
	name: string;
	position: string;
	company: string;
	location: string;
	phone: string;
	email: string;
}

export interface CvBuilderProject {
	title: string;
	description: string;
	tech: string;
	github: string;
	preview: string;
}

export interface CvBuilderData {
	header: CvBuilderHeader;
	summary: string;
	competencies: CvBuilderCompetency[];
	experience: CvBuilderExperience[];
	education: CvBuilderEducation[];
	certifications: CvBuilderCertification[];
	languages: CvBuilderLanguage[];
	references: CvBuilderReference[];
	projects: CvBuilderProject[];
}

export const emptyCvBuilderHeader: CvBuilderHeader = {
	name: "",
	title: "",
	address: "",
	phone: "",
	email: "",
	linkedin: "",
	github: "",
	portfolio: "",
};

export const emptyCvBuilderCompetency: CvBuilderCompetency = { category: "", skills: "" };
export const emptyCvBuilderExperience: CvBuilderExperience = { title: "", company: "", location: "", date: "", responsibilities: [] };
export const emptyCvBuilderEducation: CvBuilderEducation = { degree: "", institution: "", date: "", details: "" };
export const emptyCvBuilderCertification: CvBuilderCertification = { title: "", issuer: "", date: "" };
export const emptyCvBuilderLanguage: CvBuilderLanguage = { language: "", level: "" };
export const emptyCvBuilderReference: CvBuilderReference = { name: "", position: "", company: "", location: "", phone: "", email: "" };
export const emptyCvBuilderProject: CvBuilderProject = { title: "", description: "", tech: "", github: "", preview: "" };

export const emptyCvBuilderData: CvBuilderData = {
	header: emptyCvBuilderHeader,
	summary: "",
	competencies: [],
	experience: [],
	education: [],
	certifications: [],
	languages: [],
	references: [],
	projects: [],
};
