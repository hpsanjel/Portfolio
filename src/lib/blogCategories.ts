// Predefined blog categories
export const BLOG_CATEGORIES = [
  'Technology',
  'News',
  'Visa and Immigration',
  'Work Visa Abroad',
  'Study Visa',
  'Tax',
  'Finance',
  'Personal',
  'Report',
  'Jobs',
  'Internships',
  'Scholarships',
  'Success Mantras'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

// Predefined tags for better organization
export const PREDEFINED_TAGS = [
  // Technology tags
  'web-development', 'mobile-apps', 'ai', 'machine-learning', 'blockchain', 'cybersecurity',
  'programming', 'javascript', 'react', 'nodejs', 'python', 'cloud-computing',
  
  // Visa/Immigration tags
  'visa-guide', 'immigration', 'work-permit', 'student-visa', 'tourist-visa', 'permanent-residency',
  'visa-application', 'visa-requirements', 'visa-process', 'visa-success',
  
  // Career tags
  'job-search', 'career-advice', 'interview-tips', 'resume-building', 'networking',
  'professional-development', 'skills', 'training', 'certification',
  
  // Finance tags
  'personal-finance', 'investment', 'tax-planning', 'budgeting', 'savings',
  'financial-advice', 'money-management', 'wealth-building',
  
  // Education tags
  'scholarships', 'study-abroad', 'education', 'learning', 'online-courses',
  'academic-tips', 'student-life', 'research',
  
  // General tags
  'tips', 'guide', 'tutorial', 'news', 'updates', 'success-story', 'experience',
  'advice', 'recommendations', 'best-practices', 'how-to'
] as const;

export type PredefinedTag = typeof PREDEFINED_TAGS[number];
