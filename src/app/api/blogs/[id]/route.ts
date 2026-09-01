import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Blog } from "../../../../models";
import { deleteImage, extractPublicId, isCloudinaryUrl } from "../../../../lib/cloudinary";
import { ActivityLog } from "../../../../models";
import { localizeDoc, parseLocale } from "../../../../lib/localize";

// GET /api/blogs/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const { searchParams } = new URL(request.url);
		const locale = parseLocale(searchParams.get('locale'));

		await connectDB();

		const blog = await Blog.findById(id).lean();

		if (!blog) {
			return NextResponse.json({ message: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json(localizeDoc(blog, locale, ["title", "content", "excerpt"]));
	} catch (error) {
		console.error('Error fetching blog:', error);
		return NextResponse.json({ message: "Error fetching blog post" }, { status: 500 });
	}
}

// PUT /api/blogs/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { title, content, image, date, categories, tags, status, translations } = body ?? {};
		
		if (!title || !content || !image || !date) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		await connectDB();
		
		// Get the existing blog to check if image changed
		const existingBlog = await Blog.findById(id);
		if (!existingBlog) {
			return NextResponse.json({ message: "Blog not found" }, { status: 404 });
		}
		
		// If image changed and old image is from Cloudinary, delete it
		if (existingBlog.image !== image && isCloudinaryUrl(existingBlog.image)) {
			const publicId = extractPublicId(existingBlog.image);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting old image:', error);
					// Continue with update even if image deletion fails
				}
			}
		}
		
		const updateData = {
			title,
			content,
			image,
			date,
			categories: categories || existingBlog.categories,
			tags: tags || existingBlog.tags,
			status: status || existingBlog.status,
			translations: translations !== undefined ? translations : existingBlog.translations,
		};
		
		const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
		
		await ActivityLog.create({
			action: "updated blog",
			entityType: "blog",
			entityId: id,
			entityTitle: title,
			details: `Blog "${title}" was updated.`,
		});

		return NextResponse.json(updatedBlog);
	} catch (error) {
		console.error('Error updating blog:', error);
		return NextResponse.json({ message: "Error updating blog" }, { status: 500 });
	}
}

// DELETE /api/blogs/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		
		await connectDB();
		
		const deletedBlog = await Blog.findById(id);
		
		if (!deletedBlog) {
			return NextResponse.json({ message: "Blog not found" }, { status: 404 });
		}
		
		// Delete image from Cloudinary if it's a Cloudinary URL
		if (isCloudinaryUrl(deletedBlog.image)) {
			const publicId = extractPublicId(deletedBlog.image);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting image:', error);
					// Don't fail the delete operation if image deletion fails
				}
			}
		}

		await Blog.findByIdAndDelete(id);

		await ActivityLog.create({
			action: "deleted blog",
			entityType: "blog",
			entityId: id,
			entityTitle: deletedBlog.title,
			details: `Blog "${deletedBlog.title}" was deleted.`,
		});
		
		return NextResponse.json({ message: "Blog deleted successfully" });
	} catch (error) {
		console.error('Error deleting blog:', error);
		return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
	}
}
