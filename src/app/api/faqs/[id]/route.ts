import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { FAQ } from "../../../../models";
import { ActivityLog } from "../../../../models";

// PUT /api/faqs/:id
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { question, answer, order, translations } = body ?? {};

		if (!question || !answer) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		await connectDB();

		const existingFAQ = await FAQ.findById(id);
		if (!existingFAQ) {
			return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
		}

		const updateData = {
			question,
			answer,
			order: order ?? existingFAQ.order,
			translations: translations !== undefined ? translations : existingFAQ.translations,
		};

		const updatedFAQ = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

		await ActivityLog.create({
			action: "updated faq",
			entityType: "faq",
			entityId: id,
			entityTitle: question,
			details: `FAQ "${question}" was updated.`,
		});

		return NextResponse.json(updatedFAQ);
	} catch (error) {
		console.error('Error updating faq:', error);
		return NextResponse.json({ message: "Error updating faq" }, { status: 500 });
	}
}

// DELETE /api/faqs/:id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		await connectDB();

		const deletedFAQ = await FAQ.findById(id);

		if (!deletedFAQ) {
			return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
		}

		await FAQ.findByIdAndDelete(id);

		await ActivityLog.create({
			action: "deleted faq",
			entityType: "faq",
			entityId: id,
			entityTitle: deletedFAQ.question,
			details: `FAQ "${deletedFAQ.question}" was deleted.`,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error deleting faq:', error);
		return NextResponse.json({ message: "Error deleting faq" }, { status: 500 });
	}
}
