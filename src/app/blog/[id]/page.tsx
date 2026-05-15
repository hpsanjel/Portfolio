import { Metadata } from "next";
import BlogDetailClient from "@/app/blog/[id]/BlogDetailClient"
import connectDB from "@/lib/mongoose";
import { Blog as BlogModel } from "@/models";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  link?: string;
}

function getJpgOpenGraphImageUrl(imageUrl: string): string {
  if (!imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  return imageUrl.replace(/\.[a-zA-Z0-9]+(?:\?.*)?$/, '.jpg');
}

// Generate metadata for the blog page
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_AUTH_BASE_URL || 'https://www.sanjeltech.com';
  const canonicalUrl = `${baseUrl}/blog/${id}`;
  
  
  try {
    await connectDB();
    const blog = await BlogModel.findById(id).lean();
      
    // Check if blog is published
    if (blog && blog.status !== 'draft') {
      const ogImageUrl = getJpgOpenGraphImageUrl(blog.image);

      return {
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
        alternates: {
          canonical: canonicalUrl,
        },
        openGraph: {
          title: blog.title,
          description: blog.excerpt || blog.content?.substring(0, 150) + '...' || 'Read this blog post',
          url: canonicalUrl,
          siteName: 'Hari Prasad Sanjel',
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: blog.title,
              type: 'image/jpeg',
              secureUrl: ogImageUrl,
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
          images: [ogImageUrl],
          creator: '@hpsanjel',
        },
        // Explicitly provide og:image to fix Facebook warning
        other: {
          'og:image': ogImageUrl,
          'og:image:width': '1200',
          'og:image:height': '630',
          'og:image:alt': blog.title,
          'og:image:type': 'image/jpeg',
        },
      };
    }
    
    return {
      title: 'Blog Post Not Found',
      description: 'This blog post is not available.',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: 'Blog Post Not Found',
        description: 'This blog post is not available.',
        url: canonicalUrl,
        siteName: 'Hari Prasad Sanjel',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog Post Not Found',
        description: 'This blog post is not available.',
      },
    };
  } catch (error) {
    console.error('Metadata fetch error:', error);
  }
  
  // Generic fallback metadata
  return {
    title: 'Blog Post',
    description: 'Read this blog post',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Blog Post',
      description: 'Read this blog post',
      url: canonicalUrl,
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
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogDetailClient id={id} />;
}
