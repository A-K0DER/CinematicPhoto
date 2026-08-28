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
	'nav.homeAriaLabel': {
		en: 'Cinematic Photo home',
		de: 'Cinematic Photo Startseite',
	},
	'nav.popularPresets': {
		en: 'Popular Presets',
		de: 'Beliebte Presets',
	},
	'nav.guides': {
		en: 'Guides',
		de: 'Anleitungen',
	},
	'nav.freeTools': {
		en: 'Free Tools',
		de: 'Kostenlose Tools',
	},
	'nav.video': {
		en: 'Video',
		de: 'Video',
	},
	'nav.menu': {
		en: 'Menu',
		de: 'Menü',
	},
	'nav.openMenu': {
		en: 'Open menu',
		de: 'Menü öffnen',
	},
	'nav.closeMenu': {
		en: 'Close menu',
		de: 'Menü schließen',
	},
	'nav.noUploads': {
		en: 'no uploads · processed on-device',
		de: 'keine Uploads · lokal verarbeitet',
	},
	'nav.switchTheme': {
		en: 'Switch theme',
		de: 'Design wechseln',
	},
	'nav.removeImage': {
		en: 'Remove image',
		de: 'Bild entfernen',
	},
	'nav.removeVideo': {
		en: 'Remove video',
		de: 'Video entfernen',
	},
	'nav.newImage': {
		en: 'New image',
		de: 'Neues Bild',
	},
	'nav.newVideo': {
		en: 'New video',
		de: 'Neues Video',
	},
	'nav.export': {
		en: 'Export',
		de: 'Exportieren',
	},
	'nav.download': {
		en: 'Download',
		de: 'Herunterladen',
	},
	'nav.guideCinematic': {
		en: 'Make Photos Look Cinematic',
		de: 'Fotos kinoreif machen',
	},
	'nav.guideColorGrading': {
		en: 'Cinematic Color Grading',
		de: 'Filmisches Color Grading',
	},
	'nav.guideSafeZones': {
		en: 'Social Media Safe Zones',
		de: 'Social-Media-Safe-Zones',
	},
	'nav.guideThumbnails': {
		en: 'YouTube Thumbnail Design',
		de: 'YouTube-Thumbnail-Design',
	},
	'nav.tiktokTemplate': {
		en: 'TikTok Safe Zone Template',
		de: 'TikTok-Safe-Zone-Vorlage',
	},
	'nav.instagramTemplate': {
		en: 'Instagram Safe Zone Template',
		de: 'Instagram-Safe-Zone-Vorlage',
	},
	'nav.tiktokChecker': {
		en: 'TikTok Safe Zone Checker',
		de: 'TikTok-Safe-Zone-Checker',
	},
	'nav.instaChecker': {
		en: 'Insta Safe Zone Checker',
		de: 'Insta-Safe-Zone-Checker',
	},
	'nav.thumbnailPreview': {
		en: 'YouTube Thumbnail Preview',
		de: 'YouTube-Thumbnail-Vorschau',
	},
	'footer.safeZoneGuide': {
		en: 'Safe Zone Guide',
		de: 'Safe-Zone-Anleitung',
	},
	'footer.thumbnailGuide': {
		en: 'Thumbnail Design Guide',
		de: 'Thumbnail-Design-Anleitung',
	},
	'footer.portraits': {
		en: 'Cinematic Portraits',
		de: 'Filmische Porträts',
	},
	'footer.tiktokSafeZone': {
		en: 'TikTok Safe Zone',
		de: 'TikTok Safe Zone',
	},
	'footer.reelsSafeZone': {
		en: 'Reels Safe Zone',
		de: 'Reels Safe Zone',
	},
	'footer.alternatives': {
		en: 'Alternatives',
		de: 'Alternativen',
	},
	'footer.faq': {
		en: 'FAQ',
		de: 'FAQ',
	},
	'footer.aboutUs': {
		en: 'About Us',
		de: 'Über uns',
	},
	'footer.contactUs': {
		en: 'Contact Us',
		de: 'Kontakt',
	},
	'footer.privacyPolicy': {
		en: 'Privacy Policy',
		de: 'Datenschutz',
	},
	'footer.termsAndConditions': {
		en: 'Terms & Conditions',
		de: 'AGB',
	},
	'footer.allRightsReserved': {
		en: 'All rights reserved.',
		de: 'Alle Rechte vorbehalten.',
	},
	'relatedPresets.exploreMore': {
		en: 'EXPLORE MORE',
		de: 'MEHR ENTDECKEN',
	},
	'relatedPresets.heading': {
		en: 'Related cinematic presets',
		de: 'Ähnliche filmische Presets',
	},
	'relatedPresets.browseAll': {
		en: 'Browse all 60 presets →',
		de: 'Alle 60 Presets ansehen →',
	},
} as const satisfies Record<string, Record<string, string>>;

export type UIKey = keyof typeof ui;
