import Image from "next/image";
import { Code2, User, Calendar, Palette, Award, Rocket, type LucideIcon } from "lucide-react";
import SectionHeader from "../components/SectionHeader";

interface Point {
	icon: LucideIcon;
	title: string;
	description: string;
}

const points: Point[] = [
	{ icon: Code2, title: "Full-Stack Development", description: "React, Next.js, Node.js, MongoDB & more — built end to end." },
	{ icon: User, title: "Sole Proprietor", description: "Direct work with the person building your product. No hand-offs." },
	{ icon: Calendar, title: "3+ Years Experience", description: "Hands-on, real-world project delivery." },
	{ icon: Palette, title: "User-Focused Design", description: "Accessible, intuitive, and visually compelling." },
	{ icon: Award, title: "Certified Expertise", description: "Genuine care and technical rigor in every build." },
	{ icon: Rocket, title: "Idea to Launch", description: "From discovery call through build, feedback, and support." },
];

// Positions on a circle (radius 38% of the container), evenly spaced starting at the top.
const ORBIT_POSITIONS = [
	{ top: "12%", left: "50%" },
	{ top: "31%", left: "82.9%" },
	{ top: "69%", left: "82.9%" },
	{ top: "88%", left: "50%" },
	{ top: "69%", left: "17.1%" },
	{ top: "31%", left: "17.1%" },
];

const introText = "We're SanjelTech, a one-person web and software development studio based in Oslo, Norway. We design, build, and ship full-stack applications end to end, pairing hands-on technical craft with the kind of direct attention only a sole proprietor can give.";

const techStack = [
	{ src: "/images/html5.svg", alt: "HTML5" },
	{ src: "/images/css3.svg", alt: "CSS3" },
	{ src: "/images/js.png", alt: "JavaScript" },
	{ src: "/images/react.webp", alt: "React" },
	{ src: "/images/vscode.svg", alt: "VS Code" },
	{ src: "/images/git.png", alt: "Git" },
	{ src: "/images/docker.svg", alt: "Docker" },
	{ src: "/images/python.svg", alt: "Python" },
	{ src: "/images/figma.svg", alt: "Figma" },
	{ src: "/images/googlecloud.svg", alt: "Google Cloud" },
	{ src: "/images/mongodb.svg", alt: "MongoDB" },
	{ src: "/images/postman.svg", alt: "Postman" },
	{ src: "/images/sql.svg", alt: "SQL" },
	{ src: "/images/tailwind.svg", alt: "Tailwind" },
	{ src: "/images/nextjs.svg", alt: "Next.js" },
];

function PointCard({ point, className = "" }: { point: Point; className?: string }) {
	const Icon = point.icon;
	return (
		<div className={`bg-white/90 dark:bg-darkHover/60 backdrop-blur-sm border border-gray-200/70 dark:border-white/10 rounded-xl p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${className}`}>
			<div className="w-9 h-9 mx-auto rounded-lg bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 flex items-center justify-center mb-2">
				<Icon className="w-4 h-4 text-accent dark:text-[#c17e0a]" />
			</div>
			<h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{point.title}</h3>
			<p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{point.description}</p>
		</div>
	);
}

export default function About({ standalone = false }: { standalone?: boolean } = {}) {
	return (
		<>
			<style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .marquee-container {
                    overflow: hidden;
                    white-space: nowrap;
                }

                .marquee-content {
                    display: inline-block;
                    animation: marquee 50s linear infinite;
                    will-change: transform;
                }

                .marquee-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
			<section id="about" className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-16">
				<SectionHeader as={standalone ? "h1" : "h2"} intro="Introduction" title="About Us" description="" />

				{/* Sunburst layout — desktop */}
				<div className="hidden lg:flex items-center gap-10 xl:gap-16 max-w-6xl mx-auto mt-16 mb-10">
					{/* Intro text */}
					<div className="w-1/3 shrink-0">
						<p className="text-base xl:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{introText}</p>
					</div>

					{/* Sun */}
					<div className="relative flex-1 max-w-2xl mx-auto aspect-square">
						{/* Rays */}
						<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
							<defs>
								<radialGradient id="ray-gradient">
									<stop offset="0%" stopColor="#eda40d" stopOpacity="0.9" />
									<stop offset="100%" stopColor="#c17e0a" stopOpacity="0.1" />
								</radialGradient>
							</defs>
							{ORBIT_POSITIONS.map((pos, i) => (
								<line key={i} x1="50" y1="50" x2={parseFloat(pos.left)} y2={parseFloat(pos.top)} stroke="url(#ray-gradient)" strokeWidth="0.3" strokeDasharray="1.2 1.6" strokeLinecap="round" />
							))}
						</svg>

						{/* Center "sun" photo */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
							<div className="relative flex items-center justify-center">
								<div className="absolute w-full h-full rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] blur-2xl opacity-60 scale-125 animate-pulse"></div>
								<div className="absolute -inset-3 rounded-full border-2 border-dashed border-[#eda40d]/40 animate-[spin_30s_linear_infinite]"></div>
								<Image src="/images/profile.jpeg" alt="Our Profile" width={200} height={200} className="relative w-36 lg:w-44 h-36 lg:h-44 rounded-full object-cover border-4 border-white dark:border-darkTheme shadow-2xl" />
							</div>
						</div>

						{/* Orbiting points */}
						{points.map((point, i) => (
							<div key={point.title} className="absolute -translate-x-1/2 -translate-y-1/2 w-40 lg:w-48 z-10 text-center" style={{ top: ORBIT_POSITIONS[i].top, left: ORBIT_POSITIONS[i].left }}>
								<PointCard point={point} />
							</div>
						))}
					</div>
				</div>

				{/* Mobile/tablet fallback: photo on top, intro text below, points in a grid */}
				<div className="lg:hidden mt-6 mb-10">
					<div className="flex justify-center mb-6">
						<div className="relative flex items-center justify-center">
							<div className="absolute w-full h-full rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] blur-2xl opacity-50 scale-125"></div>
							<Image src="/images/profile.jpeg" alt="Our Profile" width={160} height={160} className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-darkTheme shadow-xl" />
						</div>
					</div>
					<p className="text-center text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto mb-8 px-4">{introText}</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
						{points.map((point) => (
							<PointCard key={point.title} point={point} />
						))}
					</div>
				</div>

				{/* Tech Stack Marquee */}
				<div className="mt-16 sm:mt-20 marquee-container">
					<div className="marquee-content">
						<ul className="flex gap-3 sm:gap-4 md:gap-5">
							{/* First set */}
							{techStack.map((tech, i) => (
								<li key={`${tech.alt}-1-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
									<Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
								</li>
							))}
							{/* Second set for seamless loop */}
							{techStack.map((tech, i) => (
								<li key={`${tech.alt}-2-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
									<Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
								</li>
							))}
							{/* Third set for extra smoothness */}
							{techStack.map((tech, i) => (
								<li key={`${tech.alt}-3-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
									<Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
								</li>
							))}
							{/* Fourth set for continuous effect */}
							{techStack.map((tech, i) => (
								<li key={`${tech.alt}-4-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
									<Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
		</>
	);
}
