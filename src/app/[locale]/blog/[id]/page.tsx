import { Metadata } from "next";
import { cache } from "react";
import BlogDetailClient from "./BlogDetailClient"
import connectDB from "@/lib/mongoose";
import { Blog as BlogModel } from "@/models";
import { SITE_URL, SITE_NAME, getJpgOpenGraphImageUrl } from "@/lib/seo";

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

// Deduped between generateMetadata and the page body — one DB round-trip per request.
const getBlog = cache(async (id: string) => {
  await connectDB();
  return BlogModel.findById(id).lean();
});

// Generate metadata for the blog page
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = SITE_URL;
  const canonicalUrl = `${baseUrl}/blog/${id}`;


  try {
    const blog = await getBlog(id);

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
          siteName: 'SanjelTech',
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
      robots: { index: false, follow: false },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: 'Blog Post Not Found',
        description: 'This blog post is not available.',
        url: canonicalUrl,
        siteName: 'SanjelTech',
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
      siteName: 'SanjelTech',
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
  const canonicalUrl = `${SITE_URL}/blog/${id}`;

  let articleJsonLd: Record<string, unknown> | null = null;
  try {
    const blog = await getBlog(id);
    if (blog && blog.status !== 'draft') {
      const ogImageUrl = getJpgOpenGraphImageUrl(blog.image);
      articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : undefined),
        image: [ogImageUrl],
        datePublished: blog.date,
        dateModified: blog.updatedAt || blog.date,
        author: {
          "@type": "Person",
          name: blog.author || "Hari Prasad Sanjel",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/icon-512.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      };
    }
  } catch (error) {
    console.error('Blog JSON-LD fetch error:', error);
  }

  return (
    <>
      {articleJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />}
      <BlogDetailClient id={id} />
    </>
  );
}
