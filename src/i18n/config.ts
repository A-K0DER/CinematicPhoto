// Central registry of supported locales. Adding a locale here is only step 1 —
// it must also be added to `locales` in astro.config.mjs, get a translation
// block in `src/i18n/ui.ts`, and (unless routing.fallbackType is left as the
// default "redirect") a src/pages/<locale>/ folder with translated pages.

export interface LocaleInfo {
	/** BCP-47 language tag, must match astro.config.mjs `i18n.locales` and the src/pages/<code>/ folder name. */
	code: string;
	/** Native-language label shown in the language switcher, e.g. "Français". */
	label: string;
	/** og:locale / html lang value, e.g. "en_US". Defaults to `code` when omitted. */
	ogLocale?: string;
	dir?: 'ltr' | 'rtl';
}

export const locales: LocaleInfo[] = [{ code: 'en', label: 'English', ogLocale: 'en_US', dir: 'ltr' }];

export const defaultLocale = 'en';

export const localesByCode = Object.fromEntries(locales.map((l) => [l.code, l])) as Record<string, LocaleInfo>;
