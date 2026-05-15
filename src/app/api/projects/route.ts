import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Project, IProject } from "../../../models";

// GET /api/projects
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status');
		const query = status ? { status } : {};

		await connectDB();
		const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json({ message: "Error fetching projects" }, { status: 500 });
	}
}

// POST /api/projects
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { title, description, image, liveUrl, codeUrl, technologies, projectstory, status, order } = body ?? {};
		if (!title || !description || !image || !liveUrl || !Array.isArray(technologies)) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		// Get the highest order value and increment it
		const maxOrder = await Project.findOne().sort({ order: -1 }).select('order');
		const nextOrder = order !== undefined ? order : (maxOrder?.order || 0) + 1;
		
		const project = new Project({
			title,
			description,
			image,
			liveUrl,
			codeUrl: codeUrl || "#",
			technologies,
			projectstory: projectstory || "",
			status: status || 'published',
			order: nextOrder,
		});
		
		await project.save();
		return NextResponse.json(project, { status: 201 });
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json({ message: "Error creating project" }, { status: 500 });
	}
}
