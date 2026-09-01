"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import GradientButton from "../../components/GradientButton";
import useLocalStorageState from "../../hooks/useLocalStorageState";
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
	const t = useTranslations("CvBuilder");
	const locale = useLocale();
	const { state: draft, setState: setDraft, clear, hydrated } = useLocalStorageState<CvBuilderData>("cv-builder-draft", emptyCvBuilderData);
	const [isGenerating, setIsGenerating] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");
	const [statusIsError, setStatusIsError] = useState(false);

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
		if (window.confirm(t("confirmClear"))) {
			clear();
			setStatusIsError(false);
			setStatusMessage(t("formCleared"));
		}
	};

	const handleDownload = async () => {
		setIsGenerating(true);
		setStatusMessage("");
		try {
			const { pdf } = await import("@react-pdf/renderer");
			const { default: CvBuilderDocument } = await import("./CvBuilderDocument");
			const blob = await pdf(<CvBuilderDocument data={draft} locale={locale === "nb" ? "nb" : "en"} />).toBlob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${draft.header.name?.trim() || "resume"}-CV.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			setStatusIsError(false);
			setStatusMessage(t("pdfDownloaded"));
		} catch (error) {
			setStatusIsError(true);
			setStatusMessage(t("pdfFailed"));
		} finally {
			setIsGenerating(false);
		}
	};

	if (!hydrated) {
		return <div className="text-center py-12 text-gray-400">{t("loading")}</div>;
	}

	return (
		<section className="w-full px-[6%] md:px-[12%] py-10">
			<SectionHeader
				as="h1"
				intro={t("intro")}
				title={t("title")}
				description={t("description")}
			/>

			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<section className="mb-10">
					<h2 className="text-lg font-semibold mb-4">{t("personalDetails")}</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>
								{t("fullName")}
								<input className={inputClass} value={draft.header.name} onChange={(e) => updateHeader({ name: e.target.value })} placeholder={t("fullNamePlaceholder")} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("professionalTitle")}
								<input className={inputClass} value={draft.header.title} onChange={(e) => updateHeader({ title: e.target.value })} placeholder={t("professionalTitlePlaceholder")} />
							</label>
						</div>
						<div className="md:col-span-2">
							<label className={labelClass}>
								{t("address")}
								<input className={inputClass} value={draft.header.address} onChange={(e) => updateHeader({ address: e.target.value })} placeholder={t("addressPlaceholder")} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("phone")}
								<input className={inputClass} value={draft.header.phone} onChange={(e) => updateHeader({ phone: e.target.value })} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("email")}
								<input className={inputClass} value={draft.header.email} onChange={(e) => updateHeader({ email: e.target.value })} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("linkedinUrl")}
								<input className={inputClass} value={draft.header.linkedin} onChange={(e) => updateHeader({ linkedin: e.target.value })} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("githubUrl")}
								<input className={inputClass} value={draft.header.github} onChange={(e) => updateHeader({ github: e.target.value })} />
							</label>
						</div>
						<div>
							<label className={labelClass}>
								{t("portfolioUrl")}
								<input className={inputClass} value={draft.header.portfolio} onChange={(e) => updateHeader({ portfolio: e.target.value })} />
							</label>
						</div>
					</div>
				</section>

				{/* Summary */}
				<section className="mb-10">
					<h2 className="text-lg font-semibold mb-4">{t("summary")}</h2>
					<label className={labelClass}>
						{t("summary")}
						<textarea
							rows={4}
							className={inputClass}
							value={draft.summary}
							onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
							placeholder={t("summaryPlaceholder")}
						/>
					</label>
				</section>

				{/* Competencies */}
				<DynamicListSection
					title={t("keyCompetencies")}
					items={draft.competencies}
					emptyItem={emptyCvBuilderCompetency}
					addLabel={t("addCompetency")}
					onChange={(items) => setDraft((prev) => ({ ...prev, competencies: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("categoryPlaceholder")} value={item.category} onChange={(e) => update({ category: e.target.value })} />
							<input className={inputClass} placeholder={t("skillsPlaceholder")} value={item.skills} onChange={(e) => update({ skills: e.target.value })} />
						</div>
					)}
				/>

				{/* Experience */}
				<DynamicListSection
					title={t("professionalExperience")}
					items={draft.experience}
					emptyItem={emptyCvBuilderExperience}
					addLabel={t("addExperience")}
					onChange={(items) => setDraft((prev) => ({ ...prev, experience: items }))}
					renderRow={(item, _i, update) => (
						<div className="space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<input className={inputClass} placeholder={t("jobTitle")} value={item.title} onChange={(e) => update({ title: e.target.value })} />
								<input className={inputClass} placeholder={t("company")} value={item.company} onChange={(e) => update({ company: e.target.value })} />
								<input className={inputClass} placeholder={t("location")} value={item.location} onChange={(e) => update({ location: e.target.value })} />
								<input className={inputClass} placeholder={t("experienceDatePlaceholder")} value={item.date} onChange={(e) => update({ date: e.target.value })} />
							</div>
							<textarea
								rows={3}
								className={inputClass}
								placeholder={t("responsibilitiesPlaceholder")}
								value={item.responsibilities.join("\n")}
								onChange={(e) => update({ responsibilities: e.target.value.split("\n") })}
							/>
						</div>
					)}
				/>

				{/* Projects */}
				<DynamicListSection
					title={t("selectedProjects")}
					items={draft.projects}
					emptyItem={emptyCvBuilderProject}
					addLabel={t("addProject")}
					onChange={(items) => setDraft((prev) => ({ ...prev, projects: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("titleField")} value={item.title} onChange={(e) => update({ title: e.target.value })} />
							<input className={inputClass} placeholder={t("techStack")} value={item.tech} onChange={(e) => update({ tech: e.target.value })} />
							<input className={`${inputClass} md:col-span-2`} placeholder={t("descriptionField")} value={item.description} onChange={(e) => update({ description: e.target.value })} />
							<input className={inputClass} placeholder={t("githubUrl")} value={item.github} onChange={(e) => update({ github: e.target.value })} />
							<input className={inputClass} placeholder={t("livePreviewUrl")} value={item.preview} onChange={(e) => update({ preview: e.target.value })} />
						</div>
					)}
				/>

				{/* Education */}
				<DynamicListSection
					title={t("education")}
					items={draft.education}
					emptyItem={emptyCvBuilderEducation}
					addLabel={t("addEducation")}
					onChange={(items) => setDraft((prev) => ({ ...prev, education: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("degree")} value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
							<input className={inputClass} placeholder={t("institution")} value={item.institution} onChange={(e) => update({ institution: e.target.value })} />
							<input className={inputClass} placeholder={t("dateField")} value={item.date} onChange={(e) => update({ date: e.target.value })} />
							<input className={inputClass} placeholder={t("detailsOptional")} value={item.details} onChange={(e) => update({ details: e.target.value })} />
						</div>
					)}
				/>

				{/* Certifications */}
				<DynamicListSection
					title={t("certifications")}
					items={draft.certifications}
					emptyItem={emptyCvBuilderCertification}
					addLabel={t("addCertification")}
					onChange={(items) => setDraft((prev) => ({ ...prev, certifications: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("titleField")} value={item.title} onChange={(e) => update({ title: e.target.value })} />
							<input className={inputClass} placeholder={t("issuer")} value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} />
							<input className={inputClass} placeholder={t("dateField")} value={item.date} onChange={(e) => update({ date: e.target.value })} />
						</div>
					)}
				/>

				{/* Languages */}
				<DynamicListSection
					title={t("languages")}
					items={draft.languages}
					emptyItem={emptyCvBuilderLanguage}
					addLabel={t("addLanguage")}
					onChange={(items) => setDraft((prev) => ({ ...prev, languages: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("language")} value={item.language} onChange={(e) => update({ language: e.target.value })} />
							<input className={inputClass} placeholder={t("levelPlaceholder")} value={item.level} onChange={(e) => update({ level: e.target.value })} />
						</div>
					)}
				/>

				{/* References */}
				<DynamicListSection
					title={t("references")}
					items={draft.references}
					emptyItem={emptyCvBuilderReference}
					addLabel={t("addReference")}
					onChange={(items) => setDraft((prev) => ({ ...prev, references: items }))}
					renderRow={(item, _i, update) => (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className={inputClass} placeholder={t("name")} value={item.name} onChange={(e) => update({ name: e.target.value })} />
							<input className={inputClass} placeholder={t("position")} value={item.position} onChange={(e) => update({ position: e.target.value })} />
							<input className={inputClass} placeholder={t("company")} value={item.company} onChange={(e) => update({ company: e.target.value })} />
							<input className={inputClass} placeholder={t("location")} value={item.location} onChange={(e) => update({ location: e.target.value })} />
							<input className={inputClass} placeholder={t("phone")} value={item.phone} onChange={(e) => update({ phone: e.target.value })} />
							<input className={inputClass} placeholder={t("email")} value={item.email} onChange={(e) => update({ email: e.target.value })} />
						</div>
					)}
				/>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
					<GradientButton text={isGenerating ? t("generating") : t("downloadPdf")} type="button" disabled={isGenerating} onClick={handleDownload} showArrow={false} />
					<button
						type="button"
						onClick={handleStartOver}
						className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
					>
						<RotateCcw className="w-4 h-4" /> {t("startOver")}
					</button>
				</div>

				{statusMessage && (
					<div
						className={`max-w-md mx-auto text-center my-4 p-3 rounded-md ${
							statusIsError
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
