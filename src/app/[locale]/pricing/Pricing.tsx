import Link from "next/link";
import { Building2, Check, Rocket, ShoppingCart, Sparkles } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import GradientButton from "../../components/GradientButton";

type Tier = {
	name: string;
	icon: typeof Rocket;
	price: string;
	tagline: string;
	features: string[];
	featured?: boolean;
	ctaText: string;
};

const TIERS: Tier[] = [
	{
		name: "Landing Page",
		icon: Rocket,
		price: "From kr 15,000",
		tagline: "A focused single page to launch fast.",
		features: ["1 custom-designed page", "Mobile-responsive layout", "Contact form", "Basic on-page SEO", "1 round of revisions"],
		ctaText: "Get Started",
	},
	{
		name: "Business Website",
		icon: Building2,
		price: "From kr 30,000",
		tagline: "A complete multi-page site for your business.",
		features: ["Up to 7 custom pages", "Content management (CMS)", "Blog setup", "SEO-optimized structure", "2 rounds of revisions", "30 days of post-launch support"],
		featured: true,
		ctaText: "Get Started",
	},
	{
		name: "Web App / E-commerce",
		icon: ShoppingCart,
		price: "From kr 60,000",
		tagline: "Full-stack builds, online stores, and custom tools.",
		features: ["Custom full-stack development", "E-commerce or web app functionality", "Database & admin dashboard", "Third-party integrations", "Performance & security review", "Dedicated project support"],
		ctaText: "Request a Quote",
	},
];

function PricingCard({ tier }: { tier: Tier }) {
	const Icon = tier.icon;
	return (
		<div
			className={`relative rounded-3xl p-8 flex flex-col ${
				tier.featured
					? "bg-white dark:bg-darkHover/60 border-2 border-[#eda40d] shadow-xl lg:-translate-y-4"
					: "bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 shadow-sm"
			}`}
		>
			{tier.featured && (
				<span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 shadow-md">
					<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
					Most Popular
				</span>
			)}

			<div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#eda40d]/15 to-[#c17e0a]/15 flex items-center justify-center mb-5">
				<Icon className="w-6 h-6 text-accent dark:text-[#eda40d]" aria-hidden="true" />
			</div>

			<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{tier.tagline}</p>
			<p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{tier.price}</p>

			<ul className="space-y-3 mb-8 grow">
				{tier.features.map((feature) => (
					<li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
						<Check className="w-4.5 h-4.5 text-accent dark:text-[#eda40d] shrink-0 mt-0.5" aria-hidden="true" />
						<span>{feature}</span>
					</li>
				))}
			</ul>

			{tier.featured ? (
				<GradientButton text={tier.ctaText} href="/contact" className="w-full justify-center" showArrow={false} />
			) : (
				<Link
					href="/contact"
					className="w-full text-center px-6 py-3 rounded-full border-2 border-gray-300 dark:border-white/15 font-semibold text-gray-800 dark:text-white hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-300"
				>
					{tier.ctaText}
				</Link>
			)}
		</div>
	);
}

export default function Pricing({ standalone = false }: { standalone?: boolean } = {}) {
	return (
		<section id="pricing" className="w-full px-[6%] lg:px-[12%] py-16 scroll-mt-20">
			<SectionHeader
				as={standalone ? "h1" : "h2"}
				intro="Pricing"
				title="Plans for Every Project"
				description="Transparent starting prices for the most common project types. Every project is scoped and quoted individually — these are a starting point for the conversation."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mt-10 lg:mt-14">
				{TIERS.map((tier) => (
					<PricingCard key={tier.name} tier={tier} />
				))}
			</div>

			{/* Maintenance retainer */}
			<div className="max-w-6xl mx-auto mt-8 rounded-2xl bg-white/60 dark:bg-darkHover/30 border border-gray-200/70 dark:border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="text-center sm:text-left">
					<h3 className="font-semibold text-gray-900 dark:text-white">Ongoing Maintenance &amp; Support</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">Updates, monitoring, and small changes after launch — from kr 990/month.</p>
				</div>
				<Link href="/contact" className="shrink-0 px-5 py-2.5 rounded-full border-2 border-gray-300 dark:border-white/15 font-semibold text-sm text-gray-800 dark:text-white hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-300">
					Learn More
				</Link>
			</div>

			<p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">Prices are starting points and exclude VAT (mva). Final scope and pricing are confirmed after a short discovery call.</p>

			<div className="text-center mt-8">
				<p className="text-gray-700 dark:text-gray-300 mb-4">Need something that doesn&apos;t fit these boxes?</p>
				<GradientButton text="Let's Talk About Your Project" href="/contact" className="w-max mx-auto" />
			</div>
		</section>
	);
}
