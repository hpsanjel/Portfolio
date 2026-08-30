import type { Metadata } from "next";
import Contact from "./Contact";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Get in touch with SanjelTech to discuss your next web or software project. Reach out by phone, email, or the contact form for a free project quote.",
	alternates: {
		canonical: "/contact",
	},
	openGraph: {
		title: "Get in Touch | SanjelTech",
		description: "Get in touch to discuss your next web or software project and receive a free quote.",
		url: "/contact",
	},
};

export default function ContactPage() {
	return <Contact standalone />;
}
