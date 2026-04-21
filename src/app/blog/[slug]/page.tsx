import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogDetailClient from "./BlogDetailClient";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  date: string;
  slug: string;
  author: string;
  tags: string[];
  link?: string;
}

// Generate metadata for the blog page
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/by-slug/${slug}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }
    
    const blog = await response.json();
    
    return {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${slug}`,
        siteName: 'Hari Prasad Sanjel',
        images: [
          {
            url: blog.image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        type: 'article',
        publishedTime: blog.date,
        authors: [blog.author],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
        images: [blog.image],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Read this blog post',
    };
  }
}

// Server component that fetches data and passes to client component
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch blog data on server
  const blogRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/by-slug/${slug}`, {
    cache: 'no-store'
  });
  
  if (!blogRes.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            &larr; Back to blogs
          </Link>
        </div>
      </div>
    );
  }
  
  const blog = await blogRes.json();
  
  // Fetch related blogs
  const allBlogsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs`, {
    cache: 'no-store'
  });
  const allBlogs = allBlogsRes.ok ? await allBlogsRes.json() : [];
  const relatedBlogs = allBlogs.filter((b: Blog) => b.slug !== slug);
  
  return <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />;
}
