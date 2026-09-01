import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Testimonial } from "../../../models";
import { ActivityLog } from "../../../models";
import { localizeDocs, parseLocale } from "../../../lib/localize";

// GET /api/testimonials
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const locale = parseLocale(searchParams.get('locale'));
		const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
		return NextResponse.json(localizeDocs(testimonials, locale, ["quote"]));
	} catch (error) {
		console.error('Error fetching testimonials:', error);
		return NextResponse.json({ message: "Error fetching testimonials" }, { status: 500 });
	}
}

// POST /api/testimonials
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { name, role, quote, rating, avatar, translations } = body ?? {};
		if (!name || !role || !quote) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		const testimonial = new Testimonial({
			name,
			role,
			quote,
			rating: rating || 5,
			avatar: avatar || "",
			translations,
		});

		await testimonial.save();

		await ActivityLog.create({
			action: "created testimonial",
			entityType: "testimonial",
			entityId: testimonial._id.toString(),
			entityTitle: name,
			details: `Testimonial from "${name}" was created.`,
		});

		return NextResponse.json(testimonial, { status: 201 });
	} catch (error) {
		console.error('Error creating testimonial:', error);
		return NextResponse.json({ message: "Error creating testimonial" }, { status: 500 });
	}
}
