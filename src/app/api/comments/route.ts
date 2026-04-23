import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../models/Comment';

// Security: Rate limiting store (in production, use Redis or database)
const commentAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Security: Rate limiting function
const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const attempts = commentAttempts.get(ip);
  
  if (attempts && now - attempts.lastAttempt < windowMs && attempts.count >= 3) {
    return true; // Rate limited
  }
  
  return false;
};

// Security: Update rate limit
const updateRateLimit = (ip: string): void => {
  const now = Date.now();
  const attempts = commentAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = now;
  commentAttempts.set(ip, attempts);
  
  // Clean old entries (older than 1 hour)
  setTimeout(() => {
    const oldTime = now - (60 * 60 * 1000);
    const oldAttempts = commentAttempts.get(ip);
    if (oldAttempts && oldAttempts.lastAttempt < oldTime) {
      commentAttempts.delete(ip);
    }
  }, 60 * 60 * 1000);
};

// Security: Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*<\/script>)*/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 2000); // Limit length
};

// Security: Get client IP
const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = forwarded ? forwarded.split(',')[0].trim() : 
    request.headers.get('x-real-ip') || 
    request.headers.get('cf-connecting-ip') || 
    '127.0.0.1'; // Fallback for development
  return realIP;
};

// GET /api/comments?blogSlug=xxx - Get all approved comments for a blog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('blogSlug');

    if (!blogSlug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // Security: Validate blogSlug
    if (!/^[a-zA-Z0-9-_]+$/.test(blogSlug) || blogSlug.length > 100) {
      return NextResponse.json(
        { error: 'Invalid blog slug' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Get all top-level comments
    const topLevelComments = await Comment.find({ 
      blogSlug, 
      isApproved: true,
      parentId: null // Only get top-level comments
    }).sort({ createdAt: 1 });

    // Get all replies for these comments
    const replyIds = topLevelComments.map(comment => comment._id);
    const replies = await Comment.find({ 
      blogSlug, 
      isApproved: true,
      parentId: { $in: replyIds }
    }).sort({ createdAt: 1 });

    // Organize replies by parent ID
    const repliesByParent: { [key: string]: any[] } = {};
    replies.forEach(reply => {
      const parentId = reply.parentId?.toString();
      if (parentId && !repliesByParent[parentId]) {
        repliesByParent[parentId] = [];
      }
      if (parentId) {
        repliesByParent[parentId].push(reply);
      }
    });

    // Attach replies to their parent comments
    const commentsWithReplies = topLevelComments.map(comment => ({
      ...comment.toObject(),
      replies: repliesByParent[comment._id.toString()] || []
    }));

    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Security: Rate limiting check
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many comment attempts. Please try again later.' },
        { status: 429 } // Too Many Requests
      );
    }

    const body = await request.json();

    const { blogSlug, author, email, content, parentId } = body;

    // Security: Enhanced validation
    if (!blogSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Security: Validate blogSlug
    if (!/^[a-zA-Z0-9-_]+$/.test(blogSlug) || blogSlug.length > 100) {
      return NextResponse.json(
        { error: 'Invalid blog slug format' },
        { status: 400 }
      );
    }

    // Security: Validate author name
    if (author.length < 2 || author.length > 100) {
      return NextResponse.json(
        { error: 'Author name must be 2-100 characters' },
        { status: 400 }
      );
    }

    // Security: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Security: Validate content
    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be 10-2000 characters' },
        { status: 400 }
      );
    }

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /onclick\s*=/gi,
      /onerror\s*=/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        return NextResponse.json(
          { error: 'Invalid content format' },
          { status: 400 }
        );
      }
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Security: Sanitize all inputs
    const sanitizedBlogSlug = sanitizeInput(blogSlug);
    const sanitizedAuthor = sanitizeInput(author);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedContent = sanitizeInput(content);

    const newComment = new Comment({
      blogSlug: sanitizedBlogSlug,
      author: sanitizedAuthor,
      email: sanitizedEmail,
      content: sanitizedContent,
      parentId: parentId || null,
      isApproved: false, // Comments require approval
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newComment.save();

    // Security: Update rate limit on successful submission
    updateRateLimit(clientIP);

    return NextResponse.json(
      { 
        message: 'Comment submitted successfully. It will be visible after approval.',
        comment: {
          ...newComment.toObject(),
          // Don't expose internal fields
          blogSlug: undefined,
          parentId: undefined
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
