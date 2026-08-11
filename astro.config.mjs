// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://cinematicphoto.com',
	integrations: [
		sitemap({
			filter: (page) => page !== 'https://cinematicphoto.com/editor/',
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
