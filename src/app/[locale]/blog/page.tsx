import type { Metadata } from "next";
import Blogs from "./Blogs";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Thoughts and insights on web development, design trends, and the tech industry from SanjelTech — practical, hands-on articles for developers and curious readers alike.",
	alternates: {
		canonical: "/blog",
	},
	openGraph: {
		title: "Thoughts and Insights | SanjelTech Blog",
		description: "Thoughts and insights on web development, design trends, and the tech industry.",
		url: "/blog",
		type: "website",
	},
};

export default function BlogPage() {
	return <Blogs />;
}
