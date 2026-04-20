import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongoose";
import { Blog, IBlog } from "../../../../../models";

// GET /api/blogs/by-slug/[slug]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: "Error fetching blog post" }, { status: 500 });
  }
}
