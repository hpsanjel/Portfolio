import { MongoClient, Db, Collection } from 'mongodb';
import {
  Blog,
  Project,
  Service,
  CvHeader,
  CvSummary,
  CvCompetency,
  CvExperience,
  CvEducation,
  CvCertification,
  CvLanguage,
  CvReference,
  CvProject
} from '../types';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
};

export async function getDatabase(): Promise<Db> {
  const client = new MongoClient(uri, options);
  await client.connect();
  return client.db('portfolio');
}

export interface Collections {
  blogs: Collection<Blog>;
  projects: Collection<Project>;
  services: Collection<Service>;
  cv_headers: Collection<CvHeader>;
  cv_summaries: Collection<CvSummary>;
  cv_competencies: Collection<CvCompetency>;
  cv_experiences: Collection<CvExperience>;
  cv_educations: Collection<CvEducation>;
  cv_certifications: Collection<CvCertification>;
  cv_languages: Collection<CvLanguage>;
  cv_references: Collection<CvReference>;
  cv_projects: Collection<CvProject>;
}

export async function getCollections(): Promise<Collections> {
  const db = await getDatabase();
  return {
    blogs: db.collection<Blog>('blogs'),
    projects: db.collection<Project>('projects'),
    services: db.collection<Service>('services'),
    cv_headers: db.collection<CvHeader>('cv_headers'),
    cv_summaries: db.collection<CvSummary>('cv_summaries'),
    cv_competencies: db.collection<CvCompetency>('cv_competencies'),
    cv_experiences: db.collection<CvExperience>('cv_experiences'),
    cv_educations: db.collection<CvEducation>('cv_educations'),
    cv_certifications: db.collection<CvCertification>('cv_certifications'),
    cv_languages: db.collection<CvLanguage>('cv_languages'),
    cv_references: db.collection<CvReference>('cv_references'),
    cv_projects: db.collection<CvProject>('cv_projects'),
  };
}
