"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useThemeToggle from "../hooks/useThemeToggle";
import Link from "next/link";
import { Home, User, Briefcase, FolderOpen, Mail, X } from "lucide-react";

export default function HomeNavHeader() {
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
		{ href: "/", label: "Home", icon: Home },
		{ href: "/about", label: "About", icon: User },
		{ href: "/services", label: "Services", icon: Briefcase },
		{ href: "/projects", label: "Projects", icon: FolderOpen },
	];

	return (
		<>
			<nav
				className={`w-full fixed top-8 sm:top-9 px-5 lg:px-8 xl:px-[8%] flex items-center justify-between z-50 bg-linear-to-br from-[#fdf6e8] via-white to-[#eaf1ff] dark:from-[#1c1305] dark:via-blue-950/90 dark:to-[#05070d] shadow-sm border-t border-gray-200 dark:border-purple-900/50 transition-all duration-300 ease-in-out ${
					scrolled ? "py-3" : "py-8"
				}`}
			>
				<div className="flex items-center">
					<Link href="/">
						<Image
							src="/images/logo-sanjeltech-nav.png"
							alt="SanjelTech logo"
							width={1402}
							height={881}
							className={`cursor-pointer transition-all duration-300 ease-in-out dark:filter-[drop-shadow(1px_0_0_#fff)_drop-shadow(-1px_0_0_#fff)_drop-shadow(0_1px_0_#fff)_drop-shadow(0_-1px_0_#fff)] ${scrolled ? "w-16" : "w-24"}`}
						/>
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
					<button type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={isDark} className="cursor-pointer p-2">
						{isDark ? <Image src="/images/sun.svg" alt="" width={24} height={24} className="w-6" /> : <Image src="/images/moon.svg" alt="" width={20} height={20} className="w-5" />}
					</button>

					<button
						ref={menuButtonRef}
						type="button"
						className="flex md:hidden ml-1 items-center gap-2"
						onClick={() => setSideMenuOpen(true)}
						aria-label="Open menu"
						aria-expanded={sideMenuOpen}
						aria-controls="mobile-menu"
					>
						<span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Menu</span>
						<Image src="/images/menu.svg" alt="" width={24} height={24} className="w-8 dark:hidden" />
						<Image src="/images/menu-white.svg" alt="" width={24} height={24} className="w-8 hidden dark:block" />
					</button>
				</div>
				{/* Side Menu */}
				{sideMenuOpen && (
					<>
						{/* Overlay */}
						<div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSideMenuOpen(false)} aria-hidden="true" />

						{/* Menu Panel */}
						<ul
							id="mobile-menu"
							role="dialog"
							aria-modal="true"
							aria-label="Mobile navigation"
							className="flex md:hidden flex-col items-start justify-start gap-2 px-8 py-20 fixed right-0 top-0 bottom-0 w-80 z-50 h-screen bg-white dark:bg-gray-900 shadow-2xl font-Outfit dark:text-white transition-transform duration-300 ease-in-out"
						>
							{/* Header */}
							<div className="absolute left-6 top-10">
								<div className="flex items-center gap-3">
									<Image
									src="/images/logo-sanjeltech-nav.png"
									alt="SanjelTech logo"
									width={1402}
									height={881}
									className="w-20 dark:filter-[drop-shadow(1px_0_0_#fff)_drop-shadow(-1px_0_0_#fff)_drop-shadow(0_1px_0_#fff)_drop-shadow(0_-1px_0_#fff)]"
								/>
								</div>
							</div>
							<div className="absolute right-6 top-6">
								<button ref={closeButtonRef} type="button" onClick={() => setSideMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" aria-label="Close menu">
									<X className="w-6 h-6 cursor-pointer text-gray-700 dark:text-gray-300" />
								</button>
							</div>

							{/* Navigation Items */}
							<div className="w-full mt-16 space-y-1">
								{navItems.map((item) => {
									const isActive = pathname === item.href;
									const Icon = item.icon;
									return (
										<li key={item.href} className="w-full">
											<Link
												href={item.href}
												onClick={() => setSideMenuOpen(false)}
												className={`
												flex items-center w-full px-6 py-4 text-base font-medium rounded-xl transition-all duration-200 ease-in-out
												${isActive ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border-l-2 border-blue-500 shadow-sm" : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
											`}
											>
												<Icon className={`w-5 h-5 mr-4 ${isActive ? "text-blue-500" : ""}`} />
												<span>{item.label}</span>
												{isActive && (
													<div className="ml-auto">
														<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
													</div>
												)}
											</Link>
										</li>
									);
								})}

								{/* Contact Button */}
								<li className="w-full pt-4">
									<Link href="/contact" onClick={() => setSideMenuOpen(false)} className="flex items-center w-full px-6 py-4 text-base font-medium rounded-xl bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out">
										<Mail className="w-5 h-5 mr-4" />
										Contact Us
									</Link>
								</li>
							</div>

							{/* Footer */}
							<div className="absolute bottom-8 left-8 right-8">
								<div className="flex items-center justify-center gap-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
									<a href="https://www.linkedin.com/in/hpsanjel/" className="p-2 rounded-lg bg-gray-100 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors duration-200" aria-label="LinkedIn">
										<Image src="/images/linkedin.png" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
									</a>
									<a href="https://github.com/hpsanjel" className="p-2 rounded-lg bg-gray-100 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors duration-200" aria-label="GitHub">
										<Image src="/images/github.png" alt="GitHub" width={20} height={20} className="w-5 h-5" />
									</a>
									<a href="https://www.facebook.com/hpsanjel/" className="p-2 rounded-lg bg-gray-100 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors duration-200" aria-label="Facebook">
										<Image src="/images/facebook.png" alt="Facebook" width={20} height={20} className="w-5 h-5" />
									</a>
								</div>
							</div>
						</ul>
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
