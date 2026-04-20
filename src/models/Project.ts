import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
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
  }]
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
