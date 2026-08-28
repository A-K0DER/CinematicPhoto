import { ui, type UIKey } from './ui';
import { defaultLocale, locales } from './config';

export function useTranslations(locale: string | undefined) {
	const lang = locale ?? defaultLocale;
	return function t(key: UIKey): string {
		const entry = ui[key] as Record<string, string>;
		return entry[lang] ?? entry[defaultLocale] ?? key;
	};
}

/** Absolute URLs for every locale variant of `path`, for hreflang tags. Includes "x-default". */
export function getHreflangLinks(path: string, siteUrl: string) {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const links = locales.map((locale) => ({
		hreflang: locale.code,
		href: new URL(
			locale.code === defaultLocale ? normalizedPath : `/${locale.code}${normalizedPath}`,
			siteUrl
		).toString(),
	}));
	const defaultHref = new URL(normalizedPath, siteUrl).toString();
	return [...links, { hreflang: 'x-default', href: defaultHref }];
}
