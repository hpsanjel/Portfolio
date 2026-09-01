"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";

type FAQItem = { _id: string; question: string; answer: string; order: number };

export default function FAQ() {
	const t = useTranslations("Faq");
	const locale = useLocale();
	const [faqs, setFaqs] = useState<FAQItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	useEffect(() => {
		let cancelled = false;
		async function loadFaqs() {
			try {
				const res = await fetch(`/api/faqs?locale=${locale}`);
				const data = await res.json();
				if (!cancelled) setFaqs(Array.isArray(data) ? data : []);
			} catch {
				if (!cancelled) setFaqs([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadFaqs();
		return () => {
			cancelled = true;
		};
	}, [locale]);

	if (!loading && faqs.length === 0) return null;

	return (
		<section id="faq" className="w-full px-[6%] lg:px-[12%] py-16">
			<SectionHeader intro={t("intro")} title={t("title")} description={t("description")} />

			<div className="max-w-3xl mx-auto mt-6 space-y-3">
				{loading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
					</div>
				) : (
					faqs.map((faq, index) => {
						const isOpen = openIndex === index;
						return (
							<div key={faq._id} className="bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl overflow-hidden">
								<h3>
									<button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${faq._id}`} id={`faq-question-${faq._id}`} className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left">
										<span className={`font-medium text-sm md:text-md ${isOpen ? "text-accent dark:text-[#c17e0a]" : "text-gray-900 dark:text-white"}`}>{faq.question}</span>
										<ChevronDown className={`w-5 h-5 shrink-0 text-accent dark:text-[#c17e0a] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
									</button>
								</h3>
								<div id={`faq-answer-${faq._id}`} role="region" aria-labelledby={`faq-question-${faq._id}`} className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
									<div className="overflow-hidden">
										<p className="px-5 pb-4 sm:px-6 sm:pb-5 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</section>
	);
}
