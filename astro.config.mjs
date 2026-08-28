// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://cinematicphoto.com',
	i18n: {
		defaultLocale: 'en',
		// Keep in sync with `locales` in src/i18n/config.ts. Each non-default
		// locale gets a src/pages/<locale>/ folder once its pages are translated.
		locales: ['en', 'de', 'fr', 'es', 'ja', 'nl', 'it', 'ko', 'pt-BR', 'pt-PT', 'sv', 'da', 'nb', 'fi', 'pl'],
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
		},
	},
	integrations: [
		sitemap({
			filter: (page) =>
				page !== 'https://cinematicphoto.com/editor/' && page !== 'https://cinematicphoto.com/video-editor/',
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
