import type { Metadata } from "next";
import Pricing from "./Pricing";

export const metadata: Metadata = {
	title: "Pricing",
	description: "Transparent starting prices for landing pages, business websites, and full-stack web apps or e-commerce builds. Get a custom quote for your project.",
	alternates: {
		canonical: "/pricing",
	},
	openGraph: {
		title: "Pricing | SanjelTech",
		description: "Transparent starting prices for landing pages, business websites, and full-stack web apps or e-commerce builds.",
		url: "/pricing",
	},
};

export default function PricingPage() {
	return <Pricing standalone />;
}
