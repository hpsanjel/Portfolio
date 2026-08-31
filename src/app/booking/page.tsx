import type { Metadata } from "next";
import SectionHeader from "../components/SectionHeader";
import BookingWidget from "./BookingWidget";

export const metadata: Metadata = {
	title: "Book a Meeting",
	description: "Pick a date and time that works for you and book a free introductory call to discuss your project.",
	alternates: {
		canonical: "/booking",
	},
	openGraph: {
		title: "Book a Meeting | SanjelTech",
		description: "Pick a date and time that works for you and book a free introductory call to discuss your project.",
		url: "/booking",
	},
};

export default function BookingPage() {
	return (
		<section className="w-full px-[6%] lg:px-[12%] py-16">
			<SectionHeader as="h1" intro="Let's Talk" title="Book a Meeting" description="Pick a date and time that works for you. Choose an open slot below and I'll send a confirmation right away." />
			<div className="mt-10">
				<BookingWidget />
			</div>
		</section>
	);
}
