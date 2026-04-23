import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Blog, IBlog } from "../../../models";

// GET /api/blogs
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status');
		
		// Filter by status if provided
		const filter = status ? { status } : {};
		const blogs = await Blog.find(filter).sort({ createdAt: -1 });
		return NextResponse.json(blogs);
	} catch (error) {
		console.error('Error fetching blogs:', error);
		return NextResponse.json([], { status: 500 });
	}
}

// POST /api/blogs
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { title, content, image, date, categories, tags, status } = body ?? {};
		if (!title || !content || !image || !date) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		const blog = new Blog({
			title,
			content,
			image,
			date,
			categories: categories || [],
			tags: tags || [],
			status: status || 'published',
		});
		
		await blog.save();
		return NextResponse.json(blog, { status: 201 });
	} catch (error) {
		console.error('Error creating blog:', error);
		return NextResponse.json({ 
			message: "Error creating blog post", 
			error: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
}
