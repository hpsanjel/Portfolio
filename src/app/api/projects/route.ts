import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { Project, IProject } from "../../../models";

// GET /api/projects
export async function GET() {
	try {
		await connectDB();
		const projects = await Project.find({}).sort({ createdAt: -1 });
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
		const { title, description, image, liveUrl, codeUrl, technologies, projectstory } = body ?? {};
		if (!title || !description || !image || !liveUrl || !Array.isArray(technologies)) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}
		
		const project = new Project({
			title,
			description,
			image,
			liveUrl,
			codeUrl: codeUrl || "#",
			technologies,
			projectstory: projectstory || "",
		});
		
		await project.save();
		return NextResponse.json(project, { status: 201 });
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json({ message: "Error creating project" }, { status: 500 });
	}
}
