import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const defaultDescription =
	"SanjelTech is a one-person web and software development studio based in Oslo, Norway, building fast, accessible full-stack applications with React, Next.js, and modern cloud tooling.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — Web and Software Development Lab`,
		template: `%s | ${SITE_NAME}`,
	},
	description: defaultDescription,
	keywords: ["web development", "software development", "full-stack developer", "Next.js developer", "React developer", "Oslo Norway web developer", "SanjelTech"],
	authors: [{ name: "Hari Prasad Sanjel", url: SITE_URL }],
	creator: "Hari Prasad Sanjel",
	publisher: SITE_NAME,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: SITE_URL,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} — Web and Software Development Lab`,
		description: defaultDescription,
		images: [
			{
				url: "/images/og-image.jpg",
				width: 1200,
				height: 630,
				alt: SITE_NAME,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${SITE_NAME} — Web and Software Development Lab`,
		description: defaultDescription,
		images: ["/images/og-image.jpg"],
		creator: "@hpsanjel",
	},
	icons: {
		icon: "/icon.png",
		apple: "/apple-icon.png",
	},
	manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fffdf8" },
		{ media: "(prefers-color-scheme: dark)", color: "#090a12" },
	],
	colorScheme: "dark light",
};

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	name: SITE_NAME,
	url: SITE_URL,
	logo: `${SITE_URL}/images/icon-512.png`,
	image: `${SITE_URL}/images/og-image.jpg`,
	description: defaultDescription,
	founder: {
		"@type": "Person",
		name: "Hari Prasad Sanjel",
	},
	address: {
		"@type": "PostalAddress",
		addressLocality: "Oslo",
		addressCountry: "NO",
	},
	sameAs: ["https://www.linkedin.com/in/hpsanjel/", "https://github.com/hpsanjel", "https://www.facebook.com/hpsanjel/"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden font-Outfit leading-6 dark:text-white`}>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
				<LayoutWrapper>{children}</LayoutWrapper>
				<Analytics />
			</body>
		</html>
	);
}
