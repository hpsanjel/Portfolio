// Blog types
export interface Blog {
  _id?: string;
  title: string;
  content: string;
  image: string;
  date: string;
  slug: string;
  excerpt?: string;
  author?: string;
  link?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Project types
export interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl?: string;
  technologies: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Service types
export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Header types
export interface CvHeader {
  _id?: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Summary types
export interface CvSummary {
  _id?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Competency types
export interface CvCompetency {
  _id?: string;
  category: string;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Experience types
export interface CvExperience {
  _id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Education types
export interface CvEducation {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  achievements?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Certification types
export interface CvCertification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Language types
export interface CvLanguage {
  _id?: string;
  language: string;
  proficiency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Reference types
export interface CvReference {
  _id?: string;
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  relationship: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV Project types (different from portfolio projects)
export interface CvProject {
  _id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  highlights?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
