"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import GradientButton from "../components/GradientButton";
import useLocalStorageState from "../hooks/useLocalStorageState";
import DynamicListSection from "./DynamicListSection";
import {
	type CvBuilderData,
	emptyCvBuilderData,
	emptyCvBuilderCompetency,
	emptyCvBuilderExperience,
	emptyCvBuilderEducation,
	emptyCvBuilderCertification,
	emptyCvBuilderLanguage,
	emptyCvBuilderReference,
	emptyCvBuilderProject,
} from "@/types/cvBuilder";

const inputClass =
	"w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90";
const labelClass = "block text-sm font-medium mb-1";

export default function CvBuilderForm() {
	const { state: draft, setState: setDraft, clear, hydrated } = useLocalStorageState<CvBuilderData>("cv-builder-draft", emptyCvBuilderData);
	const [isGenerating, setIsGenerating] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");

	useEffect(() => {
		if (statusMessage) {
			const timer = setTimeout(() => setStatusMessage(""), 4000);
			return () => clearTimeout(timer);
		}
	}, [statusMessage]);

	const updateHeader = (patch: Partial<CvBuilderData["header"]>) => {
		setDraft((prev) => ({ ...prev, header: { ...prev.header, ...patch } }));
	};

	const handleStartOver = () => {
		if (window.confirm("This will clear everything you've entered. Are you sure?")) {
			clear();
			setStatusMessage("Form cleared.");
		}
	};

	const handleDownload = async () => {
		setIsGenerating(true);
		setStatusMessage("");
		try {
			const { pdf } = await import("@react-pdf/renderer");
			const { default: CvBuilderDocument } = await import("./CvBuilderDocument");
			const blob = await pdf(<CvBuilderDocument data={draft} />).toBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${draft.header.name?.trim() || "resume"}-CV.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			setStatusMessage("PDF downloaded successfully!");
		} catch (error) {
			setStatusMessage("Failed to generate PDF, please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	if (!hydrated) {
		return <div className="text-center py-12 text-gray-400">Loading...</div>;
	}

	return (
		<section className="w-full px-[6%] md:px-[12%] py-10">
			<SectionHeader
				intro="Free Tool — Nothing Is Saved to Any Server"
				title="Build Your CV / Resume"
				description="Fill in your details below and download a clean, ready-to-print PDF resume. Everything stays in your browser — your data is never sent anywhere or stored in a database. Refresh freely; your draft is kept locally until you clear it."
			/>

			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<section className="mb-10">
					<h3 className="text-lg font-semibold mb-4">Personal Details</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Full Name</label>
							<input className={inputClass} value={draft.header.name} onChange={(e) => updateHeader({ name: e.target.value })} placeholder="Jane Doe" />
						</div>
						<div>
							<label className={labelClass}>Professional Title</label>
							<input className={inputClass} value={draft.header.title} onChange={(e) => updateHeader({ title: e.target.value })} placeholder="Frontend Developer" />
						</div>
						<div className="md:col-span-2">
							<label className={labelClass}>Address</label>
							<input className={inputClass} value={draft.header.address} onChange={(e) => updateHeader({ address: e.target.value })} placeholder="City, Country" />
						</div>
						<div>
							<label className={labelClass}>Phone</label>
							<input className={inputClass} value={draft.header.phone} onChange={(e) => updateHeader({ phone: e.target.value })} />
						</div>
						<div>
							<label className={labelClass}>Email</label>
							<input className={inputClass} value={draft.header.email} onChange={(e) => updateHeader({ email: e.target.value })} />
						</div>
						<div>
							<label className={labelClass}>LinkedIn URL</label>
							<input className={inputClass} value={draft.header.linkedin} onChange={(e) => updateHeader({ linkedin: e.target.value })} />
						</div>
						<div>
							<label className={labelClass}>GitHub URL</label>
							<input className={inputClass} value={draft.header.github} onChange={(e) => updateHeader({ github: e.target.value })} />
						</div>
						<div>
							<label className={labelClass}>Portfolio URL</label>
							<input className={inputClass} value={draft.header.portfolio} onChange={(e) => updateHeader({ portfolio: e.target.value })} />
						</div>
					</div>
				</section>

				{/* Summary */}
				<section className="mb-10">
					<h3 className="text-lg font-semibold mb-4">Summary</h3>
					<textarea
						rows={4}
						className={inputClass}
						value={draft.summary}
						onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
						placeholder="A short summary about your professional background and goals."
					/>
				</section>

				{/* Competencies */}
				<DynamicListSection
					title="Key Competencies"
					items={draft.competencies}
					emptyItem={emptyCvBuilderCompetency}
					addLabel="Add Competency"
					onChange={(items) => setDraft((prev) => ({ ...prev, competencies: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Category (e.g. Frontend)" value={item.category} onChange={(e) => update({ category: e.target.value })} />
							<input className={inputClass} placeholder="Skills (e.g. React, TypeScript)" value={item.skills} onChange={(e) => update({ skills: e.target.value })} />
						</div>
					)}
				/>

				{/* Experience */}
				<DynamicListSection
					title="Professional Experience"
					items={draft.experience}
					emptyItem={emptyCvBuilderExperience}
					addLabel="Add Experience"
					onChange={(items) => setDraft((prev) => ({ ...prev, experience: items }))}
					renderRow={(item, _i, update) => (
						<div className="space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<input className={inputClass} placeholder="Job Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
								<input className={inputClass} placeholder="Company" value={item.company} onChange={(e) => update({ company: e.target.value })} />
								<input className={inputClass} placeholder="Location" value={item.location} onChange={(e) => update({ location: e.target.value })} />
								<input className={inputClass} placeholder="Date (e.g. 2021 - Present)" value={item.date} onChange={(e) => update({ date: e.target.value })} />
							</div>
							<textarea
								rows={3}
								className={inputClass}
								placeholder="Responsibilities (one per line)"
								value={item.responsibilities.join("\n")}
								onChange={(e) => update({ responsibilities: e.target.value.split("\n") })}
							/>
						</div>
					)}
				/>

				{/* Projects */}
				<DynamicListSection
					title="Selected Projects"
					items={draft.projects}
					emptyItem={emptyCvBuilderProject}
					addLabel="Add Project"
					onChange={(items) => setDraft((prev) => ({ ...prev, projects: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
							<input className={inputClass} placeholder="Tech Stack" value={item.tech} onChange={(e) => update({ tech: e.target.value })} />
							<input className={`${inputClass} md:col-span-2`} placeholder="Description" value={item.description} onChange={(e) => update({ description: e.target.value })} />
							<input className={inputClass} placeholder="GitHub URL" value={item.github} onChange={(e) => update({ github: e.target.value })} />
							<input className={inputClass} placeholder="Live Preview URL" value={item.preview} onChange={(e) => update({ preview: e.target.value })} />
						</div>
					)}
				/>

				{/* Education */}
				<DynamicListSection
					title="Education"
					items={draft.education}
					emptyItem={emptyCvBuilderEducation}
					addLabel="Add Education"
					onChange={(items) => setDraft((prev) => ({ ...prev, education: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Degree" value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
							<input className={inputClass} placeholder="Institution" value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
							<input className={inputClass} placeholder="Date" value={item.date} onChange={(e) => update({ date: e.target.value })} />
							<input className={inputClass} placeholder="Details (optional)" value={item.details} onChange={(e) => update({ details: e.target.value })} />
						</div>
					)}
				/>

				{/* Certifications */}
				<DynamicListSection
					title="Certifications"
					items={draft.certifications}
					emptyItem={emptyCvBuilderCertification}
					addLabel="Add Certification"
					onChange={(items) => setDraft((prev) => ({ ...prev, certifications: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
							<input className={inputClass} placeholder="Issuer" value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} />
							<input className={inputClass} placeholder="Date" value={item.date} onChange={(e) => update({ date: e.target.value })} />
						</div>
					)}
				/>

				{/* Languages */}
				<DynamicListSection
					title="Languages"
					items={draft.languages}
					emptyItem={emptyCvBuilderLanguage}
					addLabel="Add Language"
					onChange={(items) => setDraft((prev) => ({ ...prev, languages: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Language" value={item.language} onChange={(e) => update({ language: e.target.value })} />
							<input className={inputClass} placeholder="Level (e.g. Fluent)" value={item.level} onChange={(e) => update({ level: e.target.value })} />
						</div>
					)}
				/>

				{/* References */}
				<DynamicListSection
					title="References"
					items={draft.references}
					emptyItem={emptyCvBuilderReference}
					addLabel="Add Reference"
					onChange={(items) => setDraft((prev) => ({ ...prev, references: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
							<input className={inputClass} placeholder="Position" value={item.position} onChange={(e) => update({ position: e.target.value })} />
							<input className={inputClass} placeholder="Company" value={item.company} onChange={(e) => update({ company: e.target.value })} />
							<input className={inputClass} placeholder="Location" value={item.location} onChange={(e) => update({ location: e.target.value })} />
							<input className={inputClass} placeholder="Phone" value={item.phone} onChange={(e) => update({ phone: e.target.value })} />
							<input className={inputClass} placeholder="Email" value={item.email} onChange={(e) => update({ email: e.target.value })} />
						</div>
					)}
				/>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
					<GradientButton text={isGenerating ? "Generating..." : "Download PDF"} type="button" disabled={isGenerating} onClick={handleDownload} showArrow={false} />
					<button
						type="button"
						onClick={handleStartOver}
						className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
					>
						<RotateCcw className="w-4 h-4" /> Start Over
					</button>
				</div>

				{statusMessage && (
					<div
						className={`max-w-md mx-auto text-center my-4 p-3 rounded-md ${
							statusMessage.toLowerCase().includes("fail")
								? "bg-red-100 text-red-700 border border-red-400"
								: "bg-green-100 text-green-700 border border-green-400"
						}`}
					>
						{statusMessage}
					</div>
				)}
			</div>
		</section>
	);
}
