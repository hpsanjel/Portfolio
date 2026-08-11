import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  entityType: string;
  entityId: string;
  entityTitle?: string;
  timestamp: Date;
  details?: string;
}

const ActivityLogSchema: Schema = new Schema({
  action: {
    type: String,
    required: true,
    index: true,
  },
  entityType: {
    type: String,
    required: true,
    index: true,
  },
  entityId: {
    type: String,
    required: true,
    index: true,
  },
  entityTitle: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  details: {
    type: String,
  },
});

ActivityLogSchema.index({ timestamp: -1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
