import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Testimonial } from "../../../../models";
import { deleteImage, extractPublicId, isCloudinaryUrl } from "../../../../lib/cloudinary";
import { ActivityLog } from "../../../../models";

// PUT /api/testimonials/:id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { name, role, quote, rating, avatar, translations } = body ?? {};

		if (!name || !role || !quote) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		await connectDB();

		const existingTestimonial = await Testimonial.findById(id);
		if (!existingTestimonial) {
			return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
		}

		// If avatar changed and old avatar is from Cloudinary, delete it
		if (existingTestimonial.avatar && existingTestimonial.avatar !== avatar && isCloudinaryUrl(existingTestimonial.avatar)) {
			const publicId = extractPublicId(existingTestimonial.avatar);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting old avatar:', error);
					// Continue with update even if avatar deletion fails
				}
			}
		}

		const updateData = {
			name,
			role,
			quote,
			rating: rating || 5,
			avatar: avatar || "",
			translations: translations !== undefined ? translations : existingTestimonial.translations,
		};

		const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });

		await ActivityLog.create({
			action: "updated testimonial",
			entityType: "testimonial",
			entityId: id,
			entityTitle: name,
			details: `Testimonial from "${name}" was updated.`,
		});

		return NextResponse.json(updatedTestimonial);
	} catch (error) {
		console.error('Error updating testimonial:', error);
		return NextResponse.json({ message: "Error updating testimonial" }, { status: 500 });
	}
}

// DELETE /api/testimonials/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		await connectDB();

		const deletedTestimonial = await Testimonial.findById(id);

		if (!deletedTestimonial) {
			return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
		}

		// Delete avatar from Cloudinary if it's a Cloudinary URL
		if (deletedTestimonial.avatar && isCloudinaryUrl(deletedTestimonial.avatar)) {
			const publicId = extractPublicId(deletedTestimonial.avatar);
			if (publicId) {
				try {
					await deleteImage(publicId);
				} catch (error) {
					console.error('Error deleting avatar:', error);
					// Don't fail the delete operation if avatar deletion fails
				}
			}
		}

		await Testimonial.findByIdAndDelete(id);

		await ActivityLog.create({
			action: "deleted testimonial",
			entityType: "testimonial",
			entityId: id,
			entityTitle: deletedTestimonial.name,
			details: `Testimonial from "${deletedTestimonial.name}" was deleted.`,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error deleting testimonial:', error);
		return NextResponse.json({ message: "Error deleting testimonial" }, { status: 500 });
	}
}
