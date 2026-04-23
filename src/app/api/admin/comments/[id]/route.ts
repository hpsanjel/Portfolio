import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../../../models/Comment';

// PUT /api/admin/comments/[id] - Approve/reject a single comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { action } = body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    // Convert string ID to ObjectId
    const { id } = await params;
    const objectId = new mongoose.Types.ObjectId(id);

    if (action === 'reject') {
      // Delete the comment
      const result = await Comment.findByIdAndDelete(objectId);
      if (!result) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: 'Comment rejected successfully' });
    } else {
      // Approve the comment
      const result = await Comment.findByIdAndUpdate(
        objectId,
        { isApproved: true, updatedAt: new Date() },
        { new: true } // Return the updated document
      );
      
      if (!result) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: 'Comment approved successfully', comment: result });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    // Convert string ID to ObjectId
    const { id } = await params;
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await Comment.findByIdAndDelete(objectId);

    if (!result) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
