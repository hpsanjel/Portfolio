"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Blogs() {
        const [blogs, setBlogs] = useState<Array<{ id: number; title: string; excerpt?: string; content?: string; image: string; link?: string }>>([]);
        const [blogsLoading, setBlogsLoading] = useState(true);
    
        useEffect(() => {
            let cancelled = false;
            async function loadBlogs() {
                try {
                    const res = await fetch("/api/blogs");
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
    return (
        <section id="blog" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Outfit">Blogs</h4>
            <h2 className="text-center text-5xl font-Outfit">Thoughts and Insights</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Outfit">Dive into my blog where I share my thoughts on web development, design trends, and the tech industry. Whether you're a fellow developer or just curious, there's something here for everyone interested in the world of web technology.</p>
            <div className="grid grid-cols-1 sm:grid-cols-auto gap-6">
                {blogsLoading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 dark:text-gray-300">No blogs published yet.</div>
                ) : (
                    blogs.map((blog, index) => (
                        <div key={`blog-${blog.id || index}-${blog.title}`} className="blog-container max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href={blog.link || "#"} target={blog.link ? "_blank" : undefined}>
                                <Image className="rounded-t-lg w-full h-56 object-cover" src={blog.image} alt={blog.title} width={500} height={500} />
                            </Link>
                            <div className="p-5">
                                <Link href={blog.link || "#"} target={blog.link ? "_blank" : undefined}>
                                    <h5 className="mb-2 text-2xl font-semi-bold tracking-tight text-gray-900 dark:text-white blog-title">{blog.title}</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{blog.excerpt || blog.content || ""}</p>
                                {blog.link && (
                                    <Link href={blog.link} target="_blank" className="read-more-link inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black/80 hover:text-black rounded-lg focus:ring-4 focus:outline-none dark:text-white/80 dark:hover:text-white">
                                        Read more
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform duration-300 hover:translate-x-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

