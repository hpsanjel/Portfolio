import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { Blog } from "../../../../models";

// GET /api/blogs/archives
export async function GET() {
  try {
    await connectDB();
    
    // Fetch all published blogs
    const blogs = await Blog.find({ status: 'published' }).sort({ date: -1 });
    
    // Group blogs by year and month
    const archives: { [year: number]: { [month: number]: number } } = {};
    
    blogs.forEach(blog => {
      const date = new Date(blog.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      
      if (!archives[year]) {
        archives[year] = {};
      }
      
      if (!archives[year][month]) {
        archives[year][month] = 0;
      }
      
      archives[year][month]++;
    });
    
    // Convert to the expected format
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const result = Object.entries(archives)
      .map(([year, months]) => ({
        year: parseInt(year),
        months: Object.entries(months)
          .map(([monthIndex, count]) => ({
            month: monthNames[parseInt(monthIndex)],
            count,
            monthIndex: parseInt(monthIndex)
          }))
          .sort((a, b) => b.monthIndex - a.monthIndex) // Sort months descending (recent first)
      }))
      .sort((a, b) => b.year - a.year); // Sort years descending (recent first)
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog archives:', error);
    return NextResponse.json([], { status: 500 });
  }
}
