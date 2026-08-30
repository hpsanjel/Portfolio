import Image from "next/image";
import GradientButton from "./GradientButton";
import ContactForm from "./ContactForm";

export default function Main() {
	return (
		<section id="main" className="max-w-7xl px-4 sm:px-6 md:px-8 lg:px-[8%] mx-auto py-16 relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
				{/* Hero Content */}
				<div className="order-2 lg:order-1 flex flex-col lg:col-span-2 items-center lg:items-start text-center lg:text-left gap-5">
					{/* Signature strip */}
					<div className="flex items-center gap-3">
						<div className="relative shrink-0">
							<div className="absolute inset-0 rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] blur-md opacity-40"></div>
							<Image src="/images/profile.jpeg" alt="SanjelTech" width={56} height={56} className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-lg" />
						</div>
						<div className="text-left">
							<p className="font-semibold text-gray-900 dark:text-white leading-tight">Hari Prasad Sanjel</p>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">Web &amp; Software Developer</p>
						</div>
					</div>

					{/* Main Title */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-Outfit bg-linear-to-r from-[#eda40d] via-[#c17e0a] to-[#eda40d] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]" data-control data-scroll-speed="5">
						Web and Software Development Lab
					</h1>
					{/* Description */}
					<p className="max-w-2xl mx-auto lg:mx-0 font-Outfit text-base text-gray-700 dark:text-gray-300 leading-relaxed" data-scroll-controller>
						Based in Oslo, Norway with over <span className="font-bold text-accent dark:text-[#eda40d]">3+ years</span> of experience crafting
						<span className="relative inline-block">
							<span className="relative z-10 mx-1">responsive</span>
							<span className="absolute bottom-0 left-0 w-full h-2 bg-[#eda40d]/30 -rotate-1"></span>
						</span>
						and
						<span className="relative inline-block">
							<span className="relative z-10 mx-1">user-friendly</span>
							<span className="absolute bottom-0 left-0 w-full h-2 bg-[#c17e0a]/30 rotate-1"></span>
						</span>
						web applications. Passionate about solving complex problems.
					</p>
					{/* Tech Stack Pills */}
					<div className="flex flex-wrap justify-center lg:justify-start gap-2">
						<span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-accent dark:text-[#eda40d] rounded-full border border-[#eda40d]/30">Next.js</span>
						<span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-accent dark:text-[#eda40d] rounded-full border border-[#eda40d]/30">PostgreSQL</span>
						<span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-accent dark:text-[#eda40d] rounded-full border border-[#eda40d]/30">NextAuth</span>
						<span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-accent dark:text-[#eda40d] rounded-full border border-[#eda40d]/30">AWS</span>
					</div>
					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
						<GradientButton text="Our Projects" href="/projects" />
						<a href="/services" className="px-6 md:px-8 py-2 md:py-3 border-2 rounded-full border-gray-300 dark:border-gray-600 flex items-center gap-2 bg-white dark:bg-gray-900 dark:text-white font-semibold hover:border-[#eda40d] hover:bg-linear-to-r hover:from-[#eda40d]/5 hover:to-[#c17e0a]/5 transition-all duration-300 shadow-md hover:shadow-lg">
							<span>Our Services</span>
						</a>
					</div>
					{/* Credentials strip */}
					<div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
						<span className="font-medium">3+ Years Experience</span>
						<span className="text-gray-400 dark:text-gray-600">•</span>
						<span className="font-medium">6+ Projects Delivered</span>
						<span className="text-gray-400 dark:text-gray-600">•</span>
						<span className="inline-flex items-center gap-1.5 font-medium">
							<span className="w-2 h-2 rounded-full bg-green-500"></span>
							Available for New Projects
						</span>
					</div>
				</div>
				{/* Project Enquiry Form */}
				<div className="hidden md:block lg:order-2 w-full bg-white/70 dark:bg-darkHover/30 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-6 sm:p-8">
					<h2 className="text-xl sm:text-2xl font-bold font-Outfit mb-1">Request a Quote</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Share your requirements and receive a quote.</p>
					<ContactForm className="w-full" />
				</div>
			</div>
		</section>
	);
}
