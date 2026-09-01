"use client";
import { useEffect, useState } from "react";
import SectionHeader from "../../components/SectionHeader";
import Image from "next/image";

type Service = { id: number; title: string; description: string; icon: string };

const ARC_POSITION = [
	{ translate: "translate-y-10", rotate: "-rotate-6", scale: "scale-95", z: "z-0" },
	{ translate: "-translate-y-10", rotate: "rotate-0", scale: "scale-110", z: "z-20" },
	{ translate: "translate-y-10", rotate: "rotate-6", scale: "scale-95", z: "z-0" },
];

const FLAT_POSITION = { translate: "translate-y-0", rotate: "rotate-0", scale: "scale-100", z: "z-0" };

function chunk<T>(items: T[], size: number): T[][] {
	const rows: T[][] = [];
	for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
	return rows;
}

function ServiceCard({ service, className = "" }: { service: Service; className?: string }) {
	return (
		<div className={`group relative bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}>
			<div className="w-14 h-14 rounded-xl bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 flex items-center justify-center mb-4">
				<Image src={service.icon} alt={service.title} width={32} height={32} className="w-8 h-8 object-contain" />
			</div>
			<h3 className="text-lg sm:text-xl font-semibold mb-2 text-accent dark:text-[#c17e0a]">{service.title}</h3>
			<p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
		</div>
	);
}

export default function Services({ standalone = false }: { standalone?: boolean } = {}) {
	const [services, setServices] = useState<Service[]>([]);
	const [servicesLoading, setServicesLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function loadServices() {
			try {
				const res = await fetch("/api/services");
				const data = await res.json();
				if (!cancelled) setServices(Array.isArray(data) ? data : []);
			} catch {
				if (!cancelled) setServices([]);
			} finally {
				if (!cancelled) setServicesLoading(false);
			}
		}
		loadServices();
		return () => {
			cancelled = true;
		};
	}, []);

	if (servicesLoading) {
		return (
			<section id="services" className="w-full px-[6%] lg:px-[12%] py-16 scroll-mt-20">
				<SectionHeader as={standalone ? "h1" : "h2"} intro="What We Offer" title="Our Services" description="From responsive web design to interactive UI/UX development, we provide a range of services to help bring your digital ideas to life. Let's collaborate to create a web presence that not only looks great but also performs exceptionally." />
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
				</div>
			</section>
		);
	}

	if (services.length === 0) {
		return (
			<section id="services" className="w-full px-[6%] lg:px-[12%] py-16 scroll-mt-20">
				<SectionHeader as={standalone ? "h1" : "h2"} intro="What We Offer" title="Our Services" description="From responsive web design to interactive UI/UX development, we provide a range of services to help bring your digital ideas to life. Let's collaborate to create a web presence that not only looks great but also performs exceptionally." />
				<div className="text-center text-gray-600 dark:text-gray-300 py-12">No services added yet.</div>
			</section>
		);
	}

	const rows = chunk(services, 3);

	return (
		<section id="services" className="w-full px-[6%] lg:px-[12%] py-16 scroll-mt-20">
			<SectionHeader intro="What We Offer" title="Our Services" description="From responsive web design to interactive UI/UX development, we provide a range of services to help bring your digital ideas to life. Let's collaborate to create a web presence that not only looks great but also performs exceptionally." />

			{/* Mobile / tablet: swipeable row / 2-col grid */}
			<div className="flex lg:hidden md:grid md:grid-cols-2 gap-6 my-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-[6%] px-[6%] md:mx-0 md:px-0 pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{services.map((service, index) => (
					<ServiceCard key={`service-m-${service.id || index}-${service.title}`} service={service} className="shrink-0 w-[80%] sm:w-[55%] md:w-auto snap-center" />
				))}
			</div>

			{/* Desktop: cards laid out along a gentle arc, row by row */}
			<div className="hidden lg:block my-20 space-y-24">
				{rows.map((row, rowIndex) => (
					<div key={`row-${rowIndex}`} className="relative">
						{row.length === 3 && (
							<svg className="absolute inset-x-6 -top-10 h-20 w-[calc(100%-3rem)] pointer-events-none" viewBox="0 0 600 100" preserveAspectRatio="none">
								<path d="M 10 90 Q 300 -20 590 90" fill="none" stroke={`url(#arc-gradient-${rowIndex})`} strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round" />
								<defs>
									<linearGradient id={`arc-gradient-${rowIndex}`} x1="0" y1="0" x2="1" y2="0">
										<stop offset="0%" stopColor="#eda40d" stopOpacity="0.15" />
										<stop offset="50%" stopColor="#c17e0a" stopOpacity="0.9" />
										<stop offset="100%" stopColor="#eda40d" stopOpacity="0.15" />
									</linearGradient>
								</defs>
							</svg>
						)}
						<div className="grid grid-cols-3 gap-8 items-start">
							{row.map((service, i) => {
								const pos = row.length === 3 ? ARC_POSITION[i] : FLAT_POSITION;
								return (
									<div key={`service-d-${service.id || i}-${service.title}`} className={`relative ${pos.translate} ${pos.rotate} ${pos.scale} ${pos.z} hover:rotate-0! hover:scale-110! hover:z-30! transition-transform duration-500`}>
										<span className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-linear-to-br from-[#eda40d] to-[#c17e0a] shadow-md shadow-[#c17e0a]/40 ring-4 ring-white dark:ring-darkTheme"></span>
										<ServiceCard service={service} />
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
