"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import HomeNavHeader from "./HomeNavHeader";
import TopInfoBar from "./TopInfoBar";
import Footer from "./Footer";

function getSessionId(): string {
	if (typeof window === "undefined") return "";
	let id = localStorage.getItem("session_id");
	if (!id) {
		id = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
		localStorage.setItem("session_id", id);
	}
	return id;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdmin = pathname?.startsWith('/admin');

	useEffect(() => {
		if (isAdmin || !pathname) return;
		const sessionId = getSessionId();
		fetch("/api/analytics", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ path: pathname, sessionId }),
		}).catch(() => {});
	}, [pathname, isAdmin]);

	if (isAdmin) {
		return <main>{children}</main>;
	}
	
	return (
		<>
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<TopInfoBar />
			<HomeNavHeader />
			<main id="main-content" className="pt-40 sm:pt-41">
				{children}
			</main>
			<Footer />
		</>
	);
}
