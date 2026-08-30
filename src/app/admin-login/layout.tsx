import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin Login",
	description: "Sign in to the SanjelTech admin panel.",
	robots: {
		index: false,
		follow: false,
		nocache: true,
	},
};

export default function AdminLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return children;
}
