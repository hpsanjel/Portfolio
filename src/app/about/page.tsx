import type { Metadata } from "next";
import About from "./About";

export const metadata: Metadata = {
	title: "About Us",
	description:
		"SanjelTech is a one-person web and software development studio based in Oslo, Norway. Meet the developer behind full-stack, accessible applications built with React, Next.js, and modern cloud tooling.",
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: "About SanjelTech",
		description: "A one-person web and software development studio based in Oslo, Norway, built on hands-on full-stack experience.",
		url: "/about",
	},
};

export default function AboutPage() {
	return <About standalone />;
}
