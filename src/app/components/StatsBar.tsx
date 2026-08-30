"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar, FolderCheck, Layers, Clock, type LucideIcon } from "lucide-react";

interface Stat {
	icon: LucideIcon;
	value: number;
	suffix: string;
	label: string;
}

const stats: Stat[] = [
	{ icon: Calendar, value: 3, suffix: "+", label: "Years of Experience" },
	{ icon: FolderCheck, value: 6, suffix: "+", label: "Projects Delivered" },
	{ icon: Layers, value: 15, suffix: "+", label: "Technologies Used" },
	{ icon: Clock, value: 24, suffix: "h", label: "Avg. Response Time" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!active) return;
		let start: number | null = null;
		let frame: number;
		const step = (timestamp: number) => {
			if (start === null) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			setValue(Math.floor(progress * target));
			if (progress < 1) frame = requestAnimationFrame(step);
			else setValue(target);
		};
		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	}, [active, target, duration]);

	return value;
}

function StatItem({ icon: Icon, value, suffix, label, active, index }: Stat & { active: boolean; index: number }) {
	const count = useCountUp(value, active);
	return (
		<div className={`flex flex-col items-center text-center gap-2 ${index > 0 ? "md:border-l md:border-gray-200 dark:md:border-white/10" : ""}`}>
			<div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 flex items-center justify-center mb-1">
				<Icon className="w-6 h-6 text-accent dark:text-[#c17e0a]" />
			</div>
			<div className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-accent to-[#c17e0a] dark:from-[#eda40d] dark:to-[#c17e0a] bg-clip-text text-transparent">
				{count}
				{suffix}
			</div>
			<div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
		</div>
	);
}

export default function StatsBar() {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setActive(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="w-full px-[6%] lg:px-[12%] py-6">
			<div ref={ref} className="relative max-w-6xl mx-auto rounded-3xl bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 shadow-sm px-6 py-8 sm:px-10 sm:py-10 overflow-hidden">
				<div className="absolute -top-10 -left-10 w-40 h-40 bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 rounded-full blur-3xl pointer-events-none"></div>
				<div className="relative grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
					{stats.map((stat, index) => (
						<StatItem key={stat.label} {...stat} active={active} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
