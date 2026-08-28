// Shared UI copy (nav, footer, buttons) that repeats across pages, keyed by
// translation key then locale. Page-specific copy (headings, SEO text) lives
// in the page files themselves and gets translated page-by-page instead.
//
// Usage: const t = useTranslations(Astro.currentLocale); t('nav.allPresets')

export const ui = {
	'nav.allPresets': {
		en: 'All Presets',
	},
	'nav.home': {
		en: 'Home',
	},
} as const satisfies Record<string, Record<string, string>>;

export type UIKey = keyof typeof ui;
