"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useThemeToggle from "../hooks/useThemeToggle";
import Link from "next/link";
import GradientButton from "./GradientButton";

export default function HomeNavHeader() {
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const { isDark, toggleTheme } = useThemeToggle();
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About Me" },
		{ href: "/services", label: "Services" },
		{ href: "/projects", label: "Projects" },
		{ href: "/blog", label: "Blogs" },
	];

	return (
		<nav className="w-full fixed px-5 lg:px-8 xl:px-[8%] py-8 flex items-center justify-between z-50 bg-white dark:bg-[#0f0b1a]/90 dark:backdrop-blur-md shadow-sm">
			<div className="flex items-center">
				<Link href="/">
					<Image src="/images/logo-black.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer dark:hidden" />
				</Link>
				<Link href="/">
					<Image src="/images/logo-white.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer hidden dark:block" />
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
									${isActive 
										? 'text-yellow-600 dark:text-yellow-400 font-semibold' 
										: 'text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400'
									}
									hover:bg-yellow-50 dark:hover:bg-yellow-900/20
									before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 
									before:bg-yellow-600 dark:before:bg-yellow-400 before:transition-all before:duration-300
									${isActive ? 'before:w-full' : 'hover:before:w-full'}
								`}
							>
								{item.label}
								{isActive && (
									<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
								)}
							</Link>
						</li>
					);
				})}
			</ul>
			<div className="flex items-center gap-4 ">
				<button type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={isDark} className="cursor-pointer p-2">
					{isDark ? (
						<Image src="/images/sun.svg" alt="Sun Icon" width={24} height={24} className="w-6" />
					) : (
						<Image src="/images/moon.svg" alt="Moon Icon" width={20} height={20} className="w-5" />
					)}
				</button>
				<GradientButton 
					text="Contact Me" 
					href="/contact" 
					className="hidden lg:flex"
				/>
				<button className="block md:hidden ml-3" onClick={() => setSideMenuOpen(true)}>
					<Image src="/images/menu.svg" alt="Mobile Menu" width={24} height={24} className="w-8 dark:hidden" />
					<Image src="/images/menu-white.svg" alt="Mobile Menu" width={24} height={24} className="w-8 hidden dark:block" />
				</button>
			</div>
			{/* Side Menu */}
			{sideMenuOpen && (
				<>
				<ul id="sideMenu" className="flex md:hidden flex-col items-center justify-center gap-4 px-10 py-20 fixed right-0 top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 font-Outfit dark:bg-darkHover dark:text-white">
					<div className="absolute right-6 top-5" onClick={() => setSideMenuOpen(false)}>
						<Image src="/images/close.svg" alt="close side menu" width={24} height={24} className="w-6 cursor-pointer dark:hidden" />
						<Image src="/images/close-dark.svg" alt="close side menu" width={24} height={24} className="w-6 cursor-pointer hidden dark:block" />
					</div>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link 
									href={item.href} 
									onClick={() => setSideMenuOpen(false)}
									className={`
										relative px-4 py-2 rounded-lg transition-all duration-300 ease-in-out
										${isActive 
											? 'text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-100 dark:bg-yellow-900/30' 
											: 'text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
										}
									`}
								>
									{item.label}
									{isActive && (
										<span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-1 h-4 bg-yellow-600 dark:bg-yellow-400 rounded-full"></span>
									)}
								</Link>
							</li>
						);
					})}
					<li>
						<Link 
							href="/contact" 
							onClick={() => setSideMenuOpen(false)}
							className="text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out"
						>
							Contact Me
						</Link>
					</li>
				</ul>
				</>
			)}
		</nav>
	);
}
