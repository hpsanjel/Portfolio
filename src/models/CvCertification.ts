import mongoose, { Document, Schema } from 'mongoose';

export interface ICvCertification extends Document {
  title: string;
  issuer: string;
  date: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CvCertificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
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

export default mongoose.models.CvCertification || mongoose.model<ICvCertification>('CvCertification', CvCertificationSchema);
