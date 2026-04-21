import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
  slug: string;
  story?: string;
  challenges?: string;
  learnings?: string;
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
  story: {
    type: String,
    default: ''
  },
  challenges: {
    type: String,
    default: ''
  },
  learnings: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
