import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../../../models/Comment';

// POST /api/comments/[id]/like - Like a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userIdentifier } = body; // Could be email, IP, or user ID

    if (!userIdentifier) {
      return NextResponse.json(
        { error: 'User identifier is required' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Find the comment (Mongoose handles string ID conversion)
    const { id } = await params;
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    if (comment.likes.includes(userIdentifier)) {
      return NextResponse.json(
        { error: 'You have already liked this comment' },
        { status: 400 }
      );
    }

    // Add user to likes array and increment count
    comment.likes.push(userIdentifier);
    comment.likeCount = comment.likes.length;
    await comment.save();

    return NextResponse.json({ 
      message: 'Comment liked successfully',
      likeCount: comment.likeCount,
      isLiked: true
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id]/like - Unlike a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userIdentifier } = body;

    if (!userIdentifier) {
      return NextResponse.json(
        { error: 'User identifier is required' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Find the comment (Mongoose handles string ID conversion)
    const { id } = await params;
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user hasn't liked this comment
    if (!comment.likes.includes(userIdentifier)) {
      return NextResponse.json(
        { error: 'You have not liked this comment' },
        { status: 400 }
      );
    }

    // Remove user from likes array and decrement count
    comment.likes = comment.likes.filter((id: string) => id !== userIdentifier);
    comment.likeCount = comment.likes.length;
    await comment.save();

    return NextResponse.json({ 
      message: 'Comment unliked successfully',
      likeCount: comment.likeCount,
      isLiked: false
    });
  } catch (error) {
    console.error('Error unliking comment:', error);
    return NextResponse.json(
      { error: 'Failed to unlike comment' },
      { status: 500 }
    );
  }
}
