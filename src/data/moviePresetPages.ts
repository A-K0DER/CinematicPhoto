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
	joker: { slug: 'joker', label: 'Joker' },
	titanic: { slug: 'titanic', label: 'Titanic' },
	inception: { slug: 'inception', label: 'Inception' },
	'fight-club': { slug: 'fight-club', label: 'Fight Club' },
	shawshank: { slug: 'the-shawshank-redemption', label: 'The Shawshank Redemption' },
	gladiator: { slug: 'gladiator', label: 'Gladiator' },
	oppenheimer: { slug: 'oppenheimer', label: 'Oppenheimer' },
	'the-batman': { slug: 'the-batman', label: 'The Batman' },
	'pulp-fiction': { slug: 'pulp-fiction', label: 'Pulp Fiction' },
	'peaky-blinders': { slug: 'peaky-blinders', label: 'Peaky Blinders' },
};
