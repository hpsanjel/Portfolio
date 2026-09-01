import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonialTranslation {
  quote?: string;
}

export interface ITestimonial extends Document {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
  translations?: {
    nb?: ITestimonialTranslation;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialTranslationSchema = new Schema<ITestimonialTranslation>({
  quote: { type: String }
}, { _id: false });

const TestimonialSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  quote: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  avatar: {
    type: String,
    default: ''
  },
  translations: {
    nb: { type: TestimonialTranslationSchema, default: undefined }
  }
}, {
  timestamps: true
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
