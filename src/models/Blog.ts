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
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
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
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Generate slug and excerpt before validation
BlogSchema.pre('validate', function() {
  const blog = this as any;
  if (blog.isModified('title') && !blog.slug) {
    blog.slug = blog.title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\p{Zs}0-9\s-]+/gu, '-') // Unicode-aware regex
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (blog.isModified('content') && !blog.excerpt) {
    const plainText = stripHtml(blog.content);
    blog.excerpt = plainText.substring(0, 150) + '...';
  }
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
