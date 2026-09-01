import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Blog, IBlog } from "../../../models";
import { ActivityLog } from "../../../models";
import { localizeDocs, parseLocale } from "../../../lib/localize";

// GET /api/blogs
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status');
		const locale = parseLocale(searchParams.get('locale'));

		// Filter by status if provided
		const filter = status ? { status } : {};
		const blogs = await Blog.find(filter).sort({ order: 1, createdAt: -1 }).lean();
		return NextResponse.json(localizeDocs(blogs, locale, ["title", "content", "excerpt"]));
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
		const { title, content, image, date, categories, tags, status, order, translations } = body ?? {};
		if (!title || !content || !image || !date) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		// Get the highest order value and increment it
		const maxOrder = await Blog.findOne().sort({ order: -1 }).select('order');
		const nextOrder = order !== undefined ? order : (maxOrder?.order || 0) + 1;

		const blog = new Blog({
			title,
			content,
			image,
			date,
			categories: categories || [],
			tags: tags || [],
			status: status || 'published',
			order: nextOrder,
			translations,
		});
		
		await blog.save();

		await ActivityLog.create({
			action: "created blog",
			entityType: "blog",
			entityId: blog._id.toString(),
			entityTitle: title,
			details: `Blog "${title}" was created.`,
		});

		return NextResponse.json(blog, { status: 201 });
	} catch (error) {
		console.error('Error creating blog:', error);
		return NextResponse.json({ 
			message: "Error creating blog post", 
			error: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
}
