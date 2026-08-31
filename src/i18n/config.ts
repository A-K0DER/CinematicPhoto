// Central registry of supported locales. Adding a locale here is only step 1,
// it must also be added to `locales` in astro.config.mjs, get a translation
// block in `src/i18n/ui.ts`, and a src/pages/<locale>/ folder with translated pages.

export interface LocaleInfo {
	/** BCP-47 language tag, must match astro.config.mjs `i18n.locales` and the src/pages/<code>/ folder name. */
	code: string;
	/** Native-language label shown in the language switcher, e.g. "Français". */
	label: string;
	/** og:locale / html lang value, e.g. "en_US". Defaults to `code` when omitted. */
	ogLocale?: string;
	dir?: 'ltr' | 'rtl';
	/**
	 * Set true once src/pages/<code>/ actually has translated pages. Until then the
	 * locale is registered for routing but excluded from hreflang tags and the
	 * language switcher, so we never point search engines or users at 404s.
	 */
	contentReady: boolean;
}

export const locales: LocaleInfo[] = [
	{ code: 'en', label: 'English', ogLocale: 'en_US', dir: 'ltr', contentReady: true },
	{ code: 'de', label: 'Deutsch', ogLocale: 'de_DE', dir: 'ltr', contentReady: true },
	{ code: 'fr', label: 'Français', ogLocale: 'fr_FR', dir: 'ltr', contentReady: false },
	{ code: 'es', label: 'Español', ogLocale: 'es_ES', dir: 'ltr', contentReady: false },
	{ code: 'ja', label: '日本語', ogLocale: 'ja_JP', dir: 'ltr', contentReady: false },
	{ code: 'nl', label: 'Nederlands', ogLocale: 'nl_NL', dir: 'ltr', contentReady: false },
	{ code: 'it', label: 'Italiano', ogLocale: 'it_IT', dir: 'ltr', contentReady: false },
	{ code: 'ko', label: '한국어', ogLocale: 'ko_KR', dir: 'ltr', contentReady: false },
	{ code: 'pt-br', label: 'Português (Brasil)', ogLocale: 'pt_BR', dir: 'ltr', contentReady: true },
	{ code: 'pt-pt', label: 'Português (Portugal)', ogLocale: 'pt_PT', dir: 'ltr', contentReady: false },
	{ code: 'sv', label: 'Svenska', ogLocale: 'sv_SE', dir: 'ltr', contentReady: false },
	{ code: 'da', label: 'Dansk', ogLocale: 'da_DK', dir: 'ltr', contentReady: false },
	{ code: 'nb', label: 'Norsk bokmål', ogLocale: 'nb_NO', dir: 'ltr', contentReady: true },
	{ code: 'fi', label: 'Suomi', ogLocale: 'fi_FI', dir: 'ltr', contentReady: false },
	{ code: 'pl', label: 'Polski', ogLocale: 'pl_PL', dir: 'ltr', contentReady: false },
];

export const defaultLocale = 'en';

export const localesByCode = Object.fromEntries(locales.map((l) => [l.code, l])) as Record<string, LocaleInfo>;

/** Locales that actually have translated pages, safe to advertise via hreflang and the language switcher. */
export const readyLocales = locales.filter((l) => l.contentReady);
