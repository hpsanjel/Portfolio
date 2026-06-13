import mongoose, { Document, Schema } from 'mongoose';

export interface IPageView extends Document {
  path: string;
  timestamp: Date;
  sessionId: string;
}

const PageViewSchema: Schema = new Schema({
  path: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
});

PageViewSchema.index({ path: 1, timestamp: -1 });
PageViewSchema.index({ sessionId: 1, timestamp: -1 });

export default mongoose.models.PageView || mongoose.model<IPageView>('PageView', PageViewSchema);
