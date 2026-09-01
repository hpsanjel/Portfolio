"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
	const t = useTranslations("Nav");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const nextLocale = locale === "en" ? "nb" : "en";

	function switchLocale() {
		router.replace(pathname, { locale: nextLocale });
	}

	return (
		<button
			type="button"
			onClick={switchLocale}
			aria-label={t("switchLanguage")}
			className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-white/15 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200"
		>
			{nextLocale === "nb" ? "NO" : "EN"}
		</button>
	);
}
