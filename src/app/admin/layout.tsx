import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin",
	description: "Admin Panel for Portfolio Management",
	robots: {
		index: false,
		follow: false,
		nocache: true,
	},
};

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{children}
		</div>
	);
}
