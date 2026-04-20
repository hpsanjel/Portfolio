import mongoose, { Document, Schema } from 'mongoose';

export interface ICvHeader extends Document {
  name: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvHeaderSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  portfolio: {
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

export default mongoose.models.CvHeader || mongoose.model<ICvHeader>('CvHeader', CvHeaderSchema);
