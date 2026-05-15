import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongoose";
import { Blog } from "../../../../../models";

// GET /api/blogs/by-slug/[slug]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    await connectDB();
    const blog = await Blog.findOne({ slug: decodedSlug });
    
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: "Error fetching blog post" }, { status: 500 });
  }
}
