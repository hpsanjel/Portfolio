"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import GradientButton from "../../components/GradientButton";

type Project = { id: number; title: string; description: string; image: string; liveUrl: string; codeUrl: string; technologies: string[]; slug: string };

export default function Projects() {
	const t = useTranslations("Projects");
	const pathname = usePathname();
	const isListingPage = pathname === "/projects";
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectsLoading, setProjectsLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		async function loadProjects() {
			try {
				const res = await fetch("/api/projects?status=published");
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

	const visibleProjects = projects.slice(0, isListingPage ? projects.length : 3);

	return (
		<section id="work" className="w-full px-[6%] lg:px-[12%] py-16">
			<SectionHeader as={isListingPage ? "h1" : "h2"} intro={t("intro")} title={t("title")} description={t("description")} />

			{projectsLoading ? (
				<div className="flex justify-center items-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
				</div>
			) : projects.length === 0 ? (
				<div className="text-center text-gray-600 dark:text-gray-300 py-20">{t("noProjects")}</div>
			) : (
				<>
					{/* Mobile / tablet: swipeable row of compact cards */}
					<div className={isListingPage ? "grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6 mt-6 max-w-7xl mx-auto" : "flex lg:hidden gap-6 mt-6 max-w-7xl mx-auto overflow-x-auto snap-x snap-mandatory -mx-[6%] px-[6%] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"}>
						{visibleProjects.map((project, index) => (
							<div key={`project-m-${project.id || index}-${project.title}`} className={`group relative bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#c17e0a]/15 hover:-translate-y-1 hover:border-[#eda40d]/40 transition-all duration-300 ${isListingPage ? "" : "shrink-0 w-[80%] sm:w-[55%] snap-center"}`}>
								<div className="relative w-full h-52 overflow-hidden">
									<Image src={project.image} alt={project.title} width={200} height={200} className="w-full h-full object-cover object-top-left group-hover:scale-110 transition-transform duration-700 ease-out" />
									<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
									<span className="absolute top-3 left-3 text-white text-xs font-bold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-widest">{String(index + 1).padStart(2, "0")}</span>
									<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-darkTheme/95 text-accent dark:text-[#c17e0a] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" aria-label={t("liveDemoOf", { title: project.title })}>
										{t("liveDemo")} <ArrowUpRight className="w-3.5 h-3.5" />
									</a>
								</div>
								<div className="relative p-3 md:p-6 overflow-hidden">
									<span className="pointer-events-none select-none absolute -top-3 right-4 text-6xl font-bold text-gray-900/4 dark:text-white/6">{String(index + 1).padStart(2, "0")}</span>
									<Link href={`/projects/${project.slug}`}>
										<h3 className="relative text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-[#c17e0a] transition-colors duration-300 cursor-pointer line-clamp-2 sm:line-clamp-1">{project.title}</h3>
									</Link>
									<p className="relative text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-4 md:line-clamp-none">{project.description}</p>
									<div className="hidden relative md:flex flex-wrap gap-2 mb-4">
										{project.technologies.map((tech, t) => (
											<span key={`${tech}-${t}`} className="text-xs px-2 py-1 rounded-full bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 text-accent dark:text-[#c17e0a] border border-[#eda40d]/20">
												{tech}
											</span>
										))}
									</div>
									<Link href={`/projects/${project.slug}`} className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-accent dark:text-[#c17e0a] group/link">
										{t("viewProject")}
										<ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
									</Link>
								</div>
							</div>
						))}
					</div>

					{/* Desktop: alternating full-bleed showcase rows */}
					<div className="hidden lg:flex lg:flex-col gap-16 max-w-6xl mx-auto mt-12">
						{visibleProjects.map((project, index) => {
							const isEven = index % 2 === 0;
							return (
								<div key={`project-d-${project.id || index}-${project.title}`} className={`group relative flex ${isEven ? "flex-row" : "flex-row-reverse"} min-h-105 rounded-3xl overflow-hidden bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-[#c17e0a]/15 transition-all duration-500`}>
									{/* Image */}
									<div className="relative w-1/2 overflow-hidden">
										<Image src={project.image} alt={project.title} width={400} height={400} className="absolute inset-0 w-full h-full object-cover object-top-left group-hover:scale-110 transition-transform duration-700 ease-out" style={{ clipPath: isEven ? "polygon(0 0, 100% 0, 88% 100%, 0 100%)" : "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }} />
										<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: isEven ? "polygon(0 0, 100% 0, 88% 100%, 0 100%)" : "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" }}></div>
									</div>

									{/* Content */}
									<div className={`relative w-1/2 flex flex-col justify-center p-12 xl:p-16 overflow-hidden ${isEven ? "" : "items-end text-right"}`}>
										<span className={`pointer-events-none select-none absolute top-0 text-[10rem] leading-none font-bold text-gray-900/4 dark:text-white/6 ${isEven ? "-right-4" : "-left-4"}`}>{String(index + 1).padStart(2, "0")}</span>
										<span className="relative text-xs font-bold tracking-[0.2em] text-accent dark:text-[#c17e0a] uppercase mb-3">{t("featuredProject")}</span>
										<Link href={`/projects/${project.slug}`}>
											<h3 className="relative text-3xl xl:text-4xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-[#c17e0a] transition-colors duration-300 cursor-pointer">{project.title}</h3>
										</Link>
										<p className="relative text-base text-gray-700 dark:text-gray-300 mb-6 max-w-md leading-relaxed">{project.description}</p>
										<div className={`relative flex flex-wrap gap-2 mb-8 ${isEven ? "" : "justify-end"}`}>
											{project.technologies.map((tech, t) => (
												<span key={`${tech}-${t}`} className="text-xs px-3 py-1.5 rounded-full bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 text-accent dark:text-[#c17e0a] border border-[#eda40d]/20">
													{tech}
												</span>
											))}
										</div>
										<div className={`relative flex flex-wrap items-center gap-4 ${isEven ? "" : "justify-end"}`}>
											<Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 bg-linear-to-r from-[#eda40d] to-[#c17e0a] px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 w-max group/link">
												{t("viewProject")}
												<ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
											</Link>
											<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 px-6 py-3 rounded-full hover:border-accent dark:hover:border-[#eda40d] hover:text-accent dark:hover:text-[#c17e0a] transition-all duration-300 w-max group/link" aria-label={t("liveDemoOf", { title: project.title })}>
												{t("liveDemo")}
												<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
											</a>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}

			{!isListingPage && projects.length > 3 && (
				<div className="text-center mt-8">
					<GradientButton text={t("viewAllProjects")} href="/projects" className="w-max mx-auto mt-8" />
				</div>
			)}
		</section>
	);
}
