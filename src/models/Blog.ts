import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  date: string;
  excerpt: string;
  author: string;
  link: string;
  categories: string[];
  tags: string[];
  status: 'draft' | 'published';
  order: number;
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
  excerpt: {
    type: String
  },
  author: {
    type: String,
    default: 'SanjelTech'
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
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Generate excerpt before validation
BlogSchema.pre('validate', function (this: IBlog) {
  if (this.isModified('content') && !this.excerpt) {
    const plainText = stripHtml(this.content);
    this.excerpt = plainText.substring(0, 150) + '...';
  }
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
