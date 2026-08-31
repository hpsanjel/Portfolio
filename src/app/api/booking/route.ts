import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongoose";
import { TimeSlot, ActivityLog } from "@/models";
import { formatTimeLabel, isValidDateString, isValidMonthString, isValidTimeSlot, todayDateString } from "@/lib/booking";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { escapeHtml } from "@/lib/email";

// GET /api/booking?month=YYYY-MM — dates in the month that have at least one open slot
// GET /api/booking?date=YYYY-MM-DD — open times for that date
export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const month = searchParams.get("month");
		const date = searchParams.get("date");

		if (month) {
			if (!isValidMonthString(month)) {
				return NextResponse.json({ message: "Invalid month" }, { status: 400 });
			}
			const dates = await TimeSlot.distinct("date", { date: { $regex: `^${month}` }, isBooked: false });
			return NextResponse.json(dates.sort());
		}

		if (date) {
			if (!isValidDateString(date)) {
				return NextResponse.json({ message: "Invalid date" }, { status: 400 });
			}
			const slots = await TimeSlot.find({ date, isBooked: false }).sort({ time: 1 }).select("time");
			return NextResponse.json(slots.map((s) => s.time));
		}

		return NextResponse.json({ message: "month or date query param is required" }, { status: 400 });
	} catch (error) {
		console.error("Error fetching booking availability:", error);
		return NextResponse.json({ message: "Error fetching availability" }, { status: 500 });
	}
}

// POST /api/booking — claim a slot and notify the site owner by email
export async function POST(request: NextRequest) {
	try {
		const ip = getClientIp(request);
		if (!checkRateLimit(`booking:${ip}`, 5, 10 * 60 * 1000)) {
			return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
		}

		const body = await request.json();
		const { date, time, name, email, phone, message } = body ?? {};

		if (!isValidDateString(date) || !isValidTimeSlot(time)) {
			return NextResponse.json({ message: "Invalid date or time" }, { status: 400 });
		}
		if (date < todayDateString()) {
			return NextResponse.json({ message: "That date has already passed" }, { status: 400 });
		}
		if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
			return NextResponse.json({ message: "Name must be 2-100 characters" }, { status: 400 });
		}
		if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
		}
		if (typeof phone !== "string" || phone.trim().length < 6 || phone.trim().length > 30) {
			return NextResponse.json({ message: "Invalid phone number" }, { status: 400 });
		}
		if (message !== undefined && (typeof message !== "string" || message.length > 1000)) {
			return NextResponse.json({ message: "Message is too long" }, { status: 400 });
		}

		await connectDB();

		const slot = await TimeSlot.findOneAndUpdate(
			{ date, time, isBooked: false },
			{
				$set: {
					isBooked: true,
					booking: {
						name: name.trim(),
						email: email.trim().toLowerCase(),
						phone: phone.trim(),
						message: message?.trim() || undefined,
						bookedAt: new Date(),
					},
				},
			},
			{ returnDocument: "after" }
		);

		if (!slot) {
			return NextResponse.json({ message: "That time slot is no longer available. Please choose another." }, { status: 409 });
		}

		await ActivityLog.create({
			action: "new booking",
			entityType: "booking",
			entityId: slot._id.toString(),
			entityTitle: `${date} ${time} — ${name.trim()}`,
			details: `${name.trim()} booked a meeting for ${date} at ${formatTimeLabel(time)}.`,
		});

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
		});

		const results = await Promise.allSettled([
			transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: process.env.EMAIL_USER,
				subject: `New meeting booking: ${date} at ${formatTimeLabel(time)}`,
				html: `
					<h3>New Meeting Booking</h3>
					<p><strong>Date:</strong> ${escapeHtml(date)}</p>
					<p><strong>Time:</strong> ${escapeHtml(formatTimeLabel(time))}</p>
					<p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
					<p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
					<p><strong>Phone:</strong> ${escapeHtml(phone.trim())}</p>
					${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>` : ""}
				`,
			}),
			transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: email.trim(),
				subject: `Booking confirmed: ${date} at ${formatTimeLabel(time)}`,
				html: `
					<h3>Your meeting is confirmed</h3>
					<p>Hi ${escapeHtml(name.trim())},</p>
					<p>Thanks for booking a meeting. Here are the details:</p>
					<p><strong>Date:</strong> ${escapeHtml(date)}</p>
					<p><strong>Time:</strong> ${escapeHtml(formatTimeLabel(time))}</p>
					${message ? `<p><strong>Your message:</strong></p><p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>` : ""}
					<p>If you need to reschedule or cancel, just reply to this email.</p>
					<p>Looking forward to speaking with you!</p>
				`,
			}),
		]);

		for (const [i, result] of results.entries()) {
			if (result.status === "rejected") {
				const recipient = i === 0 ? "admin" : "visitor";
				console.error(`Booking was saved but the ${recipient} notification email failed to send:`, result.reason);
			}
		}

		return NextResponse.json({ message: "Booking confirmed", date, time }, { status: 201 });
	} catch (error) {
		console.error("Error creating booking:", error);
		return NextResponse.json({ message: "Error creating booking" }, { status: 500 });
	}
}
