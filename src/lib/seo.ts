import type { Metadata, Viewport } from "next";

export const SITE_NAME = "SanjelTech";
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_AUTH_BASE_URL || "https://www.sanjeltech.com";

export const SITE_DESCRIPTIONS: Record<"en" | "nb", string> = {
	en: "SanjelTech is a one-person web and software development studio based in Oslo, Norway, building fast, accessible full-stack applications with React, Next.js, and modern cloud tooling.",
	nb: "SanjelTech er et enkeltpersonforetak innen web- og programvareutvikling basert i Oslo, Norge, som bygger raske, tilgjengelige helstack-applikasjoner med React, Next.js og moderne skyverktøy.",
};

/**
 * Builds the `alternates.languages` map for a given unprefixed pathname (e.g. "/about"),
 * pointing "en" at the unprefixed URL and "nb-NO" at the /nb-prefixed URL, matching the
 * "as-needed" locale-prefix routing strategy (src/i18n/routing.ts).
 */
export function buildAlternates(pathname: string) {
	const cleanPath = pathname === "/" ? "" : pathname;
	return {
		canonical: `${SITE_URL}${cleanPath}`,
		languages: {
			en: `${SITE_URL}${cleanPath}`,
			"nb-NO": `${SITE_URL}/nb${cleanPath}`,
		},
	};
}

/**
 * Open Graph consumers (Facebook, LinkedIn) are strict about image content-type
 * matching the file extension. Cloudinary URLs may end in a format-negotiated
 * extension that doesn't match the actual bytes, so force a .jpg extension for
 * Cloudinary-hosted images used as OG/Twitter images.
 */
/**
 * Icons/manifest/viewport shared across every top-level root layout ([locale], admin,
 * admin-login) now that they each define their own <html>/<body> root (see RootShell).
 */
export const baseMetadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	icons: {
		icon: "/icon.png",
		apple: "/apple-icon.png",
	},
	manifest: "/manifest.webmanifest",
};

export const baseViewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fffdf8" },
		{ media: "(prefers-color-scheme: dark)", color: "#090a12" },
	],
	colorScheme: "dark light",
};

export function getJpgOpenGraphImageUrl(imageUrl: string): string {
	if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
		return imageUrl;
	}
	return imageUrl.replace(/\.[a-zA-Z0-9]+(?:\?.*)?$/, ".jpg");
}
