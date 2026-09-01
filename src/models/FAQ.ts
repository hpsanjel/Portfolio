import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQTranslation {
  question?: string;
  answer?: string;
}

export interface IFAQ extends Document {
  question: string;
  answer: string;
  order: number;
  translations?: {
    nb?: IFAQTranslation;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FAQTranslationSchema = new Schema<IFAQTranslation>({
  question: { type: String, trim: true },
  answer: { type: String }
}, { _id: false });

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
  },
  translations: {
    nb: { type: FAQTranslationSchema, default: undefined }
  }
}, {
  timestamps: true
});

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
