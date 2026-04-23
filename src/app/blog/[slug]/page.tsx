import { Metadata } from "next";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient"

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
    // Try to fetch blog data for rich metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blogs/by-slug/${slug}`, {
      cache: 'no-store',
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });
    
    
    if (response.ok) {
      const blog = await response.json();
      
      // Check if blog is published
      if (blog.status === 'draft') {
        return {
          title: 'Blog Post Not Found',
          description: 'This blog post is not available.',
          openGraph: {
            title: 'Blog Post Not Found',
            description: 'This blog post is not available.',
            url: `${baseUrl}/blog/${slug}`,
            siteName: 'Hari Prasad Sanjel',
            type: 'article',
          },
          twitter: {
            card: 'summary_large_image',
            title: 'Blog Post Not Found',
            description: 'This blog post is not available.',
          },
        };
      }
      
      return {
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
        openGraph: {
          title: blog.title,
          description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
          url: `${baseUrl}/blog/${slug}`,
          siteName: 'Hari Prasad Sanjel',
          images: [
            {
              url: blog.image,
              width: 1200,
              height: 630,
              alt: blog.title,
              type: 'image/jpeg',
              secureUrl: blog.image,
            },
          ],
          type: 'article',
          publishedTime: blog.date,
          authors: [blog.author],
          tags: blog.tags || [],
        },
        twitter: {
          card: 'summary_large_image',
          title: blog.title,
          description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
          images: [blog.image],
          creator: '@hpsanjel',
        },
        // Explicitly provide og:image to fix Facebook warning
        other: {
          'og:image': blog.image,
          'og:image:width': '1200',
          'og:image:height': '630',
          'og:image:alt': blog.title,
          'og:image:type': 'image/jpeg',
        },
      };
    }
  } catch (error) {
    // Fallback to generic metadata if fetch fails
    console.error('Metadata fetch error:', error);
  }
  
  // Generic fallback metadata
  return {
    title: 'Blog Post',
    description: 'Read this blog post',
    openGraph: {
      title: 'Blog Post',
      description: 'Read this blog post',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${slug}`,
      siteName: 'Hari Prasad Sanjel',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog Post',
      description: 'Read this blog post',
    },
  };
}

// Server component that just renders the client component
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
