import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
