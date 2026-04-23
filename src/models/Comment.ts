import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  blogSlug: string;
  author: string;
  email: string;
  content: string;
  isApproved: boolean;
  likes: string[]; // Array of user identifiers (email or IP)
  likeCount: number; // Cached count for performance
  createdAt: Date;
  updatedAt: Date;
  parentId?: mongoose.Types.ObjectId; // For threaded replies
}

const CommentSchema: Schema = new Schema({
  blogSlug: {
    type: String,
    required: true,
    index: true,
    ref: 'Blog'
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  likes: {
    type: [String],
    default: []
  },
  likeCount: {
    type: Number,
    default: 0
  },
  parentId: {
    type: String,
    ref: 'Comment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
CommentSchema.index({ blogSlug: 1, createdAt: -1 });
CommentSchema.index({ isApproved: 1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
