"use client";
import { useEffect, useState } from "react";

import BlogArchive from "../../components/BlogArchive";
import Comments from "../../components/Comments";
import Image from "next/image";
import Link from "next/link";

// Utility functions
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 150;
  const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  const wordCount = plainText.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  date: string;
  slug: string;
  author: string;
  categories: string[];
  tags: string[];
  link?: string;
}

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchBlogData() {
      try {
        setLoading(true);
        
        // Fetch current blog
        const blogRes = await fetch(`/api/blogs/by-slug/${slug}`);
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          // Check if blog is published
          if (blogData.status === 'draft') {
            setBlog(null); // Don't show draft blogs
          } else {
            setBlog(blogData);
          }
        }

        // Fetch all published blogs for sidebar
        const allBlogsRes = await fetch("/api/blogs?status=published");
        if (allBlogsRes.ok) {
          const allBlogs = await allBlogsRes.json();
          const currentBlog = await blogRes.json();
          
          // Get related posts based on categories and tags
          const relatedPosts = allBlogs
            .filter((b: Blog) => b.slug !== slug)
            .map((post: Blog) => {
              let score = 0;
              
              // Category matches (higher weight)
              if (currentBlog.categories && post.categories) {
                const commonCategories = currentBlog.categories.filter((cat: string) => 
                  post.categories.includes(cat)
                );
                score += commonCategories.length * 3;
              }
              
              // Tag matches (lower weight)
              if (currentBlog.tags && post.tags) {
                const commonTags = currentBlog.tags.filter((tag: string) => 
                  post.tags.includes(tag)
                );
                score += commonTags.length;
              }
              
              return { ...post, score };
            })
            .sort((a: any, b: any) => b.score - a.score)
            .slice(0, 3)
            .map(({ score, ...post }: any) => post);
          
          setRelatedBlogs(relatedPosts);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, [slug]);

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    if (!mounted) return dateString; // Return original string during SSR
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-6">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : !blog ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
              <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                &larr; Back to blogs
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 md:p-8">
                    <Link 
                      href="/blog" 
                      className="text-yellow-600 hover:text-blue-400 text-sm font-medium mb-4 inline-block"
                    >
                      &larr; Back to all blogs
                    </Link>
                    
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {blog.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-400 md:mb-6">
                      <span className="font-semibold">By <a href="https://www.facebook.com/hpsanjel" className="text-gray-700 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400">{blog.author}</a></span>
                      <span className="mx-2">&middot;</span>
                      <span>{formatDate(blog.date)}</span>
                      <span className="mx-2">&middot;</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {calculateReadingTime(blog.content)} min read
                      </span>
                      {/* {blog.categories && blog.categories.length > 0 && (
                        <>
                          <span className="mx-2">&middot;</span>
                          <div className="flex flex-wrap gap-1">
                            {blog.categories.map((category, index) => (
                              <span key={index} className="hidden md:inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                                {category}
                              </span>
                            ))}
                          </div>
                        </>
                      )} */}
                    </div>

                    {/* Social Sharing Buttons */}
                    <div className="my-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          const shareUrl = currentUrl || `${window.location.origin}/blog/${blog.slug}`;
                          const shareText = `Check out this blog post: "${blog.title}" by ${blog.author}`;
                          const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                          window.open(fbShareUrl, 'facebook-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      
                      <button
                        onClick={() => {
                          const shareUrl = currentUrl || `${window.location.origin}/blog/${blog.slug}`;
                          const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out: "${blog.title}" by ${blog.author}`)}`;
                          window.open(twitterUrl, 'twitter-share', 'width=600,height=400,scrollbars=yes,resizable=yes');
                        }}
                        className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </button>
                      
                      <button
                        onClick={() => {
                          const shareUrl = currentUrl || `${window.location.origin}/blog/${blog.slug}`;
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            alert('Link copied to clipboard!');
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </button>
                    </div>
                </div>
                {/* Blog Header Image */}
                <div className="relative h-64 md:h-96 md:mx-8">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="px-4 sm:px-0 object-cover object-top"
                  />
                </div>
                
                {/* Blog Content */}
                <div className="p-4 md:p-8">
                  <div className="hidden md:block mb-4">
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
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
                  
                  <div className="max-w-none">
                    <div 
                      className="blog-content-wrapper leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{ 
                        __html: blog.content.replace(/\n/g, '<br />')
                      }}
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
              {/* Comments Section */}
              <Comments blogSlug={slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-36">
           
                
                

                
                {/* Blog Archive */}
                <BlogArchive />
                
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
        )}
      </div>
    </div>
  );
}
