import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../../models/Comment';

// GET /api/admin/comments - Get all comments (including unapproved)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'approved', 'pending', 'all'

    await mongoose.connect(process.env.MONGODB_URI!);

    let query = {};
    if (status === 'approved') {
      query = { isApproved: true };
    } else if (status === 'pending') {
      query = { isApproved: false };
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .populate('parentId', 'author content');

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/comments - Approve/reject multiple comments
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentIds, action } = body; // action: 'approve', 'reject', or 'delete'

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json(
        { error: 'Comment IDs are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    if (action === 'reject') {
      // Delete rejected comments
      const result = await Comment.deleteMany({ _id: { $in: commentIds } });
      return NextResponse.json({ 
        message: 'Comments rejected successfully', 
        deletedCount: result.deletedCount 
      });
    } else if (action === 'delete') {
      // Delete comments
      const result = await Comment.deleteMany({ _id: { $in: commentIds } });
      return NextResponse.json({ 
        message: 'Comments deleted successfully', 
        deletedCount: result.deletedCount 
      });
    } else {
      // Approve comments
      const result = await Comment.updateMany(
        { _id: { $in: commentIds } },
        { isApproved: true, updatedAt: new Date() }
      );
      
      return NextResponse.json({ 
        message: 'Comments approved successfully', 
        modifiedCount: result.modifiedCount 
      });
    }
  } catch (error) {
    console.error('Error updating comments:', error);
    return NextResponse.json(
      { error: 'Failed to update comments' },
      { status: 500 }
    );
  }
}
