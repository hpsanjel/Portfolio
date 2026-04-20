import mongoose, { Document, Schema } from 'mongoose';

export interface ICvSummary extends Document {
  content: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvSummarySchema: Schema = new Schema({
  content: {
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

export default mongoose.models.CvSummary || mongoose.model<ICvSummary>('CvSummary', CvSummarySchema);
