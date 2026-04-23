import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../models/Comment';

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
    const body = await request.json();

    const { blogSlug, author, email, content, parentId } = body;

    // Validation
    if (!blogSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const newComment = new Comment({
      blogSlug,
      author: author.trim(),
      email: email.toLowerCase().trim(),
      content: content.trim(),
      parentId: parentId || null,
      isApproved: false // Comments require approval
    });

    await newComment.save();

    return NextResponse.json(
      { 
        message: 'Comment submitted successfully. It will be visible after approval.',
        comment: newComment
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
