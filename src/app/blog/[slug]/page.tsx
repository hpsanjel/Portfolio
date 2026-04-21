import { Metadata } from "next";
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
  
  // For now, return generic metadata to avoid server-side fetch issues
  // In production, you could implement a direct database connection here
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
