import type { Metadata } from "next";
import Projects from "./Projects";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"A portfolio of full-stack web applications and software projects built by SanjelTech — e-commerce, dashboards, and custom tools built with React, Next.js, and modern cloud tooling.",
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: "Our Recent Works | SanjelTech",
		description: "A portfolio of full-stack web applications and software projects built with React, Next.js, and modern cloud tooling.",
		url: "/projects",
	},
};

export default function WorkPage() {
	return <Projects />;
}
