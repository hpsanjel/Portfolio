import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Service, IService } from "../../../models";

// GET /api/services
export async function GET() {
	try {
		await connectDB();
		const services = await Service.find({}).sort({ createdAt: -1 });
		return NextResponse.json(services);
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
		const { title, description, icon } = body ?? {};
		if (!title || !description || !icon) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		const service = new Service({
			title,
			description,
			icon,
		});
		
		await service.save();
		return NextResponse.json(service, { status: 201 });
	} catch (error) {
		console.error('Error creating service:', error);
		return NextResponse.json({ message: "Error creating service" }, { status: 500 });
	}
}
