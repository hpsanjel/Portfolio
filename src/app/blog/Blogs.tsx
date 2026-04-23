"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import SectionHeader from "../components/SectionHeader";
import GradientButton from "../components/GradientButton";
import BlogArchive from "../components/BlogArchive";
import { BLOG_CATEGORIES } from "../../lib/blogCategories";

// Function to strip HTML tags
const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

function BlogsContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isListingPage = pathname === "/blog";
    const [blogs, setBlogs] = useState<Array<{ id: number; title: string; excerpt?: string; content?: string; image: string; link?: string; slug?: string; categories?: string[]; tags?: string[]; date: string }>>([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    
    // Get URL parameters for year/month filtering
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    
    // Validate month parameter and redirect if invalid
    useEffect(() => {
        if (monthParam) {
            const month = parseInt(monthParam);
            if (isNaN(month) || month < 1 || month > 12) {
                // Redirect to month=12 (December) if invalid month entered
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('month', '12');
                window.location.replace(newUrl.toString());
            }
        }
    }, [monthParam]);
    
        useEffect(() => {
            let cancelled = false;
            async function loadBlogs() {
                try {
                    const res = await fetch("/api/blogs?status=published");
                    const data = await res.json();
                    if (!cancelled) setBlogs(Array.isArray(data) ? data : []);
                } catch {
                    if (!cancelled) setBlogs([]);
                } finally {
                    if (!cancelled) setBlogsLoading(false);
                }
            }
            loadBlogs();
            return () => {
                cancelled = true;
            };
        }, []);

    // Get available categories with blog counts for better UX
    const categoryCounts = blogs.reduce((acc, blog) => {
        if (blog.categories) {
            blog.categories.forEach(category => {
                acc[category] = (acc[category] || 0) + 1;
            });
        }
        return acc;
    }, {} as Record<string, number>);
    
    // Only show categories that have blogs, sorted by count (descending)
    const availableCategories = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([category]) => category);
    
    const allCategories = ["all", ...availableCategories];
    
    // Filter blogs based on search, category, and URL parameters
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = searchQuery === "" || 
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (blog.content && stripHtml(blog.content).toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === "all" || 
            (blog.categories && blog.categories.includes(selectedCategory));
        
        // Year/month filtering from URL parameters
        let matchesYearMonth = true;
        if (yearParam || monthParam) {
            const blogDate = new Date(blog.date);
            const blogYear = blogDate.getFullYear().toString();
            const blogMonth = (blogDate.getMonth() + 1).toString(); // Convert 0-11 to 1-12
            
            matchesYearMonth = (!yearParam || blogYear === yearParam) &&
                              (!monthParam || blogMonth === monthParam);
        }
        
        return matchesSearch && matchesCategory && matchesYearMonth;
    });

    return (
        <section id="blog" className="w-full px-[5%] md:px-[8%] py-10 scroll-mt-32">
            <SectionHeader 
                intro="Blogs"
                title={yearParam || monthParam ? "Archived Blogs" : "Thoughts and Insights"}
                description={
                    yearParam || monthParam 
                        ? `Blogs from ${monthParam ? new Date(0, parseInt(monthParam) - 1).toLocaleDateString('en-US', { month: 'long' }) : ''} ${yearParam || ''}`.trim()
                        : "Dive into my blog where I share my thoughts on web development, design trends, and the tech industry. Whether you're a fellow developer or just curious, there's something here for everyone interested in the world of web technology."
                }
            />
            
            {/* Search and Filter Section */}
            {isListingPage && (
                <div className="my-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    {/* Reset Filter Button for Date Filtering */}
                    {(yearParam || monthParam) && (
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing blogs from {(monthParam ? new Date(0, parseInt(monthParam) - 1).toLocaleDateString('en-US', { month: 'long' }) : '') + ' ' + (yearParam || '')}
                                {/* Showing blogs from {(monthParam ? new Date(0, parseInt(monthParam) - 1).toLocaleDateString('en-US', { month: 'long' }) : '') + ' ' + (yearParam || '')}.trim() */}
                            </div>
                            <Link
                                href="/blog"
                                className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors"
                            >
                                × Reset Date Filter
                            </Link>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search blogs by title or content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        {/* Category Pills - Horizontal Scroll */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            {allCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {category === "all" 
                                        ? "All" 
                                        : `${category} (${categoryCounts[category] || 0})`
                                    }
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Active filters display */}
                    {(searchQuery || selectedCategory !== "all") && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {searchQuery && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    Search: {searchQuery}
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== "all" && (
                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    Category: {selectedCategory}
                                    <button
                                        onClick={() => setSelectedCategory("all")}
                                        className="ml-2 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <div className="mt-6 sm:mt-0">
                {/* Mobile Horizontal Scrolling Layout */}
                <div className="md:hidden">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 snap-x snap-mandatory">
                        {blogsLoading ? (
                            <div className="flex justify-center items-center w-full py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="flex justify-center items-center w-full py-12 text-gray-600 dark:text-gray-300">
                                {searchQuery || selectedCategory !== "all" || yearParam || monthParam
                                    ? (
                                        <div className="space-y-4 text-center">
                                            <p>
                                                {`No blogs found${yearParam || monthParam ? ' for the selected time period' : ' matching your filters'}.`}
                                            </p>
                                            <Link
                                                href="/blog"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Show All Blogs
                                            </Link>
                                        </div>
                                    ) 
                                    : "No blogs published yet."}
                            </div>
                        ) : (
                            filteredBlogs.slice(0, isListingPage ? filteredBlogs.length : 3).map((blog, index) => (
                                <div key={`blog-${blog.id || index}-${blog.title}`} className="flex-shrink-0 w-80 blog-container bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 group hover:shadow-lg hover:scale-105 transition-all duration-300 snap-start">
                                    <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined}>
                                        <Image className="rounded-t-lg w-full h-48 object-cover object-top group-hover:brightness-110 transition-all duration-300" src={blog.image} alt={blog.title} width={500} height={500} />
                                    </Link>
                                    <div className="p-5">
                                        {/* Categories */}
                                        {blog.categories && blog.categories.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {blog.categories.slice(0, 2).map((category, catIndex) => (
                                                    <span key={catIndex} className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined}>
                                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                {blog.title}
                                            </h5>
                                        </Link>
                                        
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                                            {blog.excerpt || stripHtml(blog.content || '')}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-200">
                                                Read more
                                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {blog.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Scroll indicator for mobile */}
                    {filteredBlogs.length > 1 && !blogsLoading && filteredBlogs.length !== 0 && (
                        <div className="flex justify-center mt-2">
                            <div className="flex gap-1">
                                {filteredBlogs.slice(0, isListingPage ? Math.min(filteredBlogs.length, 5) : 3).map((_, index) => (
                                    <div key={index} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogsLoading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
                        {searchQuery || selectedCategory !== "all" || yearParam || monthParam
                            ? (
                                <div className="space-y-4">
                                    <p>
                                        {`No blogs found${yearParam || monthParam ? ' for the selected time period' : ' matching your filters'}.`}
                                    </p>
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Show All Blogs
                                    </Link>
                                </div>
                            ) 
                            : "No blogs published yet."}
                    </div>
                ) : (
                    filteredBlogs.slice(0, isListingPage ? filteredBlogs.length : 3).map((blog, index) => (
                        <div key={`blog-${blog.id || index}-${blog.title}`} className="blog-container max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 group hover:shadow-lg hover:scale-105 transition-all duration-300">
                            <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined}>
                                <Image className="rounded-t-lg w-full h-56 object-cover object-top group-hover:brightness-110 transition-all duration-300" src={blog.image} alt={blog.title} width={500} height={500} />
                            </Link>
                            <div className="p-5">
                                {/* Categories */}
                                {blog.categories && blog.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {blog.categories.slice(0, 2).map((category, catIndex) => (
                                            <span key={catIndex} className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                                                {category}
                                            </span>
                                        ))}
                                        {blog.categories.length > 2 && (
                                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                                                +{blog.categories.length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined}>
                                    <h5 className="mb-2 text-2xl font-semi-bold tracking-tight text-gray-900 dark:text-white blog-title group-hover:text-yellow-600 dark:group-hover:text-yellow-600 transition-colors duration-300">{blog.title}</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">{blog.excerpt || (blog.content ? stripHtml(blog.content).substring(0, 150) + '...' : "")}</p>
                                <Link href={blog.slug ? `/blog/${blog.slug}` : (blog.link || "#")} target={blog.link && !blog.slug ? "_blank" : undefined} className="read-more-link inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black/80 hover:text-black rounded-lg focus:ring-4 focus:outline-none dark:text-white/80 dark:hover:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-600 transition-colors duration-300" aria-label={`Read more about ${blog.title}`}>
                                    Read more
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
                </div>
            </div>
            
            {/* Sidebar for listing page */}
            {/* {isListingPage && (
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <BlogArchive />
                    </div>
                </div>
            )} */}
            
			{!isListingPage && blogs.length > 3 && (
				<GradientButton 
					text="View All Blogs" 
					href="/blog" 
					className="w-max mx-auto mt-8"
				/>
			)}
        </section>
    );
}

export default function Blogs() {
    return (
        <Suspense fallback={<div>Loading blogs...</div>}>
            <BlogsContent />
        </Suspense>
    );
}

