import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project from '@/models/Project';

export async function POST() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Get first project
    const firstProject = await Project.findOne({});
    
    if (firstProject) {
      // Manually set a slug
      const testSlug = 'test-project';
      await Project.findByIdAndUpdate(firstProject._id, { slug: testSlug });
      
      return NextResponse.json({ 
        message: `Updated project "${firstProject.title}" with slug: "${testSlug}"`,
        projectId: firstProject._id
      });
    } else {
      return NextResponse.json({ 
        message: 'No projects found' 
      });
    }
  } catch (error) {
    console.error('Error updating slug:', error);
    return NextResponse.json(
      { error: 'Failed to update slug' },
      { status: 500 }
    );
  }
}
