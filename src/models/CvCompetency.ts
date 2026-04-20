import mongoose, { Document, Schema } from 'mongoose';

export interface ICvCompetency extends Document {
  category: string;
  skills: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvCompetencySchema: Schema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: String,
    required: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.CvCompetency || mongoose.model<ICvCompetency>('CvCompetency', CvCompetencySchema);
