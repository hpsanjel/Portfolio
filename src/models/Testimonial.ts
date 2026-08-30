import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  }
}, {
  timestamps: true
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
