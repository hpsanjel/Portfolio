import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { TimeSlot, ActivityLog } from "@/models";

// DELETE /api/admin/availability/[id] — remove an open slot, or cancel a booking on that slot
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		await connectDB();
		const { id } = await params;

		const slot = await TimeSlot.findByIdAndDelete(id);
		if (!slot) {
			return NextResponse.json({ message: "Slot not found" }, { status: 404 });
		}

		if (slot.isBooked && slot.booking) {
			await ActivityLog.create({
				action: "cancelled booking",
				entityType: "booking",
				entityId: id,
				entityTitle: `${slot.date} ${slot.time} — ${slot.booking.name}`,
				details: `Cancelled the ${slot.date} ${slot.time} booking for ${slot.booking.name} (${slot.booking.email}).`,
			});
		}

		return NextResponse.json({ message: "Slot removed" });
	} catch (error) {
		console.error("Error removing slot:", error);
		return NextResponse.json({ message: "Error removing slot" }, { status: 500 });
	}
}
