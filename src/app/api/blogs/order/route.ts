import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Blog } from "../../../../models";

// PUT /api/blogs/order
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { blogOrders } = body; // Expecting array of { id: string, order: number }

    if (!blogOrders || !Array.isArray(blogOrders)) {
      return NextResponse.json({ message: "Invalid blog orders data" }, { status: 400 });
    }

    // Update each blog's order in a batch
    const updatePromises = blogOrders.map(({ id, order }) =>
      Blog.findByIdAndUpdate(id, { order }, { returnDocument: 'after' })
    );

    const updatedBlogs = await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Blog orders updated successfully", 
      updatedBlogs 
    });
  } catch (error) {
    console.error('Error updating blog orders:', error);
    return NextResponse.json({ 
      message: "Error updating blog orders", 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
