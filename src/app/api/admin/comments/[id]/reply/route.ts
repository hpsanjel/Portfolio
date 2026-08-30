import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Comment from '../../../../../../models/Comment';
import { ActivityLog } from '../../../../../../models';

const ADMIN_AUTHOR = 'SanjelTech';
const ADMIN_EMAIL = 'harisanjel@gmail.com';

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*<\/script>)*/gi, '')
    .replace(/<[^>]*>/g, '')
    .substring(0, 2000);
};

// POST /api/admin/comments/[id]/reply - Admin replies to an approved comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const { id } = await params;
    const parent = await Comment.findById(id);

    if (!parent) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (!parent.isApproved) {
      return NextResponse.json(
        { error: 'Comment must be approved before replying to it' },
        { status: 400 }
      );
    }

    const reply = await Comment.create({
      blogId: parent.blogId,
      author: ADMIN_AUTHOR,
      email: ADMIN_EMAIL,
      content: sanitizeInput(content),
      parentId: parent._id,
      isApproved: true,
      isAdminReply: true,
    });

    await ActivityLog.create({
      action: 'replied to comment',
      entityType: 'comment',
      entityId: id,
      details: 'Admin replied to a comment.',
    });

    return NextResponse.json({ message: 'Reply posted successfully', comment: reply }, { status: 201 });
  } catch (error) {
    console.error('Error posting admin reply:', error);
    return NextResponse.json(
      { error: 'Failed to post reply' },
      { status: 500 }
    );
  }
}
