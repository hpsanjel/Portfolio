import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export default function useThemeToggle() {
	const [theme, setTheme] = useState<ThemeMode>("light");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme");
			if (savedTheme === "dark" || savedTheme === "light") {
				setTheme(savedTheme);
				if (savedTheme === "dark") {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			} else {
				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				setTheme(prefersDark ? "dark" : "light");
				if (prefersDark) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			localStorage.setItem("theme", theme);
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return {
		theme,
		isDark: theme === "dark",
		toggleTheme,
	};
}
