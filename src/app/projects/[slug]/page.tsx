"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  codeUrl: string;
  technologies: string[];
  slug: string;
  story?: string;
  challenges?: string;
  learnings?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchProjectData() {
      try {
        // Fetch current project using query parameter
        const projectRes = await fetch(`/api/projects/by-slug?slug=${encodeURIComponent(slug)}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        }

        // Fetch all projects for sidebar
        const allProjectsRes = await fetch("/api/projects");
        if (allProjectsRes.ok) {
          const allProjects = await allProjectsRes.json();
          const filtered = allProjects.filter((p: Project) => p.slug !== slug);
          setRelatedProjects(filtered.slice(0, 5)); // Show max 5 related projects
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link href="/projects" className="text-blue-600 hover:text-blue-800">
            ← Back to projects
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
                    href="/projects" 
                    className="text-yellow-600 hover:text-blue-400 text-sm font-medium mb-4 inline-block"
                  >
                    ← Back to all projects
                  </Link>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {project.title}
                  </h1>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
              </div>
              
              {/* Project Header Image */}
              <div className="relative h-64 md:h-96">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Project Content */}
              <div className="p-8">
                {/* Project Story */}
                {project.story && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Project Story
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.story.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  </div>
                )}

                {/* Challenges */}
                {project.challenges && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Challenges & Solutions
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.challenges.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  </div>
                )}

                {/* Learnings */}
                {project.learnings && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      What I Learned
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-700 dark:text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.learnings.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Project Links */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Live Demo
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Source Code
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Related Projects
              </h3>
              
              <div className="space-y-4">
                {relatedProjects.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No related projects found.
                  </p>
                ) : (
                  relatedProjects.map((relatedProject) => (
                    <Link
                      key={relatedProject.slug}
                      href={`/projects/${relatedProject.slug}`}
                      className="group block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="flex">
                        {/* Project Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={relatedProject.image}
                            alt={relatedProject.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Project Info */}
                        <div className="p-3 flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 line-clamp-2 mb-1">
                            {relatedProject.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {relatedProject.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(relatedProject.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              
              {/* Back to all projects */}
              <div className="mt-8">
                <Link
                  href="/projects"
                  className="block w-full text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
