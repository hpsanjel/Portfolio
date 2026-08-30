// Blog types
export interface Blog {
  _id?: string;
  title: string;
  content: string;
  image: string;
  date: string;
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

