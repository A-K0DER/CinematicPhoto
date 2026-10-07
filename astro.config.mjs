// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';

const localeCodes = ['de', 'fr', 'es', 'ja', 'nl', 'it', 'ko', 'pt-br', 'pt-pt', 'sv', 'da', 'nb', 'fi', 'pl'];
// Pages that should never be in the sitemap, in any locale.
const excluded = new Set(['/404/', '/500/', '/thank-you/', '/editor/', '/video-editor/']);

// Locale-neutral paths that have a real page file under src/pages/<locale>/.
const translated = new Map(
	localeCodes.map((code) => {
		let files = [];
		try {
			files = readdirSync(`./src/pages/${code}`, { recursive: true }).map(String);
		} catch {}
		const paths = files
			.filter((f) => f.endsWith('.astro'))
			.map((f) => ('/' + f.replace(/\.astro$/, '').replace(/(^|\/)index$/, '') + '/').replace(/\/+/g, '/'));
		return [code, new Set(paths)];
	})
);

function includeInSitemap(page) {
	const path = new URL(page).pathname;
	const locale = localeCodes.find((c) => path.startsWith(`/${c}/`));
	const neutral = locale ? path.slice(locale.length + 1) : path;
	if (excluded.has(neutral)) return false;
	return !locale || translated.get(locale)?.has(neutral) === true;
}

// https://astro.build/config
export default defineConfig({
	site: 'https://cinematicphoto.com',
	i18n: {
		defaultLocale: 'en',
		// Keep in sync with `locales` in src/i18n/config.ts. Each non-default
		// locale gets a src/pages/<locale>/ folder once its pages are translated.
		locales: ['en', 'de', 'fr', 'es', 'ja', 'nl', 'it', 'ko', 'pt-br', 'pt-pt', 'sv', 'da', 'nb', 'fi', 'pl'],
		routing: {
			// English stays unprefixed at "/", every other locale gets "/<locale>/".
			prefixDefaultLocale: false,
			// Missing pages in a locale render the default locale's content at the
			// requested URL instead of 404ing, so partially translated locales stay usable.
			fallbackType: 'rewrite',
		},
		// Add an entry here as soon as a locale goes live (its contentReady flips
		// to true in src/i18n/config.ts), so untranslated pages fall back to English.
		fallback: {
			de: 'en',
			nb: 'en',
			'pt-br': 'en',
		},
	},
	integrations: [
		sitemap({
			filter: includeInSitemap,
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
