import mongoose, { Document, Schema } from 'mongoose';

export interface ICvReference extends Document {
  name: string;
  position: string;
  company: string;
  location: string;
  phone: string;
  email: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvReferenceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
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

export default mongoose.models.CvReference || mongoose.model<ICvReference>('CvReference', CvReferenceSchema);
