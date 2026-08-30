"use client";
import { useEffect, useRef, useState } from "react";
import { PhoneCall, ClipboardList, Lightbulb, Users, Code2, RefreshCcw, CheckCircle2, Rocket, type LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface Step {
	icon: LucideIcon;
	title: string;
	description: string;
}

const steps: Step[] = [
	{
		icon: PhoneCall,
		title: "Discovery Call",
		description: "We hop on a quick call to learn about you, your business, and what you're hoping to achieve online.",
	},
	{
		icon: ClipboardList,
		title: "Understanding Requirements",
		description: "We dig into your goals, audience, and technical needs to map out exactly what needs to be built.",
	},
	{
		icon: Lightbulb,
		title: "Proposal & Suggestions",
		description: "You get a clear proposal covering approach, timeline, and cost — plus ideas we think could make the product even better.",
	},
	{
		icon: Users,
		title: "Consultation & Planning",
		description: "We walk through the proposal together, refine the scope, and lock in the roadmap before a single line of code is written.",
	},
	{
		icon: Code2,
		title: "Design & Development",
		description: "Our team gets to work, building and testing the product sprint by sprint with steady, visible progress.",
	},
	{
		icon: RefreshCcw,
		title: "Feedback & Iteration",
		description: "You review progress at every milestone and share feedback, which we fold straight back into the build.",
	},
	{
		icon: CheckCircle2,
		title: "Finalize & Polish",
		description: "Once everything's approved, we handle final QA, performance checks, and the last mile of polish.",
	},
	{
		icon: Rocket,
		title: "Launch",
		description: "Your project goes live — and we stick around to support you as it grows.",
	},
];

// Nodes alternate between the left and right edge of the rail, connected by a smooth S-curve.
const CURVE_X = steps.map((_, i) => (i % 2 === 0 ? 7 : 93));
const CURVE_PATH = (() => {
	let d = `M ${CURVE_X[0]} 50`;
	for (let i = 1; i < steps.length; i++) {
		const y0 = (i - 1) * 100 + 50;
		const y1 = i * 100 + 50;
		const x0 = CURVE_X[i - 1];
		const x1 = CURVE_X[i];
		d += ` C ${x0} ${y0 + 50}, ${x1} ${y1 - 50}, ${x1} ${y1}`;
	}
	return d;
})();

export default function HowWeWork() {
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const [visible, setVisible] = useState<Set<number>>(new Set());

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const index = Number((entry.target as HTMLElement).dataset.index);
					setVisible((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
		);
		itemRefs.current.forEach((el) => el && observer.observe(el));
		return () => observer.disconnect();
	}, []);

	return (
		<section id="how-we-work" className="relative w-full px-[6%] lg:px-[12%] py-12 overflow-hidden">
			{/* Decorative glows */}
			<div className="absolute top-10 left-0 w-64 h-64 bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 rounded-full blur-3xl pointer-events-none"></div>
			<div className="absolute bottom-10 right-0 w-72 h-72 bg-linear-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

			<SectionHeader intro="Our Process" title="How We Bring It to Life" description="A transparent, step-by-step process — from the first hello to the moment your project goes live." />

			<div className="relative max-w-2xl mx-auto mt-4">
				{/* Curved rail */}
				<svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${steps.length * 100}`} preserveAspectRatio="none">
					<defs>
						<linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#eda40d" />
							<stop offset="100%" stopColor="#c17e0a" stopOpacity="0.4" />
						</linearGradient>
					</defs>
					<path d={CURVE_PATH} fill="none" stroke="url(#curve-gradient)" strokeWidth="0.6" strokeDasharray="1.4 2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
				</svg>

				<ol className="space-y-6 md:space-y-8">
					{steps.map((step, index) => {
						const Icon = step.icon;
						const isEven = index % 2 === 0;
						const isVisible = visible.has(index);
						return (
							<li
								key={step.title}
								ref={(el) => {
									itemRefs.current[index] = el;
								}}
								data-index={index}
								className={`relative flex ${isEven ? "flex-row" : "flex-row-reverse"} gap-4 md:gap-6 transition-all duration-700 ease-out ${
									isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
								}`}
								style={{ transitionDelay: isVisible ? `${(index % 4) * 100}ms` : "0ms" }}
							>
								{/* Node */}
								<div className="relative z-10 shrink-0">
									<div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-[#eda40d] to-[#c17e0a] flex items-center justify-center shadow-lg shadow-[#c17e0a]/30 rotate-3 hover:rotate-0 transition-transform duration-300">
										<Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-900" strokeWidth={2} />
									</div>
									<span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white dark:bg-darkTheme border-2 border-[#c17e0a] text-accent dark:text-[#c17e0a] text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
								</div>

								{/* Card */}
								<div className="relative flex-1 group bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
									<span className={`pointer-events-none select-none absolute -bottom-3 text-5xl md:text-6xl font-bold text-gray-900/4 dark:text-white/6 ${isEven ? "-right-1" : "-left-1"}`}>{String(index + 1).padStart(2, "0")}</span>
									<h3 className="relative text-base md:text-lg font-semibold mb-1 text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-[#c17e0a] transition-colors duration-300">{step.title}</h3>
									<p className="relative text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
								</div>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
}
