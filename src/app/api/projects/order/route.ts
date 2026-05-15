import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Project } from "../../../../models";

// PUT /api/projects/order
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { projectOrders } = body; // Expecting array of { id: string, order: number }

    if (!projectOrders || !Array.isArray(projectOrders)) {
      return NextResponse.json({ message: "Invalid project orders data" }, { status: 400 });
    }

    // Update each project's order in a batch
    const updatePromises = projectOrders.map(({ id, order }) =>
      Project.findByIdAndUpdate(id, { order }, { returnDocument: 'after' })
    );

    const updatedProjects = await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Project orders updated successfully", 
      updatedProjects 
    });
  } catch (error) {
    console.error('Error updating project orders:', error);
    return NextResponse.json({ 
      message: "Error updating project orders", 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
