import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceTranslation {
  title?: string;
  description?: string;
}

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  translations?: {
    nb?: IServiceTranslation;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTranslationSchema = new Schema<IServiceTranslation>({
  title: { type: String, trim: true },
  description: { type: String }
}, { _id: false });

const ServiceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  translations: {
    nb: { type: ServiceTranslationSchema, default: undefined }
  }
}, {
  timestamps: true
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
