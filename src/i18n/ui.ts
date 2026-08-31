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
		nb: 'Cinematic Photo hjem',
	},
	'nav.popularPresets': {
		en: 'Popular Presets',
		de: 'Beliebte Presets',
		nb: 'Populære presets',
	},
	'nav.guides': {
		en: 'Guides',
		de: 'Anleitungen',
		nb: 'Guider',
	},
	'nav.freeTools': {
		en: 'Free Tools',
		de: 'Kostenlose Tools',
		nb: 'Gratis verktøy',
	},
	'nav.video': {
		en: 'Video',
		de: 'Video',
		nb: 'Video',
	},
	'nav.menu': {
		en: 'Menu',
		de: 'Menü',
		nb: 'Meny',
	},
	'nav.openMenu': {
		en: 'Open menu',
		de: 'Menü öffnen',
		nb: 'Åpne meny',
	},
	'nav.closeMenu': {
		en: 'Close menu',
		de: 'Menü schließen',
		nb: 'Lukk meny',
	},
	'nav.noUploads': {
		en: 'no uploads · processed on-device',
		de: 'keine Uploads · lokal verarbeitet',
		nb: 'ingen opplasting · behandles på enheten',
	},
	'nav.switchTheme': {
		en: 'Switch theme',
		de: 'Design wechseln',
		nb: 'Bytt tema',
	},
	'nav.removeImage': {
		en: 'Remove image',
		de: 'Bild entfernen',
		nb: 'Fjern bilde',
	},
	'nav.removeVideo': {
		en: 'Remove video',
		de: 'Video entfernen',
		nb: 'Fjern video',
	},
	'nav.newImage': {
		en: 'New image',
		de: 'Neues Bild',
		nb: 'Nytt bilde',
	},
	'nav.newVideo': {
		en: 'New video',
		de: 'Neues Video',
		nb: 'Ny video',
	},
	'nav.export': {
		en: 'Export',
		de: 'Exportieren',
		nb: 'Eksporter',
	},
	'nav.download': {
		en: 'Download',
		de: 'Herunterladen',
		nb: 'Last ned',
	},
	'nav.guideCinematic': {
		en: 'Make Photos Look Cinematic',
		de: 'Fotos kinoreif machen',
		nb: 'Få bilder til å se filmatiske ut',
	},
	'nav.guideColorGrading': {
		en: 'Cinematic Color Grading',
		de: 'Filmisches Color Grading',
		nb: 'Filmatisk fargegrading',
	},
	'nav.guideSafeZones': {
		en: 'Social Media Safe Zones',
		de: 'Social-Media-Safe-Zones',
		nb: 'Safe zones for sosiale medier',
	},
	'nav.guideThumbnails': {
		en: 'YouTube Thumbnail Design',
		de: 'YouTube-Thumbnail-Design',
		nb: 'YouTube-thumbnail-design',
	},
	'nav.tiktokTemplate': {
		en: 'TikTok Safe Zone Template',
		de: 'TikTok-Safe-Zone-Vorlage',
		nb: 'TikTok Safe Zone-mal',
	},
	'nav.instagramTemplate': {
		en: 'Instagram Safe Zone Template',
		de: 'Instagram-Safe-Zone-Vorlage',
		nb: 'Instagram Safe Zone-mal',
	},
	'nav.tiktokChecker': {
		en: 'TikTok Safe Zone Checker',
		de: 'TikTok-Safe-Zone-Checker',
		nb: 'TikTok Safe Zone-sjekker',
	},
	'nav.instaChecker': {
		en: 'Insta Safe Zone Checker',
		de: 'Insta-Safe-Zone-Checker',
		nb: 'Insta Safe Zone-sjekker',
	},
	'nav.thumbnailPreview': {
		en: 'YouTube Thumbnail Preview',
		de: 'YouTube-Thumbnail-Vorschau',
		nb: 'YouTube-thumbnail-forhåndsvisning',
	},
	'footer.safeZoneGuide': {
		en: 'Safe Zone Guide',
		de: 'Safe-Zone-Anleitung',
		nb: 'Safe Zone-guide',
	},
	'footer.thumbnailGuide': {
		en: 'Thumbnail Design Guide',
		de: 'Thumbnail-Design-Anleitung',
		nb: 'Guide for thumbnail-design',
	},
	'footer.portraits': {
		en: 'Cinematic Portraits',
		de: 'Filmische Porträts',
		nb: 'Filmatiske portretter',
	},
	'footer.tiktokSafeZone': {
		en: 'TikTok Safe Zone',
		de: 'TikTok Safe Zone',
		nb: 'TikTok Safe Zone',
	},
	'footer.reelsSafeZone': {
		en: 'Reels Safe Zone',
		de: 'Reels Safe Zone',
		nb: 'Reels Safe Zone',
	},
	'footer.alternatives': {
		en: 'Alternatives',
		de: 'Alternativen',
		nb: 'Alternativer',
	},
	'footer.faq': {
		en: 'FAQ',
		de: 'FAQ',
		nb: 'FAQ',
	},
	'footer.aboutUs': {
		en: 'About Us',
		de: 'Über uns',
		nb: 'Om oss',
	},
	'footer.contactUs': {
		en: 'Contact Us',
		de: 'Kontakt',
		nb: 'Kontakt oss',
	},
	'footer.privacyPolicy': {
		en: 'Privacy Policy',
		de: 'Datenschutz',
		nb: 'Personvern',
	},
	'footer.termsAndConditions': {
		en: 'Terms & Conditions',
		de: 'AGB',
		nb: 'Vilkår og betingelser',
	},
	'footer.allRightsReserved': {
		en: 'All rights reserved.',
		de: 'Alle Rechte vorbehalten.',
		nb: 'Med enerett.',
	},
	'relatedPresets.exploreMore': {
		en: 'EXPLORE MORE',
		de: 'MEHR ENTDECKEN',
		nb: 'UTFORSK MER',
	},
	'relatedPresets.heading': {
		en: 'Related cinematic presets',
		de: 'Ähnliche filmische Presets',
		nb: 'Relaterte filmatiske presets',
	},
	'relatedPresets.browseAll': {
		en: 'Browse all 60 presets →',
		de: 'Alle 60 Presets ansehen →',
		nb: 'Se alle 60 presets →',
	},
} as const satisfies Record<string, Record<string, string>>;

export type UIKey = keyof typeof ui;
