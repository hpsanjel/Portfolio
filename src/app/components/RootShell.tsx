import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	name: SITE_NAME,
	url: SITE_URL,
	logo: `${SITE_URL}/images/icon-512.png`,
	image: `${SITE_URL}/images/og-image.jpg`,
	description:
		"SanjelTech is a one-person web and software development studio based in Oslo, Norway, building fast, accessible full-stack applications with React, Next.js, and modern cloud tooling.",
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

/**
 * Shared <html>/<body> shell used by every top-level root layout ([locale], admin,
 * admin-login). Next.js requires the root-most layout in each branch of the tree to
 * define <html>/<body> itself when there's no single shared app/layout.tsx above them
 * (the "multiple root layouts" pattern), so this factors out what would otherwise be
 * duplicated across those three layouts.
 */
export default function RootShell({ lang, children }: { lang: string; children: React.ReactNode }) {
	return (
		<html lang={lang} className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden font-Outfit leading-6 dark:text-white`}>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
				{children}
				<Analytics />
			</body>
		</html>
	);
}
