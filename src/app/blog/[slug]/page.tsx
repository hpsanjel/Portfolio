"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchBlogData() {
      try {
        // Fetch current blog
        const blogRes = await fetch(`/api/blogs/by-slug/${slug}`);
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlog(blogData);
        }

        // Fetch all blogs for sidebar
        const allBlogsRes = await fetch("/api/blogs");
        if (allBlogsRes.ok) {
          const allBlogs = await allBlogsRes.json();
          const filtered = allBlogs.filter((b: Blog) => b.slug !== slug);
          setRelatedBlogs(filtered.slice(0, 5)); // Show max 5 related blogs
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                  <Link 
                    href="/blog" 
                    className="text-yellow-600 hover:text-blue-400 text-sm font-medium mb-4 inline-block"
                  >
                    ← Back to all blogs
                  </Link>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {blog.title}
                  </h1>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <span>By {blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
              </div>
              {/* Blog Header Image */}
              <div className="relative h-64 md:h-96">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Blog Content */}
              <div className="p-8">
                <div className="mb-6">
                
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    className="text-gray-700 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />').replace(/style="[^"]*color\s*:\s*rgb\([^)]*\)[^"]*"/gi, '').replace(/style="[^"]*color\s*:\s*#[^"^;]*[^"]*"/gi, '') }}
                  />
                </div>
                
                {/* External link if exists */}
                {blog.link && blog.link !== '#' && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      This post was originally published on an external platform:
                    </p>
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Read original post
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Related Posts
              </h3>
              
              <div className="space-y-4">
                {relatedBlogs.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No related posts found.
                  </p>
                ) : (
                  relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.slug}
                      href={`/blog/${relatedBlog.slug}`}
                      className="group block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="flex">
                        {/* Blog Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Blog Info */}
                        <div className="p-3 flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {relatedBlog.excerpt || relatedBlog.content?.substring(0, 100) + '...' || ''}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(relatedBlog.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              
              {/* Back to all blogs */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="block w-full text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  View All Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
