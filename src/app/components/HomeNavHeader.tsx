"use client";
import React, { useState } from "react";
import Image from "next/image";
import useThemeToggle from "../hooks/useThemeToggle";
import Link from "next/link";
import GradientButton from "./GradientButton";

export default function HomeNavHeader() {
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const { isDark, toggleTheme } = useThemeToggle();

	return (
		<nav className="w-full fixed px-5 lg:px-8 xl:px-[8%] py-8 flex items-center justify-between z-50 bg-white dark:bg-[#0f0b1a]/90 dark:backdrop-blur-md shadow-sm">
			<div className="flex items-center bg-white dark:bg-transparent rounded-full px-4 py-3 shadow-sm">
				<Link href="/">
					<Image src="/images/logo-black.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer dark:hidden" />
				</Link>
				<Link href="/">
					<Image src="/images/logo-white.png" alt="logo" width={96} height={40} className="w-24 cursor-pointer hidden dark:block" />
				</Link>
			</div>
			<ul className="hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 bg-white shadow-sm font-Outfit dark:border dark:border-white/50 dark:bg-transparent">
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
			<div className="flex items-center gap-4 ">
				<button type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={isDark} className="cursor-pointer p-2 bg-white dark:bg-transparent rounded-full px-4 py-3 shadow-sm">
					{isDark ? (
						<Image src="/images/sun.svg" alt="Sun Icon" width={24} height={24} className="w-6" />
					) : (
						<Image src="/images/moon.svg" alt="Moon Icon" width={20} height={20} className="w-5" />
					)}
				</button>
				<GradientButton 
					text="Contact" 
					href="/contact" 
					className="hidden lg:flex ml-4"
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
				</>
			)}
		</nav>
	);
}
