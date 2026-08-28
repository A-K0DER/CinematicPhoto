// Shared UI copy (nav, footer, buttons) that repeats across pages, keyed by
// translation key then locale. Page-specific copy (headings, SEO text) lives
// in the page files themselves and gets translated page-by-page instead.
//
// Usage: const t = useTranslations(Astro.currentLocale); t('nav.allPresets')

export const ui = {
	'nav.allPresets': {
		en: 'All Presets',
		de: 'Alle Presets',
		fr: 'Tous les préréglages',
		es: 'Todos los preajustes',
		ja: 'すべてのプリセット',
		nl: 'Alle presets',
		it: 'Tutti i preset',
		ko: '모든 프리셋',
		'pt-BR': 'Todos os presets',
		'pt-PT': 'Todas as predefinições',
		sv: 'Alla förinställningar',
		da: 'Alle forudindstillinger',
		nb: 'Alle forhåndsinnstillinger',
		fi: 'Kaikki esiasetukset',
		pl: 'Wszystkie presety',
	},
	'nav.home': {
		en: 'Home',
		de: 'Startseite',
		fr: 'Accueil',
		es: 'Inicio',
		ja: 'ホーム',
		nl: 'Home',
		it: 'Home',
		ko: '홈',
		'pt-BR': 'Início',
		'pt-PT': 'Início',
		sv: 'Hem',
		da: 'Hjem',
		nb: 'Hjem',
		fi: 'Etusivu',
		pl: 'Strona główna',
	},
} as const satisfies Record<string, Record<string, string>>;

export type UIKey = keyof typeof ui;
