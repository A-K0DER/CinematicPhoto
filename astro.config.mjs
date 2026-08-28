// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://cinematicphoto.com',
	i18n: {
		defaultLocale: 'en',
		// Add more BCP-47 locale codes here once translated content lands — each
		// needs a matching src/pages/<locale>/ folder and an entry in src/i18n/config.ts.
		locales: ['en'],
		routing: {
			// English stays unprefixed at "/" — every other locale gets "/<locale>/".
			prefixDefaultLocale: false,
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
