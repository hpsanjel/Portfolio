import Image from "next/image";
import Link from "next/link";

const quickLinks = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/services", label: "Services" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/projects", label: "Projects" },
	{ href: "/blog", label: "Blog" },
	{ href: "/booking", label: "Book a Meeting" },
	{ href: "/contact", label: "Contact" },
	{ href: "/cv-builder", label: "Free CV Builder" },
];

const socialLinks = [
	{ href: "https://www.linkedin.com/in/hpsanjel/", icon: "/images/linkedin.png", label: "LinkedIn" },
	{ href: "https://github.com/hpsanjel", icon: "/images/github.png", label: "GitHub" },
	{ href: "https://www.facebook.com/hpsanjel/", icon: "/images/facebook.png", label: "Facebook" },
];

export default function Footer() {
	return (
		<footer className="relative md:mt-6 bg-linear-to-br from-[#fdf6e8] via-white to-[#eaf1ff] dark:from-[#1c1305] dark:via-blue-950/90 dark:to-[#05070d] border-t border-gray-200 dark:border-purple-900/50">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239CA3AF" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] dark:opacity-10'></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
				{/* Main Content Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
					{/* Brand Section */}
					<div className="sm:col-span-2 md:col-span-2 text-center sm:text-left">
						<Link href="/" className="group inline-flex items-center gap-3 mb-4">
							<Image src="/images/sanjeltechkologo.png" alt="SanjelTech logo" width={1402} height={881} className="w-20 transition-transform duration-300 group-hover:scale-105" />
						</Link>
						<p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto sm:mx-0 leading-relaxed">Crafting digital experiences with passion and precision. Let&apos;s build something amazing together.</p>
					</div>

					{/* Quick Links */}
					<div className="text-center sm:text-left">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
						<ul className="text-sm space-y-2">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-400 transition-colors duration-300">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Social Links */}
					<div className="text-center sm:text-left">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
						<div className="flex justify-center sm:justify-start gap-3">
							{socialLinks.map((social) => (
								<a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 dark:bg-white p-2 hover:bg-yellow-100 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110" aria-label={`${social.label} (opens in new tab)`}>
									<Image src={social.icon} alt={social.label} width={20} height={20} className="w-5 h-5" />
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-200 dark:border-gray-700 pt-8">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">© {new Date().getFullYear()} SanjelTech. All rights reserved.</p>
						<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
							<Link href="/privacy" className="hover:text-accent dark:hover:text-yellow-400 transition-colors duration-300">
								Privacy Policy
							</Link>
							<Link href="/terms" className="hover:text-accent dark:hover:text-yellow-400 transition-colors duration-300">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
