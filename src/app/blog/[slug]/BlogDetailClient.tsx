"use client";
import { useEffect, useState } from "react";
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

interface BlogDetailClientProps {
  blog: Blog;
  relatedBlogs: Blog[];
}

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [blog.slug]);

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    if (!mounted) return dateString; // Return original string during SSR
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
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
                    &larr; Back to all blogs
                  </Link>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {blog.title}
                  </h1>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <span>By {blog.author}</span>
                    <span className="mx-2">&middot;</span>
                    <span>{formatDate(blog.date)}</span>
                  </div>

                  {/* Facebook Share Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        const shareUrl = currentUrl || `${window.location.origin}/blog/${blog.slug}`;
                        
                        // Simple and reliable Facebook sharer
                        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                        
                        window.open(
                          fbShareUrl,
                          'facebook-share',
                          'width=600,height=400,scrollbars=yes,resizable=yes'
                        );
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Share on Facebook
                    </button>
                  </div>
              </div>
              {/* Blog Header Image */}
              <div className="relative h-64 md:h-96">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover object-top"
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
            <div className="sticky top-36">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                More Blog Posts
              </h3>
              
              <div className="space-y-4">
                {relatedBlogs.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No more blog posts found.
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
                            {formatDate(relatedBlog.date)}
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
