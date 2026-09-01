import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectTranslation {
  title?: string;
  description?: string;
  projectstory?: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
  slug: string;
  projectstory?: string;
  status: 'draft' | 'published';
  order: number;
  translations?: {
    nb?: IProjectTranslation;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectTranslationSchema = new Schema<IProjectTranslation>({
  title: { type: String, trim: true },
  description: { type: String },
  projectstory: { type: String }
}, { _id: false });

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
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  order: {
    type: Number,
    default: 0
  },
  translations: {
    nb: { type: ProjectTranslationSchema, default: undefined }
  }
}, {
  timestamps: true
});

// Generate slug before validation
ProjectSchema.pre('validate', function (this: IProject) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
