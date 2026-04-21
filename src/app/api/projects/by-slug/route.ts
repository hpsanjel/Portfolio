import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter required' },
        { status: 400 }
      );
    }
    
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Use raw collection to find project by slug
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const projectsCollection = db.collection('projects');
    
    const project = await projectsCollection.findOne({ slug: slug });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', slug },
        { status: 404 }
      );
    }
    
    // Convert ObjectId to string for proper JSON serialization
    const projectData = {
      ...project,
      _id: project._id.toString(),
      id: project._id.toString()
    };
    
    return NextResponse.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
