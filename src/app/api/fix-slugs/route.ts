import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Blog } from "../../../models";

// POST /api/fix-slugs
export async function POST() {
  try {
    await connectDB();

    // Find all blogs with empty or null slugs
    const blogsWithEmptySlugs = await Blog.find({
      $or: [
        { slug: null },
        { slug: '' },
        { slug: { $exists: false } }
      ]
    });

    console.log(`Found ${blogsWithEmptySlugs.length} blogs with empty slugs`);

    // Update each blog with a proper slug
    const updatedBlogs = [];
    for (const blog of blogsWithEmptySlugs) {
      if (!blog.title) {
        console.log(`Skipping blog without title: ${blog._id}`);
        continue;
      }

      // Generate slug using Unicode-aware regex
      const slug = blog.title
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\p{Zs}0-9\s-]+/gu, '-') // Unicode-aware regex
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');

      console.log(`Updating blog "${blog.title}" with slug: "${slug}"`);

      await Blog.findByIdAndUpdate(blog._id, { slug });
      updatedBlogs.push({ id: blog._id, title: blog.title, slug });
    }

    return NextResponse.json({ 
      message: "Successfully updated blog slugs",
      updated: updatedBlogs.length,
      blogs: updatedBlogs
    });
  } catch (error) {
    console.error('Error fixing blog slugs:', error);
    return NextResponse.json({ 
      message: "Error fixing blog slugs", 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
