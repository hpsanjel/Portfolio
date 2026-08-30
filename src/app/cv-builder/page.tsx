import type { Metadata } from "next";
import CvBuilderForm from "./CvBuilderForm";

export const metadata: Metadata = {
	title: "Free CV Builder — Build & Download Your Resume",
	description: "Build your own CV or resume for free and download it as a PDF. Nothing you enter is saved to any server.",
	alternates: {
		canonical: "/cv-builder",
	},
	openGraph: {
		title: "Free CV Builder | SanjelTech",
		description: "Build your own CV or resume for free and download it as a PDF — nothing is ever saved to a server.",
		url: "/cv-builder",
	},
};

export default function CvBuilderPage() {
	return <CvBuilderForm />;
}
