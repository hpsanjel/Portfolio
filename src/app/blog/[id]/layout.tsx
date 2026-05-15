import Link from "next/link";
import BlogArchive from "../../components/BlogArchive";

export default function BlogDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {children}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-36">
              <BlogArchive />
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
