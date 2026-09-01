export type SupportedLocale = "en" | "nb";

type WithTranslations<TFields extends string> = {
	translations?: {
		nb?: Partial<Record<TFields, string>>;
	};
} & Record<string, unknown>;

/**
 * Returns a shallow copy of `doc` with each field in `fields` replaced by its
 * `translations.nb.<field>` value when `locale` is "nb" and that translation
 * exists — falling back to the original (English) value otherwise. Existing
 * documents without a `translations` key are unaffected, so untranslated
 * entries render in English for Norwegian visitors rather than blank.
 */
export function localizeDoc<T extends WithTranslations<TFields>, TFields extends string>(doc: T, locale: SupportedLocale, fields: TFields[]): T {
	if (locale !== "nb" || !doc?.translations?.nb) return doc;

	const nb = doc.translations.nb;
	const localized = { ...doc };
	for (const field of fields) {
		const value = nb[field];
		if (value) {
			(localized as Record<string, unknown>)[field] = value;
		}
	}
	return localized;
}

export function localizeDocs<T extends WithTranslations<TFields>, TFields extends string>(docs: T[], locale: SupportedLocale, fields: TFields[]): T[] {
	return docs.map((doc) => localizeDoc(doc, locale, fields));
}

export function parseLocale(value: string | null): SupportedLocale {
	return value === "nb" ? "nb" : "en";
}
