const mongoose = require('mongoose');
const Blog = require('../src/models/Blog.ts');

// Connection string - update with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myportfolio';

async function fixBlogSlugs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all blogs with empty or null slugs
    const blogsWithEmptySlugs = await Blog.find({
      $or: [
        { slug: null },
        { slug: '' },
        { slug: { $exists: false } }
      ]
    });

    console.log(`Found ${blogsWithEmptySlugs.length} blogs with empty slugs`);

    // Update each blog with a proper slug
    for (const blog of blogsWithEmptySlugs) {
      if (!blog.title) {
        console.log(`Skipping blog without title: ${blog._id}`);
        continue;
      }

      // Generate slug using Unicode-aware regex
      const slug = blog.title
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\p{Zs}0-9\s-]+/gu, '-') // Unicode-aware regex
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');

      console.log(`Updating blog "${blog.title}" with slug: "${slug}"`);

      await Blog.findByIdAndUpdate(blog._id, { slug });
    }

    console.log('Successfully updated all blog slugs');
  } catch (error) {
    console.error('Error fixing blog slugs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixBlogSlugs();
