import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { TimeSlot } from "@/models";
import { isValidDateString, isValidMonthString, isValidTimeSlot } from "@/lib/booking";

// GET /api/admin/availability?date=YYYY-MM-DD — all slots for one day
// GET /api/admin/availability?month=YYYY-MM — per-day available/booked counts for a calendar view
// GET /api/admin/availability?booked=true — every booked slot, soonest first
export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const date = searchParams.get("date");
		const month = searchParams.get("month");
		const booked = searchParams.get("booked");

		if (date) {
			if (!isValidDateString(date)) {
				return NextResponse.json({ message: "Invalid date" }, { status: 400 });
			}
			const slots = await TimeSlot.find({ date }).sort({ time: 1 });
			return NextResponse.json(slots);
		}

		if (month) {
			if (!isValidMonthString(month)) {
				return NextResponse.json({ message: "Invalid month" }, { status: 400 });
			}
			const slots = await TimeSlot.find({ date: { $regex: `^${month}` } }).select("date isBooked");
			const summary: Record<string, { available: number; booked: number }> = {};
			for (const slot of slots) {
				const entry = summary[slot.date] || { available: 0, booked: 0 };
				if (slot.isBooked) entry.booked += 1;
				else entry.available += 1;
				summary[slot.date] = entry;
			}
			return NextResponse.json(summary);
		}

		if (booked === "true") {
			const slots = await TimeSlot.find({ isBooked: true }).sort({ date: 1, time: 1 });
			return NextResponse.json(slots);
		}

		return NextResponse.json({ message: "date, month, or booked query param is required" }, { status: 400 });
	} catch (error) {
		console.error("Error fetching availability:", error);
		return NextResponse.json({ message: "Error fetching availability" }, { status: 500 });
	}
}

// POST /api/admin/availability — mark one or more time slots available on a date
export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const body = await request.json();
		const { date, times } = body ?? {};

		if (!isValidDateString(date) || !Array.isArray(times) || times.length === 0) {
			return NextResponse.json({ message: "date and a non-empty times array are required" }, { status: 400 });
		}
		if (!times.every((t: unknown) => typeof t === "string" && isValidTimeSlot(t))) {
			return NextResponse.json({ message: "One or more times are invalid" }, { status: 400 });
		}

		// Upsert so an already-existing (possibly booked) slot is never overwritten.
		await Promise.all(
			times.map((time: string) =>
				TimeSlot.updateOne({ date, time }, { $setOnInsert: { date, time, isBooked: false } }, { upsert: true })
			)
		);

		const slots = await TimeSlot.find({ date }).sort({ time: 1 });
		return NextResponse.json(slots, { status: 201 });
	} catch (error) {
		console.error("Error adding availability:", error);
		return NextResponse.json({ message: "Error adding availability" }, { status: 500 });
	}
}
