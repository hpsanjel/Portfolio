import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Project } from "../../../../models";
import { deleteImage, extractPublicId, isCloudinaryUrl } from "../../../../lib/cloudinary";

// PUT /api/projects/:id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { title, description, image, liveUrl, codeUrl, technologies } = body ?? {};
		
		if (!title || !description || !image || !liveUrl || !Array.isArray(technologies)) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		await connectDB();
		
		// Get the existing project to check if image changed
		const existingProject = await Project.findById(id);
		if (!existingProject) {
			return NextResponse.json({ message: "Project not found" }, { status: 404 });
		}
		
		// If image changed and old image is from Cloudinary, delete it
		if (existingProject.image !== image && isCloudinaryUrl(existingProject.image)) {
			const publicId = extractPublicId(existingProject.image);
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
			description,
			image,
			liveUrl,
			codeUrl: codeUrl || "#",
			technologies,
		};
		
		const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
		
		return NextResponse.json(updatedProject);
	} catch (error) {
		console.error('Error updating project:', error);
		return NextResponse.json({ message: "Error updating project" }, { status: 500 });
	}
}

// DELETE /api/projects/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		
		await connectDB();
		
		const deletedProject = await Project.findByIdAndDelete(id);
		
		if (!deletedProject) {
			return NextResponse.json({ message: "Project not found" }, { status: 404 });
		}
		
		// Delete image from Cloudinary if it's a Cloudinary URL
		if (isCloudinaryUrl(deletedProject.image)) {
			const publicId = extractPublicId(deletedProject.image);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting image:', error);
					// Don't fail the delete operation if image deletion fails
				}
			}
		}
		
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error deleting project:', error);
		return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
	}
}
