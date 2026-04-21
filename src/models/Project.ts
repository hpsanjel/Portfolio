import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
  slug: string;
  projectstory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  liveUrl: {
    type: String,
    required: true
  },
  codeUrl: {
    type: String,
    default: '#'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  projectstory: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate slug before validation
ProjectSchema.pre('validate', function() {
  const project = this as any;
  if (project.isModified('title') && !project.slug) {
    project.slug = project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
