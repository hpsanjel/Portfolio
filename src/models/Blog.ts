import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  date: string;
  slug: string;
  excerpt: string;
  author: string;
  link: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  excerpt: {
    type: String
  },
  author: {
    type: String,
    default: 'Hari Prasad Sanjel'
  },
  link: {
    type: String,
    default: '#'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Generate slug and excerpt before validation
BlogSchema.pre('validate', function() {
  const blog = this as any;
  if (blog.isModified('title') && !blog.slug) {
    blog.slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (blog.isModified('content') && !blog.excerpt) {
    blog.excerpt = blog.content.substring(0, 150) + '...';
  }
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
