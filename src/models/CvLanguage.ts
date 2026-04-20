import mongoose, { Document, Schema } from 'mongoose';

export interface ICvLanguage extends Document {
  language: string;
  level: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvLanguageSchema: Schema = new Schema({
  language: {
    type: String,
    required: true,
    trim: true
  },
  level: {
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

export default mongoose.models.CvLanguage || mongoose.model<ICvLanguage>('CvLanguage', CvLanguageSchema);
