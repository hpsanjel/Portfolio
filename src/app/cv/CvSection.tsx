"use client";

import React, { useEffect, useState } from "react";

export default function CvSection() {
	const [cv, setCv] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCV();
	}, []);

	async function fetchCV() {
		setLoading(true);
		try {
			const res = await fetch("/api/cv");
			if (!res.ok) return setLoading(false);
			const data = await res.json();
			setCv(data);
		} catch {
			setCv(null);
		}
		setLoading(false);
	}

	if (loading) return <div className="text-center py-12 text-gray-400">Loading CV...</div>;
	if (!cv) return <div className="text-center py-12 text-red-400">CV not found.</div>;

	return (
		<>
	
			<main className="min-h-screen pt-10 pb-16 px-4 sm:px-6">
				<div className="max-w-5xl mx-auto">
					<div className="rounded-3xl shadow-2xl ring-1 ring-black/5 bg-white print:shadow-none print:ring-0">
						{/* Header */}
						<header className="relative overflow-hidden rounded-t-3xl border-b">
							<div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50" />
							<div className="relative px-8 sm:px-12 py-10 sm:py-12">
								<div className="flex flex-col gap-4">
									<div>
										<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">{cv.header?.name}</h1>
										<div className="text-lg sm:text-xl text-indigo-700 mt-1">{cv.header?.title}</div>
									</div>
									<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
										<span>{cv.header?.address}</span>
										{cv.header?.phone && (
											<a href={`tel:${cv.header?.phone}`} className="hover:text-indigo-700">
												{cv.header?.phone}
											</a>
										)}
										{cv.header?.email && (
											<a href={`mailto:${cv.header?.email}`} className="hover:text-indigo-700">
												{cv.header?.email}
											</a>
										)}
										{cv.header?.linkedin && (
											<a href={cv.header.linkedin} target="_blank" className="hover:text-indigo-700">
												LinkedIn
											</a>
										)}
										{cv.header?.github && (
											<a href={cv.header.github} target="_blank" className="hover:text-indigo-700">
												GitHub
											</a>
										)}
										{cv.header?.portfolio && (
											<a href={cv.header.portfolio} target="_blank" className="hover:text-indigo-700">
												Portfolio
											</a>
										)}
									</div>
								</div>
							</div>
						</header>

						<div className="px-8 sm:px-12 py-10 space-y-10">
							{/* Summary */}
							{cv.summary && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-3">Summary</h2>
									<p className="text-slate-700 leading-relaxed">{cv.summary}</p>
								</section>
							)}

							{/* Competencies */}
							{cv.competencies && cv.competencies.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Key Competencies</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{cv.competencies.map((c: any, i: number) => (
											<div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
												<div className="text-sm font-semibold text-slate-800">{c.category}</div>
												<div className="text-sm text-slate-600 mt-1">{c.skills}</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Experience */}
							{cv.experience && cv.experience.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Professional Experience</h2>
									<div className="space-y-6">
										{cv.experience.map((exp: any, i: number) => (
											<div key={i} className="pl-4 border-l-2 border-indigo-200">
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
													<div>
														<div className="text-base font-semibold text-slate-900">{exp.title}</div>
														<div className="text-sm text-slate-600">
															{exp.company}, {exp.location}
														</div>
													</div>
													<div className="text-xs text-slate-500">{exp.date}</div>
												</div>
												<ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
													{exp.responsibilities.map((r: string, idx: number) => (
														<li key={idx}>{r}</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Projects */}
							{cv.projects && cv.projects.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Selected Projects</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{cv.projects.map((proj: any, i: number) => (
											<div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
												<div className="text-base font-semibold text-slate-900">{proj.title}</div>
												{proj.tech && <div className="text-xs text-indigo-700 mt-1">{proj.tech}</div>}
												{proj.description && <p className="text-sm text-slate-600 mt-2">{proj.description}</p>}
												<div className="flex gap-4 text-xs mt-3">
													{proj.github && (
														<a href={proj.github} target="_blank" className="text-indigo-700 hover:underline">
															GitHub
														</a>
													)}
													{proj.preview && (
														<a href={proj.preview} target="_blank" className="text-indigo-700 hover:underline">
															Live Preview
														</a>
													)}
												</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Education */}
							{cv.education && cv.education.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Education</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{cv.education.map((edu: any, i: number) => (
											<div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
												<div className="text-sm font-semibold text-slate-900">{edu.degree}</div>
												<div className="text-sm text-slate-600">{edu.institution}</div>
												<div className="text-xs text-slate-500 mt-1">{edu.date}</div>
												{edu.details && <div className="text-xs text-slate-600 mt-2">{edu.details}</div>}
											</div>
										))}
									</div>
								</section>
							)}

							{/* Certifications */}
							{cv.certifications && cv.certifications.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Certifications</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{cv.certifications.map((cert: any, i: number) => (
											<div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
												<div className="text-sm font-semibold text-slate-900">{cert.title}</div>
												<div className="text-sm text-slate-600">
													{cert.issuer}, {cert.date}
												</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Languages */}
							{cv.languages && cv.languages.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Languages</h2>
									<div className="flex flex-wrap gap-4">
										{cv.languages.map((lang: any, i: number) => (
											<div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-w-36">
												<div className="text-sm font-semibold text-slate-900">{lang.language}</div>
												<div className="text-sm text-slate-600">{lang.level}</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* References */}
							{cv.references && cv.references.length > 0 && (
								<section>
									<h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">References</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{cv.references.map((ref: any, i: number) => (
											<div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
												<div className="text-sm font-semibold text-slate-900">{ref.name}</div>
												<div className="text-sm text-slate-600">
													{ref.position}, {ref.company}
												</div>
												{ref.location && <div className="text-xs text-slate-500 mt-1">{ref.location}</div>}
												{ref.phone && <div className="text-xs text-slate-500">{ref.phone}</div>}
												{ref.email && <div className="text-xs text-slate-500">{ref.email}</div>}
											</div>
										))}
									</div>
								</section>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
