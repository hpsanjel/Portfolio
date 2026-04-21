import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Hari Prasad Sanjel",
	description: "Full Stack Web Developer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden font-Outfit leading-6 dark:bg-darkTheme dark:text-white bg-[url('/images/page-bg.png')] bg-cover`}>
				<LayoutWrapper>{children}</LayoutWrapper>
				<Analytics />
			</body>
		</html>
	);
}
