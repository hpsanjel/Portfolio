"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "../../components/SectionHeader";
import ContactForm from "../../components/ContactForm";
import { CalendarDays, Mail, Phone } from "lucide-react";

export default function Contact({ standalone = false }: { standalone?: boolean } = {}) {
	const t = useTranslations("Contact");
	return (
		<section id="contact" className="w-full px-[12%] py-16">
			<SectionHeader as={standalone ? "h1" : "h2"} intro={t("intro")} title={t("title")} description={t("description")} />

			<div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-center justify-center mt-10">
				<a href="tel:+4746344530" className="flex items-center gap-2 text-md mr-4 hover:text-accent dark:hover:text-yellow-400 transition-colors duration-300">
					<Phone className="w-5 h-5 text-accent dark:text-yellow-400" aria-hidden="true" /> +47 46344530
				</a>
				<a href="mailto:harisanjel@gmail.com" className="flex items-center gap-2 text-md hover:text-accent dark:hover:text-yellow-400 transition-colors duration-300">
					<Mail className="w-5 h-5 text-accent dark:text-yellow-400" aria-hidden="true" /> harisanjel@gmail.com
				</a>
			</div>

			<div className="flex justify-center mt-8">
				<Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 dark:border-white/15 font-semibold text-gray-800 dark:text-white hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-300">
					<CalendarDays className=" w-5 h-5" aria-hidden="true" />
					{t("bookLiveMeeting")}
				</Link>
			</div>

			<ContactForm className="max-w-2xl mx-auto mt-10" />
		</section>
	);
}
