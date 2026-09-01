import type { Metadata, Viewport } from "next";
import { baseMetadata, baseViewport } from "@/lib/seo";
import RootShell from "../components/RootShell";

export const metadata: Metadata = {
	...baseMetadata,
	title: "Admin",
	description: "Admin Panel for Portfolio Management",
	robots: {
		index: false,
		follow: false,
		nocache: true,
	},
};

export const viewport: Viewport = baseViewport;

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<RootShell lang="en">
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				{children}
			</main>
		</RootShell>
	);
}
