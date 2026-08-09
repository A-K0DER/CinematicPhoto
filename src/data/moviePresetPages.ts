/**
 * Registry of presets that have a dedicated SEO landing page under /presets/<slug>/.
 * Keyed by preset id (src/lib/presets.ts) so other pages can look up the right
 * slug/label without hardcoding movie URLs in more than one place.
 */
export const MOVIE_PRESET_PAGES: Record<string, { slug: string; label: string }> = {
	'dark-knight': { slug: 'the-dark-knight', label: 'The Dark Knight' },
	'blade-runner': { slug: 'blade-runner-2049', label: 'Blade Runner 2049' },
	dune: { slug: 'dune', label: 'Dune' },
	interstellar: { slug: 'interstellar', label: 'Interstellar' },
	matrix: { slug: 'the-matrix', label: 'The Matrix' },
	'breaking-bad': { slug: 'breaking-bad', label: 'Breaking Bad' },
	'stranger-things': { slug: 'stranger-things', label: 'Stranger Things' },
	'game-of-thrones': { slug: 'game-of-thrones', label: 'Game of Thrones' },
};
