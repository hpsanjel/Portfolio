import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Service, IService } from "../../../models";
import { ActivityLog } from "../../../models";
import { localizeDocs, parseLocale } from "../../../lib/localize";

// GET /api/services
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const locale = parseLocale(searchParams.get('locale'));
		const services = await Service.find({}).sort({ createdAt: -1 }).lean();
		return NextResponse.json(localizeDocs(services, locale, ["title", "description"]));
	} catch (error) {
		console.error('Error fetching services:', error);
		return NextResponse.json({ message: "Error fetching services" }, { status: 500 });
	}
}

// POST /api/services
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { title, description, icon, translations } = body ?? {};
		if (!title || !description || !icon) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		const service = new Service({
			title,
			description,
			icon,
			translations,
		});
		
		await service.save();

		await ActivityLog.create({
			action: "created service",
			entityType: "service",
			entityId: service._id.toString(),
			entityTitle: title,
			details: `Service "${title}" was created.`,
		});

		return NextResponse.json(service, { status: 201 });
	} catch (error) {
		console.error('Error creating service:', error);
		return NextResponse.json({ message: "Error creating service" }, { status: 500 });
	}
}
