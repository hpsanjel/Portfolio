import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTIONS, baseMetadata, baseViewport, buildAlternates } from "@/lib/seo";
import RootShell from "../components/RootShell";
import LayoutWrapper from "../components/LayoutWrapper";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const description = SITE_DESCRIPTIONS[locale as "en" | "nb"] ?? SITE_DESCRIPTIONS.en;
	const title = `${SITE_NAME} — Web and Software Development Lab`;

	return {
		...baseMetadata,
		title: {
			default: title,
			template: `%s | ${SITE_NAME}`,
		},
		description,
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
		alternates: buildAlternates("/"),
		openGraph: {
			type: "website",
			locale: locale === "nb" ? "nb_NO" : "en_US",
			url: SITE_URL,
			siteName: SITE_NAME,
			title,
			description,
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
			title,
			description,
			images: ["/images/og-image.jpg"],
			creator: "@hpsanjel",
		},
	};
}

export const viewport: Viewport = baseViewport;

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<RootShell lang={locale}>
			<NextIntlClientProvider>
				<LayoutWrapper>{children}</LayoutWrapper>
			</NextIntlClientProvider>
		</RootShell>
	);
}
