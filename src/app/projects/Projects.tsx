"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeader from "../components/SectionHeader";
import GradientButton from "../components/GradientButton";

export default function Projects() {
    const [projects, setProjects] = useState<Array<{ id: number; title: string; description: string; image: string; liveUrl: string; codeUrl: string; technologies: string[] }>>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
        useEffect(() => {
            let cancelled = false;
            async function loadProjects() {
                try {
                    const res = await fetch("/api/projects");
                    const data = await res.json();
                    if (!cancelled) setProjects(Array.isArray(data) ? data : []);
                } catch {
                    if (!cancelled) setProjects([]);
                } finally {
                    if (!cancelled) setProjectsLoading(false);
                }
            }
            loadProjects();
            return () => {
                cancelled = true;
            };
        }, []);
    return (
     
			<section id="work" className="w-full px-[12%] py-10 scroll-mt-20">
				<SectionHeader 
					intro="Portfolio"
					title="My Recent Works"
					description="Take a look at some of the projects I've had the pleasure of working on. My portfolio showcases a diverse range of web applications and designs that highlight my skills, creativity, and attention to detail."
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{projectsLoading ? (
						<div className="col-span-full flex justify-center items-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
						</div>
					) : projects.length === 0 ? (
						<div className="col-span-full text-center text-gray-600 dark:text-gray-300">No projects added yet.</div>
					) : (
						projects.map((project, index) => (
							<div key={`project-${project.id || index}-${project.title}`} className="group bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
								<div className="relative w-full h-52 overflow-hidden">
									<img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
								</div>
								<div className="p-6">
									<h3 className="text-xl font-semibold mb-2">{project.title}</h3>
									<p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{project.technologies.map((tech, t) => (
											<span key={`${tech}-${t}`} className="text-xs px-2 py-1 rounded-full bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 text-[#c17e0a] border border-[#eda40d]/20">
												{tech}
											</span>
										))}
									</div>
									<div className="flex items-center gap-4 text-sm">
										<a href={project.liveUrl} target="_blank" className="text-[#c17e0a] hover:underline">
											Live Demo
										</a>
										<a href={project.codeUrl} target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline">
											Source Code
										</a>
									</div>
								</div>
							</div>
						))
					)}
				</div>
				<GradientButton 
					text="View More Projects" 
					href="https://github.com/hpsanjel" 
					target="_blank"
					className="w-max mx-auto my-20"
				/>
			</section>
    );
}