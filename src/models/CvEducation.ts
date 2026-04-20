import mongoose, { Document, Schema } from 'mongoose';

export interface ICvEducation extends Document {
  degree: string;
  institution: string;
  date: string;
  details: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvEducationSchema: Schema = new Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  details: {
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

export default mongoose.models.CvEducation || mongoose.model<ICvEducation>('CvEducation', CvEducationSchema);
