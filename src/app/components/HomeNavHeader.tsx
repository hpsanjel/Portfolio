"use client";
import React, { useState } from "react";
import Image from "next/image";
import useThemeToggle from "../hooks/useThemeToggle";
import Link from "next/link";

export default function HomeNavHeader() {
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const { isDark, toggleTheme } = useThemeToggle();

	return (
		<nav className="w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 bg-transparent dark:bg-[#0f0b1a]/90 dark:backdrop-blur-md">
			<div className="flex items-center">
				<Link href="/">
					<Image src="/images/logo-black.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer mr-14 dark:hidden" />
				</Link>
				<Link href="/">
					<Image src="/images/logo-white.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer mr-14 hidden dark:block" />
				</Link>
			</div>
			<ul className="hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 bg-white shadow-sm bg-opacity-50 font-Outfit dark:border dark:border-white/50 dark:bg-transparent">
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/about">About Me</Link>
				</li>
				<li>
					<Link href="/services">Services</Link>
				</li>
				<li>
					<Link href="/projects">Projects</Link>
				</li>
				<li>
					<Link href="/blog">Blogs</Link>
				</li>
			</ul>
			<div className="flex items-center gap-4">
				<button type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={isDark} className="cursor-pointer p-2">
					{isDark ? (
						<Image src="/images/sun.svg" alt="Sun Icon" width={24} height={24} className="w-6" />
					) : (
						<Image src="/images/moon.svg" alt="Moon Icon" width={20} height={20} className="w-5" />
					)}
				</button>
				<Link href="/contact" className="hidden lg:flex items-center gap-3 px-10 py-2.5 border border-gray-500 rounded-full ml-4 font-Outfit dark:border-white/50 hover:bg-black/10 dark:hover:bg-purple-400/15 duration-500">
					Contact
					<Image src="/images/arrow-right.svg" alt="Phone Icon" width={16} height={16} className="w-4 dark:hidden" />
					<Image src="/images/arrow-right-white.svg" alt="Phone Icon" width={16} height={16} className="w-4 hidden dark:block" />
				</Link>
				<button className="block md:hidden ml-3" onClick={() => setSideMenuOpen(true)}>
					<Image src="/images/menu.svg" alt="Mobile Menu" width={24} height={24} className="w-6 dark:hidden" />
					<Image src="/images/menu-white.svg" alt="Mobile Menu" width={24} height={24} className="w-6 hidden dark:block" />
				</button>
			</div>
			{/* Side Menu */}
			{sideMenuOpen && (
				<ul id="sideMenu" className="flex md:hidden flex-col items-center justify-center gap-4 px-10 py-20 fixed right-0 top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 font-Outfit dark:bg-darkHover dark:text-white">
					<div className="absolute right-6 top-5" onClick={() => setSideMenuOpen(false)}>
						<Image src="/images/close.svg" alt="close side menu" width={24} height={24} className="w-6 cursor-pointer dark:hidden" />
						<Image src="/images/close-dark.svg" alt="close side menu" width={24} height={24} className="w-6 cursor-pointer hidden dark:block" />
					</div>
					<li>
						<Link href="/" onClick={() => setSideMenuOpen(false)}>
							Home
						</Link>
					</li>
					<li>
						<Link href="/about" onClick={() => setSideMenuOpen(false)}>
							About Me
						</Link>
					</li>
					<li>
						<Link href="/services" onClick={() => setSideMenuOpen(false)}>
							Services
						</Link>
					</li>
					<li>
						<Link href="/projects" onClick={() => setSideMenuOpen(false)}>
							Projects
						</Link>
					</li>
					<li>
						<Link href="/blog" onClick={() => setSideMenuOpen(false)}>
							Blogs
						</Link>
					</li>
					<li>
						<Link href="/contact" onClick={() => setSideMenuOpen(false)}>
							Contact Me
						</Link>
					</li>
				</ul>
			)}
		</nav>
	);
}
