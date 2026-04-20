import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Service } from "../../../../models";
import { deleteImage, extractPublicId, isCloudinaryUrl } from "../../../../lib/cloudinary";

// PUT /api/services/:id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { title, description, icon } = body ?? {};
		
		if (!title || !description || !icon) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		await connectDB();
		
		// Get the existing service to check if icon changed
		const existingService = await Service.findById(id);
		if (!existingService) {
			return NextResponse.json({ message: "Service not found" }, { status: 404 });
		}
		
		// If icon changed and old icon is from Cloudinary, delete it
		if (existingService.icon !== icon && isCloudinaryUrl(existingService.icon)) {
			const publicId = extractPublicId(existingService.icon);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting old icon:', error);
					// Continue with update even if icon deletion fails
				}
			}
		}
		
		const updateData = {
			title,
			description,
			icon,
		};
		
		const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
		
		return NextResponse.json(updatedService);
	} catch (error) {
		console.error('Error updating service:', error);
		return NextResponse.json({ message: "Error updating service" }, { status: 500 });
	}
}

// DELETE /api/services/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		
		await connectDB();
		
		const deletedService = await Service.findByIdAndDelete(id);
		
		if (!deletedService) {
			return NextResponse.json({ message: "Service not found" }, { status: 404 });
		}
		
		// Delete icon from Cloudinary if it's a Cloudinary URL
		if (isCloudinaryUrl(deletedService.icon)) {
			const publicId = extractPublicId(deletedService.icon);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting icon:', error);
					// Don't fail the delete operation if icon deletion fails
				}
			}
		}
		
		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error deleting service:', error);
		return NextResponse.json({ message: "Error deleting service" }, { status: 500 });
	}
}
