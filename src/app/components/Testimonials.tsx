"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Testimonial = { _id: string; name: string; role: string; quote: string; rating: number; avatar?: string };

export default function Testimonials() {
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
			<SectionHeader intro="Client Feedback" title="What Clients Say" description="A few words from people we've had the pleasure of building with." />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
				{loading ? (
					<div className="col-span-full flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
					</div>
				) : (
					testimonials.map((testimonial) => (
						<div key={testimonial._id} className="relative bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
							<Quote className="absolute -top-2 -right-2 w-20 h-20 text-gray-900/4 dark:text-white/6" strokeWidth={1} aria-hidden="true" />
							<div className="relative flex gap-1 mb-3" role="img" aria-label={`Rated ${testimonial.rating} out of 5 stars`}>
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} aria-hidden="true" className={`w-4 h-4 ${i < testimonial.rating ? "fill-accent text-accent dark:fill-[#eda40d] dark:text-[#eda40d]" : "text-gray-300 dark:text-gray-600"}`} />
								))}
							</div>
							<p className="relative text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
							<div className="relative flex items-center gap-3">
								{testimonial.avatar ? (
									<Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shrink-0" />
								) : (
									<div aria-hidden="true" className="w-10 h-10 rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] flex items-center justify-center text-gray-900 text-sm font-semibold shrink-0">
										{testimonial.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
								)}
								<div>
									<div className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	);
}
