import type { Metadata, Viewport } from "next";
import { baseMetadata, baseViewport } from "@/lib/seo";
import RootShell from "../components/RootShell";

export const metadata: Metadata = {
	...baseMetadata,
	title: "Admin Login",
	description: "Sign in to the SanjelTech admin panel.",
	robots: {
		index: false,
		follow: false,
		nocache: true,
	},
};

export const viewport: Viewport = baseViewport;

export default function AdminLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <RootShell lang="en">{children}</RootShell>;
}
