"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Testimonial = { _id: string; name: string; role: string; quote: string; rating: number; avatar?: string };

function Avatar({ testimonial, className }: { testimonial: Testimonial; className: string }) {
	if (testimonial.avatar) {
		return <Image src={testimonial.avatar} alt={testimonial.name} width={64} height={64} className={`${className} object-cover shrink-0`} />;
	}
	return (
		<div aria-hidden="true" className={`${className} shrink-0 bg-linear-to-r from-[#eda40d] to-[#c17e0a] flex items-center justify-center text-gray-900 font-semibold`}>
			{testimonial.name
				.split(" ")
				.map((n) => n[0])
				.join("")}
		</div>
	);
}

function StarRating({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
	const t = useTranslations("Testimonials");
	return (
		<div className="flex gap-1" role="img" aria-label={t("ratedOutOf", { rating })}>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star key={i} aria-hidden="true" className={`${className} ${i < rating ? "fill-accent text-accent dark:fill-[#eda40d] dark:text-[#eda40d]" : "text-gray-300 dark:text-gray-600"}`} />
			))}
		</div>
	);
}

function TestimonialSpotlight({ testimonials }: { testimonials: Testimonial[] }) {
	const t = useTranslations("Testimonials");
	const [index, setIndex] = useState(0);
	const [pausedByUser, setPausedByUser] = useState(false);
	const [pausedByVisibility, setPausedByVisibility] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const paused = pausedByUser || pausedByVisibility;
	const canAutoplay = testimonials.length > 1 && !reducedMotion;

	useEffect(() => {
		setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
		const onVisibility = () => setPausedByVisibility(document.hidden);
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	const goTo = (i: number) => setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);
	const current = testimonials[index];

	return (
		<div role="region" aria-roledescription="carousel" aria-label={t("clientTestimonials")}>
			{testimonials.length > 1 && (
				<div role="tablist" aria-label={t("chooseTestimonial")} className="flex gap-1.5 mb-5">
					{testimonials.map((item, i) => (
						<button key={item._id} type="button" role="tab" aria-selected={i === index} aria-label={t("testimonialTabLabel", { name: item.name, index: i + 1, total: testimonials.length })} onClick={() => goTo(i)} className="relative flex-1 h-1 rounded-full bg-gray-900/10 dark:bg-white/15 overflow-hidden cursor-pointer">
							{i < index && <span className="absolute inset-0 bg-accent dark:bg-[#eda40d]" />}
							{i === index && (canAutoplay ? <span key={index} onAnimationEnd={() => goTo(index + 1)} className="absolute inset-0 origin-left bg-accent dark:bg-[#eda40d] animate-story-progress" style={{ animationPlayState: paused ? "paused" : "running" }} /> : <span className="absolute inset-0 bg-accent dark:bg-[#eda40d]" />)}
						</button>
					))}
				</div>
			)}

			<div onPointerDown={() => setPausedByUser(true)} onPointerUp={() => setPausedByUser(false)} onPointerLeave={() => setPausedByUser(false)} className="relative rounded-3xl bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 shadow-sm p-8 pt-10 overflow-hidden">
				<div className="absolute -top-12 -right-12 w-40 h-40 bg-[#eda40d]/20 dark:bg-[#eda40d]/25 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />
				<div className="absolute -bottom-16 -left-12 w-40 h-40 bg-[#c17e0a]/10 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

				<div key={index} className="relative flex flex-col items-center text-center animate-spotlight-in" aria-live="polite">
					<Quote className="w-9 h-9 text-[#eda40d]/40 dark:text-[#eda40d]/50 mb-3" strokeWidth={1.5} aria-hidden="true" />
					<p className="text-md leading-relaxed text-gray-800 dark:text-gray-100 mb-6">&ldquo;{current.quote}&rdquo;</p>
					<Avatar testimonial={current} className="w-14 h-14 rounded-full text-base mb-3" />
					<div className="font-semibold text-gray-900 dark:text-white">{current.name}</div>
					<div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{current.role}</div>
					<StarRating rating={current.rating} />
				</div>
			</div>

			{testimonials.length > 1 && (
				<div className="flex items-center justify-center gap-3 mt-5">
					<button type="button" onClick={() => goTo(index - 1)} aria-label={t("previousTestimonial")} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200">
						<ChevronLeft className="w-5 h-5" />
					</button>
					<button type="button" onClick={() => goTo(index + 1)} aria-label={t("nextTestimonial")} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200">
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			)}
		</div>
	);
}

export default function Testimonials() {
	const t = useTranslations("Testimonials");
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function loadTestimonials() {
			try {
				const res = await fetch("/api/testimonials");
				const data = await res.json();
				if (!cancelled) setTestimonials(Array.isArray(data) ? data : []);
			} catch {
				if (!cancelled) setTestimonials([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadTestimonials();
		return () => {
			cancelled = true;
		};
	}, []);

	if (!loading && testimonials.length === 0) return null;

	return (
		<section id="testimonials" className="w-full px-[6%] lg:px-[12%] py-16">
			<SectionHeader intro={t("intro")} title={t("title")} description={t("description")} />

			{loading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
				</div>
			) : (
				<>
					{/* Mobile / tablet: Stories-style auto-advancing spotlight */}
					<div className="lg:hidden max-w-md mx-auto mt-6">
						<TestimonialSpotlight testimonials={testimonials} />
					</div>

					{/* Desktop: grid */}
					<div className="hidden lg:grid grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
						{testimonials.map((testimonial) => (
							<div key={testimonial._id} className="relative bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
								<Quote className="absolute -top-2 -right-2 w-20 h-20 text-gray-900/4 dark:text-white/6" strokeWidth={1} aria-hidden="true" />
								<div className="relative mb-3">
									<StarRating rating={testimonial.rating} />
								</div>
								<p className="relative text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
								<div className="relative flex items-center gap-3">
									<Avatar testimonial={testimonial} className="w-10 h-10 rounded-full text-sm" />
									<div>
										<div className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</section>
	);
}
