import { ui, type UIKey } from './ui';
import { defaultLocale, readyLocales } from './config';

export function useTranslations(locale: string | undefined) {
	const lang = locale ?? defaultLocale;
	return function t(key: UIKey): string {
		const entry = ui[key] as Record<string, string>;
		return entry[lang] ?? entry[defaultLocale] ?? key;
	};
}

const pageModules = Object.keys(import.meta.glob('/src/pages/**/*.astro'));

function normalizePath(path: string) {
	const withLead = path.startsWith('/') ? path : `/${path}`;
	return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

/** Locale-neutral paths ("/faq/") that have a real page file under src/pages/<locale>/. */
const translatedPaths = new Map<string, Set<string>>();
for (const file of pageModules) {
	const match = file.match(/^\/src\/pages\/([^/]+)\/(.+)\.astro$/);
	if (!match || !readyLocales.some((l) => l.code === match[1])) continue;
	const rel = match[2].replace(/(^|\/)index$/, '');
	const set = translatedPaths.get(match[1]) ?? new Set<string>();
	set.add(normalizePath(rel));
	translatedPaths.set(match[1], set);
}

/** True when `locale` has its own page for `path`, false when it only renders the English fallback. */
export function hasLocalePage(locale: string, path: string) {
	if (locale === defaultLocale) return true;
	return translatedPaths.get(locale)?.has(normalizePath(path)) ?? false;
}

/** Absolute URLs for every locale variant of `path` that actually has content, for hreflang tags. Includes "x-default". */
export function getHreflangLinks(path: string, siteUrl: string) {
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	const links = readyLocales
		.filter((locale) => hasLocalePage(locale.code, path))
		.map((locale) => ({
			hreflang: locale.code,
			href: new URL(
				locale.code === defaultLocale ? normalizedPath : `/${locale.code}${normalizedPath}`,
				siteUrl
			).toString(),
		}));
	const defaultHref = new URL(normalizedPath, siteUrl).toString();
	return [...links, { hreflang: 'x-default', href: defaultHref }];
}
