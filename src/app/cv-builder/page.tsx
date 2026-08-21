import type { Metadata } from "next";
import CvBuilderForm from "./CvBuilderForm";

export const metadata: Metadata = {
	title: "CV Builder | Build & Download Your Resume",
	description: "Build your own CV or resume for free and download it as a PDF. Nothing you enter is saved to any server.",
};

export default function CvBuilderPage() {
	return <CvBuilderForm />;
}
