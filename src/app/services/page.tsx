import type { Metadata } from "next";
import Services from "./Services";
import HowWeWork from "../components/HowWeWork";

export const metadata: Metadata = {
	title: "Services",
	description:
		"UI/UX & product design, full-stack web development, and ongoing website maintenance & support — from responsive design to interactive applications built to perform.",
	alternates: {
		canonical: "/services",
	},
	openGraph: {
		title: "Our Services | SanjelTech",
		description: "UI/UX & product design, full-stack web development, and ongoing website maintenance & support.",
		url: "/services",
	},
};

export default function ServicesPage() {
	return (
		<>
			<Services standalone />
			<HowWeWork />
		</>
	);
}
