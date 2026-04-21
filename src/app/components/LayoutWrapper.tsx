"use client";
import { usePathname } from "next/navigation";
import HomeNavHeader from "./HomeNavHeader";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdmin = pathname?.startsWith('/admin');
	
	if (isAdmin) {
		return <main>{children}</main>;
	}
	
	return (
		<>
			<HomeNavHeader />
			<main className="pt-32">{children}</main>
			<Footer />
		</>
	);
}
