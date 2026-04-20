import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Blog } from "../../../../models";
import { deleteImage, extractPublicId, isCloudinaryUrl } from "../../../../lib/cloudinary";

// PUT /api/blogs/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { title, content, image, date } = body ?? {};
		
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
		};
		
		const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
		
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
		
		const deletedBlog = await Blog.findByIdAndDelete(id);
		
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
		
		return NextResponse.json({ message: "Blog deleted successfully" });
	} catch (error) {
		console.error('Error deleting blog:', error);
		return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
	}
}
