"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import useThemeToggle from "../hooks/useThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Home, User, Briefcase, FolderOpen, Tag, Mail, Menu, X } from "lucide-react";

export default function HomeNavHeader() {
	const t = useTranslations("Nav");
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { isDark, toggleTheme } = useThemeToggle();
	const pathname = usePathname();
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!sideMenuOpen) return;
		closeButtonRef.current?.focus();
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setSideMenuOpen(false);
				menuButtonRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [sideMenuOpen]);

	const navItems = [
		{ href: "/", label: t("home"), icon: Home },
		{ href: "/about", label: t("about"), icon: User },
		{ href: "/services", label: t("services"), icon: Briefcase },
		{ href: "/pricing", label: t("pricing"), icon: Tag },
		{ href: "/projects", label: t("projects"), icon: FolderOpen },
	];

	return (
		<>
			<nav className={`w-full fixed top-8 sm:top-9 px-5 lg:px-8 xl:px-[8%] flex items-center justify-between z-50 bg-linear-to-br from-[#fdf6e8] via-white to-[#eaf1ff] dark:from-[#1c1305] dark:via-blue-950/90 dark:to-[#05070d] shadow-sm border-t border-gray-200 dark:border-purple-900/50 transition-all duration-300 ease-in-out ${scrolled ? "py-3" : "py-8"}`}>
				<div className="flex items-center">
					<Link href="/">
						<Image src="/images/sanjeltechkologo.png" alt="SanjelTech logo" width={1402} height={881} className={`cursor-pointer transition-all duration-300 ease-in-out ${scrolled ? "w-16" : "w-24"}`} />
					</Link>
				</div>
				<ul className="hidden md:flex items-center gap-6 lg:gap-8 font-Outfit dark:bg-transparent">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={`
									relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out
									${isActive ? "text-accent dark:text-yellow-400 font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-yellow-400"}
									hover:bg-yellow-50 dark:hover:bg-yellow-900/20
									before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5
									before:bg-accent dark:before:bg-yellow-400 before:transition-all before:duration-300
									${isActive ? "before:w-full" : "hover:before:w-full"}
								`}
									aria-current={isActive ? "page" : undefined}
								>
									{item.label}
									{isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent dark:bg-yellow-400 rounded-full"></span>}
								</Link>
							</li>
						);
					})}
				</ul>
				<div className="flex items-center gap-4 ">
					<button type="button" onClick={toggleTheme} aria-label={t("toggleTheme")} aria-pressed={isDark} className="cursor-pointer p-2">
						{isDark ? <Image src="/images/sun.svg" alt="" width={24} height={24} className="w-6" /> : <Image src="/images/moon.svg" alt="" width={20} height={20} className="w-5" />}
					</button>

					<LanguageSwitcher />

					<button ref={menuButtonRef} type="button" className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200" onClick={() => setSideMenuOpen(true)} aria-label={t("openMenu")} aria-expanded={sideMenuOpen} aria-controls="mobile-menu">
						<Menu className="w-5 h-5" />
					</button>
				</div>
				{/* Side Menu */}
				{sideMenuOpen && (
					<>
						{/* Overlay */}
						<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSideMenuOpen(false)} aria-hidden="true" />

						{/* Menu Panel */}
						<nav id="mobile-menu" role="dialog" aria-modal="true" aria-label={t("mobileNavLabel")} className="flex md:hidden flex-col gap-2 fixed right-0 top-0 bottom-0 w-[85%] max-w-80 z-50 h-screen bg-white dark:bg-[#0a0d16] shadow-2xl font-Outfit dark:text-white transition-transform duration-300 ease-in-out overflow-y-auto">
							{/* Header */}
							<div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-gray-100 dark:border-white/10">
								<Image src="/images/sanjeltechkologo.png" alt="SanjelTech logo" width={1402} height={881} className="w-16" />
								<button ref={closeButtonRef} type="button" onClick={() => setSideMenuOpen(false)} className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200" aria-label={t("closeMenu")}>
									<X className="w-4.5 h-4.5 cursor-pointer text-gray-700 dark:text-gray-300" />
								</button>
							</div>

							{/* Navigation Items — centered in the space between header and footer */}
							<div className="flex-1 flex flex-col justify-center min-h-0">
								<div className="w-full px-4 space-y-1">
									{navItems.map((item) => {
										const isActive = pathname === item.href;
										const Icon = item.icon;
										return (
											<div key={item.href} className="w-full">
												<Link
													href={item.href}
													onClick={() => setSideMenuOpen(false)}
													className={`
													flex items-center w-full px-4 py-3.5 text-base font-medium rounded-xl transition-all duration-200 ease-in-out
													${isActive ? "text-accent dark:text-[#eda40d] bg-[#eda40d]/10 font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-[#eda40d] hover:bg-[#eda40d]/5"}
												`}
												>
													<Icon className={`w-5 h-5 mr-3.5 ${isActive ? "text-accent dark:text-[#eda40d]" : "text-gray-400 dark:text-gray-500"}`} />
													<span>{item.label}</span>
												</Link>
											</div>
										);
									})}
								</div>

								{/* Availability strip */}
								<div className="w-full px-8 mt-6">
									<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										{t("availableStrip")}
									</div>
								</div>

								{/* Contact Button */}
								<div className="w-full px-4 mt-6">
									<Link href="/contact" onClick={() => setSideMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-base font-semibold rounded-xl bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 hover:shadow-lg hover:shadow-[#c17e0a]/25 transition-shadow duration-200 ease-in-out">
										<Mail className="w-5 h-5" />
										{t("contactCta")}
									</Link>
								</div>
							</div>

							{/* Footer */}
							<div className="w-full px-8 py-6 border-t border-gray-100 dark:border-white/10">
								<div className="flex items-center justify-center gap-3">
									<a href="https://www.linkedin.com/in/hpsanjel/" className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 hover:border-[#eda40d] hover:bg-[#eda40d]/10 transition-colors duration-200" aria-label={t("linkedin")}>
										<Image src="/images/linkedin.png" alt="" width={16} height={16} className="w-4 h-4 dark:invert" />
									</a>
									<a href="https://github.com/hpsanjel" className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 hover:border-[#eda40d] hover:bg-[#eda40d]/10 transition-colors duration-200" aria-label={t("github")}>
										<Image src="/images/github.png" alt="" width={16} height={16} className="w-4 h-4 dark:invert" />
									</a>
									<a href="https://www.facebook.com/hpsanjel/" className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/15 hover:border-[#eda40d] hover:bg-[#eda40d]/10 transition-colors duration-200" aria-label={t("facebook")}>
										<Image src="/images/facebook.png" alt="" width={16} height={16} className="w-4 h-4 dark:invert" />
									</a>
								</div>
							</div>
						</nav>
					</>
				)}
			</nav>
			{/* Gradient fade effect at bottom */}
			{/* <div className="fixed top-24 left-0 right-0 h-10 pointer-events-none">
			<div className="w-full h-full bg-gradient-to-b from-gray-50 to-transparent dark:from-purple-950/80 dark:via-blue-950/40 dark:to-transparent"></div>
		</div> */}
		</>
	);
}
