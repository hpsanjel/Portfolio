import mongoose, { Document, Schema } from 'mongoose';

export interface ICvExperience extends Document {
  title: string;
  company: string;
  location: string;
  date: string;
  responsibilities: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvExperienceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.CvExperience || mongoose.model<ICvExperience>('CvExperience', CvExperienceSchema);
