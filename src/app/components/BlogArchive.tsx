"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface ArchiveItem {
  year: number;
  months: {
    month: string;
    count: number;
    monthIndex: number;
  }[];
}

interface Blog {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image: string;
  date: string;
}

interface BlogArchiveProps {
  className?: string;
}

// Function to strip HTML tags
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

let cachedLocale: string | null = null;
let cachedArchives: ArchiveItem[] | null = null;
let cachedRecentBlogs: Blog[] | null = null;

export default function BlogArchive({ className = "" }: BlogArchiveProps) {
  const t = useTranslations("BlogArchive");
  const locale = useLocale();
  const isCacheValid = cachedLocale === locale;
  const [archives, setArchives] = useState<ArchiveItem[]>(isCacheValid ? cachedArchives || [] : []);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>(isCacheValid ? cachedRecentBlogs || [] : []);
  const [loading, setLoading] = useState(!isCacheValid || !cachedArchives || !cachedRecentBlogs);

  useEffect(() => {
    if (isCacheValid && cachedArchives && cachedRecentBlogs) {
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        // Fetch archives
        const archivesRes = await fetch(`/api/blogs/archives?locale=${locale}`);
        if (archivesRes.ok) {
          const archivesData = await archivesRes.json();
          cachedLocale = locale;
          cachedArchives = archivesData;
          if (!cancelled) setArchives(archivesData);
        }

        // Fetch recent blogs
        const blogsRes = await fetch(`/api/blogs?status=published&locale=${locale}`);
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          // Sort by date ascending (oldest first) and take 10
          const sortedBlogs = Array.isArray(blogsData) 
            ? blogsData.sort((a: Blog, b: Blog) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
            : [];
          cachedRecentBlogs = sortedBlogs;
          if (!cancelled) setRecentBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [locale, isCacheValid]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t("blogArchive")}</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Recent Blogs Section */}
          {recentBlogs.length > 0 && (
            <div className="mb-6 h-[600px] overflow-y-auto">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{t("recentPosts")}</h4>
              <div className="space-y-3">
                {recentBlogs.map((blog, index) => (
                  <div key={blog._id || index} className="group">
                    <Link 
                      href={`/blog/${blog._id}`}
                      className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {/* Blog Image */}
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      
                      {/* Blog Content */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 mb-1">
                          {blog.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {blog.excerpt || stripHtml(blog.content || '').substring(0, 80) + '...'}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(blog.date).toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Divider */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {t("showingRecentPosts")}
                </p>
              </div>
            </div>
          )}
          
          {/* Traditional Archive Section */}
          {archives.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("noArchivedPosts")}</p>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("browseByDate")}</h4>
              {archives.map((archive) => (
                <div key={archive.year} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
                  <button
                    className="flex items-center justify-between w-full text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => {
                      const element = document.getElementById(`archive-${archive.year}`);
                      if (element) {
                        element.classList.toggle('hidden');
                      }
                    }}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {archive.year}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("postsCount", { count: archive.months.reduce((sum, month) => sum + month.count, 0) })}
                    </span>
                  </button>
                  
                  <div id={`archive-${archive.year}`} className="hidden mt-2 space-y-1">
                    {archive.months.map((month) => (
                      <Link
                        key={`${archive.year}-${month.monthIndex}`}
                        href={`/blog?year=${archive.year}&month=${month.monthIndex + 1}`}
                        className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                      >
                        <span>{month.month}</span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {month.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
