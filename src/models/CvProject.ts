import mongoose, { Document, Schema } from 'mongoose';

export interface ICvProject extends Document {
  title: string;
  description: string;
  tech: string;
  github: string;
  preview: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tech: {
    type: String,
    required: true
  },
  github: {
    type: String,
    default: ''
  },
  preview: {
    type: String,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.CvProject || mongoose.model<ICvProject>('CvProject', CvProjectSchema);
