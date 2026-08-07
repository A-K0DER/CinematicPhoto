export interface PresetOverlay {
	type: 'linear' | 'radial' | 'solid';
	/** Degrees, only used for type: 'linear'. 0 = top-to-bottom. */
	angle?: number;
	/** [shadowColor, highlightColor]. Only stops[0] is used for type: 'solid'. */
	stops: [string, string];
	blend: GlobalCompositeOperation;
	opacity: number;
}

export interface PresetHaze {
	color: string;
	opacity: number;
}

export interface CinematicPreset {
	id: string;
	name: string;
	tagline: string;
	genre: string;
	/** CSS filter string applied to the base image draw. */
	filter: string;
	overlay: PresetOverlay;
	haze?: PresetHaze;
	defaults: { grain: number; vignette: number; glow: number };
}

export const ORIGINAL_PRESET: CinematicPreset = {
	id: 'original',
	name: 'Original',
	tagline: 'No grade applied',
	genre: 'None',
	filter: 'none',
	overlay: { type: 'solid', stops: ['#000000', '#000000'], blend: 'source-over', opacity: 0 },
	defaults: { grain: 0, vignette: 0, glow: 0 },
};

export const GENRES = [
	'Thriller & Mystery',
	'Crime',
	'Sci-Fi',
	'Drama',
	'War & History',
	'Fantasy & Adventure',
	'Action',
	'Superhero',
] as const;

export const FEATURED_PRESET_IDS = ['shawshank', 'dark-knight', 'inception', 'fight-club', 'interstellar'];

export const PRESETS: CinematicPreset[] = [
	// --- Thriller & Mystery ---
	{
		id: 'fight-club',
		name: 'Fight Club',
		tagline: 'Sickly yellow-green, gritty 90s',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.25) saturate(0.75) brightness(0.94) sepia(0.15)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a1f0a', '#8a8f3d'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 34, vignette: 30, glow: 6 },
	},
	{
		id: 'seven',
		name: 'Se7en',
		tagline: 'Rain-soaked grime, crushed blacks',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.35) saturate(0.55) brightness(0.82)',
		overlay: { type: 'linear', angle: 90, stops: ['#0d1408', '#3a3524'], blend: 'multiply', opacity: 0.35 },
		defaults: { grain: 30, vignette: 50, glow: 4 },
	},
	{
		id: 'silence-of-the-lambs',
		name: 'The Silence of the Lambs',
		tagline: 'Clinical cold, institutional dread',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.15) saturate(0.7) brightness(0.95)',
		overlay: { type: 'linear', angle: 90, stops: ['#10151a', '#4a5560'], blend: 'overlay', opacity: 0.32 },
		defaults: { grain: 18, vignette: 38, glow: 6 },
	},
	{
		id: 'shutter-island',
		name: 'Shutter Island',
		tagline: 'Stormy noir, sickly institution',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.3) saturate(0.65) brightness(0.9)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a1620', '#3d4a3a'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 24, vignette: 44, glow: 10 },
	},
	{
		id: 'the-prestige',
		name: 'The Prestige',
		tagline: 'Gaslit Victorian, cool and amber',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.2) saturate(0.85) brightness(0.96) sepia(0.08)',
		overlay: { type: 'linear', angle: 90, stops: ['#0c1a22', '#8a6a3a'], blend: 'soft-light', opacity: 0.4 },
		defaults: { grain: 20, vignette: 36, glow: 14 },
	},
	{
		id: 'memento',
		name: 'Memento',
		tagline: 'Stark bleach, punchy clarity',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.28) saturate(1.05) brightness(1.05)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a1a1a', '#c9c2b0'], blend: 'soft-light', opacity: 0.28 },
		defaults: { grain: 16, vignette: 26, glow: 12 },
	},
	{
		id: 'usual-suspects',
		name: 'The Usual Suspects',
		tagline: 'Amber interrogation, noir shadow',
		genre: 'Thriller & Mystery',
		filter: 'contrast(1.22) saturate(0.85) brightness(0.9) sepia(0.12)',
		overlay: { type: 'linear', angle: 90, stops: ['#160f08', '#5a4326'], blend: 'overlay', opacity: 0.38 },
		defaults: { grain: 22, vignette: 40, glow: 10 },
	},

	// --- Crime ---
	{
		id: 'pulp-fiction',
		name: 'Pulp Fiction',
		tagline: 'Pulpy amber-red, retro diner',
		genre: 'Crime',
		filter: 'contrast(1.25) saturate(1.35) brightness(1.02) sepia(0.1)',
		overlay: { type: 'linear', angle: 90, stops: ['#2a0e08', '#e0762e'], blend: 'overlay', opacity: 0.36 },
		defaults: { grain: 20, vignette: 30, glow: 14 },
	},
	{
		id: 'django-unchained',
		name: 'Django Unchained',
		tagline: 'Sunbaked western, blood and gold',
		genre: 'Crime',
		filter: 'contrast(1.2) saturate(1.25) brightness(1.05) sepia(0.28)',
		overlay: { type: 'linear', angle: 90, stops: ['#2e1a08', '#f0a94a'], blend: 'soft-light', opacity: 0.42 },
		defaults: { grain: 24, vignette: 24, glow: 16 },
	},
	{
		id: 'joker',
		name: 'Joker',
		tagline: 'Grimy Gotham, sickly orange-green',
		genre: 'Crime',
		filter: 'contrast(1.32) saturate(0.9) brightness(0.88) sepia(0.18)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a0f04', '#c25a1e'], blend: 'overlay', opacity: 0.44 },
		defaults: { grain: 32, vignette: 46, glow: 12 },
	},
	{
		id: 'the-departed',
		name: 'The Departed',
		tagline: 'Cold Boston steel, gritty blue',
		genre: 'Crime',
		filter: 'contrast(1.18) saturate(0.72) brightness(0.94)',
		overlay: { type: 'linear', angle: 90, stops: ['#0e1418', '#3a4652'], blend: 'overlay', opacity: 0.34 },
		defaults: { grain: 22, vignette: 32, glow: 6 },
	},
	{
		id: 'goodfellas',
		name: 'GoodFellas',
		tagline: 'Warm 70s film, nightclub gold',
		genre: 'Crime',
		filter: 'contrast(1.15) saturate(1.2) brightness(1.04) sepia(0.2)',
		overlay: { type: 'linear', angle: 90, stops: ['#26160a', '#d99a4a'], blend: 'soft-light', opacity: 0.36 },
		defaults: { grain: 30, vignette: 22, glow: 18 },
	},
	{
		id: 'leon-the-professional',
		name: 'Léon: The Professional',
		tagline: 'Gritty NYC amber-green',
		genre: 'Crime',
		filter: 'contrast(1.2) saturate(0.95) brightness(0.96) sepia(0.14)',
		overlay: { type: 'linear', angle: 90, stops: ['#151a0a', '#7a6a2e'], blend: 'overlay', opacity: 0.34 },
		defaults: { grain: 24, vignette: 36, glow: 10 },
	},

	// --- Sci-Fi ---
	{
		id: 'inception',
		name: 'Inception',
		tagline: 'Cool steel dream, crisp Nolan',
		genre: 'Sci-Fi',
		filter: 'contrast(1.22) saturate(0.78) brightness(0.98)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a1420', '#33506e'], blend: 'overlay', opacity: 0.38 },
		defaults: { grain: 12, vignette: 34, glow: 14 },
	},
	{
		id: 'matrix',
		name: 'Matrix',
		tagline: 'High-gain digital green',
		genre: 'Sci-Fi',
		filter: 'grayscale(1) contrast(1.4) brightness(0.94)',
		overlay: { type: 'solid', stops: ['#12ff6a', '#12ff6a'], blend: 'color', opacity: 0.85 },
		defaults: { grain: 20, vignette: 40, glow: 14 },
	},
	{
		id: 'dune',
		name: 'Dune',
		tagline: 'Desert gold, blown highlights',
		genre: 'Sci-Fi',
		filter: 'sepia(0.42) saturate(1.15) contrast(1.08) brightness(1.08)',
		overlay: { type: 'linear', angle: 90, stops: ['#3a2c14', '#f0c987'], blend: 'soft-light', opacity: 0.55 },
		defaults: { grain: 30, vignette: 22, glow: 20 },
	},
	{
		id: 'interstellar',
		name: 'Interstellar',
		tagline: 'Cold cosmic blue, deep blacks',
		genre: 'Sci-Fi',
		filter: 'saturate(0.58) contrast(1.18) brightness(0.92)',
		overlay: { type: 'linear', angle: 90, stops: ['#050912', '#28405e'], blend: 'overlay', opacity: 0.42 },
		defaults: { grain: 14, vignette: 42, glow: 16 },
	},
	{
		id: 'terminator-2',
		name: 'Terminator 2: Judgment Day',
		tagline: 'Industrial steel, cold 90s action',
		genre: 'Sci-Fi',
		filter: 'contrast(1.28) saturate(0.7) brightness(0.92)',
		overlay: { type: 'linear', angle: 90, stops: ['#080e14', '#4a5a68'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 18, vignette: 34, glow: 10 },
	},
	{
		id: 'v-for-vendetta',
		name: 'V for Vendetta',
		tagline: 'Dystopian grey, single red',
		genre: 'Sci-Fi',
		filter: 'contrast(1.24) saturate(0.6) brightness(0.9)',
		overlay: { type: 'linear', angle: 90, stops: ['#0c1014', '#3a2426'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 20, vignette: 42, glow: 8 },
	},

	// --- Drama ---
	{
		id: 'shawshank',
		name: 'The Shawshank Redemption',
		tagline: 'Warm 35mm, restrained gold',
		genre: 'Drama',
		filter: 'sepia(0.18) saturate(0.82) contrast(1.14) brightness(1.03)',
		overlay: { type: 'linear', angle: 90, stops: ['#241c12', '#e8c988'], blend: 'soft-light', opacity: 0.38 },
		defaults: { grain: 28, vignette: 34, glow: 10 },
	},
	{
		id: 'forrest-gump',
		name: 'Forrest Gump',
		tagline: 'Warm Americana, golden nostalgia',
		genre: 'Drama',
		filter: 'contrast(1.08) saturate(1.1) brightness(1.05) sepia(0.16)',
		overlay: { type: 'linear', angle: 90, stops: ['#241a0e', '#f0cf8e'], blend: 'soft-light', opacity: 0.34 },
		defaults: { grain: 18, vignette: 20, glow: 16 },
	},
	{
		id: 'the-green-mile',
		name: 'The Green Mile',
		tagline: 'Sepia prison, restrained gold',
		genre: 'Drama',
		filter: 'sepia(0.22) saturate(0.85) contrast(1.16) brightness(1.0)',
		overlay: { type: 'linear', angle: 90, stops: ['#221808', '#c8a35e'], blend: 'soft-light', opacity: 0.36 },
		defaults: { grain: 26, vignette: 36, glow: 10 },
	},
	{
		id: 'titanic',
		name: 'Titanic',
		tagline: 'Oceanic teal, romantic epic',
		genre: 'Drama',
		filter: 'contrast(1.14) saturate(1.05) brightness(1.0)',
		overlay: { type: 'linear', angle: 90, stops: ['#08161c', '#2e5a68'], blend: 'overlay', opacity: 0.36 },
		defaults: { grain: 14, vignette: 24, glow: 18 },
	},
	{
		id: 'the-truman-show',
		name: 'The Truman Show',
		tagline: 'Bright sitcom pastel, artificial perfect',
		genre: 'Drama',
		filter: 'contrast(1.1) saturate(1.3) brightness(1.08)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a2436', '#9fd0e8'], blend: 'soft-light', opacity: 0.3 },
		defaults: { grain: 8, vignette: 14, glow: 20 },
	},
	{
		id: 'american-beauty',
		name: 'American Beauty',
		tagline: 'Muted suburbia, rose-petal red',
		genre: 'Drama',
		filter: 'contrast(1.15) saturate(0.85) brightness(0.98)',
		overlay: { type: 'linear', angle: 90, stops: ['#140a0a', '#7a1f1f'], blend: 'overlay', opacity: 0.3 },
		defaults: { grain: 16, vignette: 28, glow: 8 },
	},
	{
		id: 'american-history-x',
		name: 'American History X',
		tagline: 'Harsh steel-grey, stark contrast',
		genre: 'Drama',
		filter: 'grayscale(0.35) contrast(1.35) saturate(0.7) brightness(0.92)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a0a0a', '#3a3a3a'], blend: 'overlay', opacity: 0.32 },
		defaults: { grain: 26, vignette: 40, glow: 6 },
	},

	// --- War & History ---
	{
		id: 'inglourious-basterds',
		name: 'Inglourious Basterds',
		tagline: 'Sunbleached pulp, rich reds',
		genre: 'War & History',
		filter: 'contrast(1.2) saturate(1.15) brightness(1.02) sepia(0.18)',
		overlay: { type: 'linear', angle: 90, stops: ['#241608', '#d98a3a'], blend: 'soft-light', opacity: 0.38 },
		defaults: { grain: 22, vignette: 28, glow: 14 },
	},
	{
		id: 'saving-private-ryan',
		name: 'Saving Private Ryan',
		tagline: 'Bleach-bypass grey, war documentary',
		genre: 'War & History',
		filter: 'saturate(0.35) contrast(1.4) brightness(0.9) sepia(0.06)',
		overlay: { type: 'linear', angle: 90, stops: ['#0e120c', '#3e4636'], blend: 'overlay', opacity: 0.36 },
		defaults: { grain: 36, vignette: 38, glow: 6 },
	},
	{
		id: 'schindlers-list',
		name: "Schindler's List",
		tagline: 'Near-monochrome, restrained warmth',
		genre: 'War & History',
		filter: 'grayscale(0.75) contrast(1.25) saturate(0.4) brightness(0.96)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a0a0a', '#2e2a24'], blend: 'overlay', opacity: 0.3 },
		defaults: { grain: 24, vignette: 34, glow: 6 },
	},
	{
		id: 'braveheart',
		name: 'Braveheart',
		tagline: 'Muted highlands, overcast epic',
		genre: 'War & History',
		filter: 'contrast(1.16) saturate(0.72) brightness(0.94)',
		overlay: { type: 'linear', angle: 90, stops: ['#10140c', '#3e4a34'], blend: 'overlay', opacity: 0.34 },
		defaults: { grain: 20, vignette: 30, glow: 8 },
	},
	{
		id: 'oppenheimer',
		name: 'Oppenheimer',
		tagline: 'Desert amber, stark Nolan contrast',
		genre: 'War & History',
		filter: 'contrast(1.35) saturate(0.8) brightness(0.95) sepia(0.1)',
		overlay: { type: 'linear', angle: 90, stops: ['#120c06', '#c99552'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 22, vignette: 38, glow: 12 },
	},
	{
		id: 'the-imitation-game',
		name: 'The Imitation Game',
		tagline: 'Restrained tweed, cool period grey',
		genre: 'War & History',
		filter: 'contrast(1.14) saturate(0.68) brightness(0.98)',
		overlay: { type: 'linear', angle: 90, stops: ['#10141a', '#454e5a'], blend: 'overlay', opacity: 0.3 },
		defaults: { grain: 16, vignette: 28, glow: 8 },
	},

	// --- Fantasy & Adventure ---
	{
		id: 'fellowship-of-the-ring',
		name: 'The Lord of the Rings: The Fellowship of the Ring',
		tagline: 'Mythic green-gold, epic scale',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.18) saturate(1.15) brightness(1.0)',
		overlay: { type: 'linear', angle: 90, stops: ['#0e1608', '#7a9450'], blend: 'soft-light', opacity: 0.34 },
		defaults: { grain: 16, vignette: 26, glow: 14 },
	},
	{
		id: 'pirates-of-the-caribbean',
		name: 'Pirates of the Caribbean: The Curse of the Black Pearl',
		tagline: 'High-seas teal, sunlit gold',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.2) saturate(1.2) brightness(1.02)',
		overlay: { type: 'linear', angle: 90, stops: ['#08181c', '#2e6a72'], blend: 'overlay', opacity: 0.32 },
		defaults: { grain: 14, vignette: 24, glow: 16 },
	},
	{
		id: 'spirited-away',
		name: 'Spirited Away',
		tagline: 'Dreamy jewel tones, lantern glow',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.12) saturate(1.3) brightness(1.02)',
		overlay: { type: 'linear', angle: 90, stops: ['#140a26', '#e89a4a'], blend: 'soft-light', opacity: 0.3 },
		defaults: { grain: 6, vignette: 18, glow: 22 },
	},
	{
		id: 'harry-potter-goblet-of-fire',
		name: 'Harry Potter and the Goblet of Fire',
		tagline: 'Gothic blue, firelit gold',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.18) saturate(0.92) brightness(0.96)',
		overlay: { type: 'linear', angle: 90, stops: ['#0e1420', '#5a4a2e'], blend: 'overlay', opacity: 0.34 },
		defaults: { grain: 16, vignette: 32, glow: 14 },
	},
	{
		id: 'pans-labyrinth',
		name: "Pan's Labyrinth",
		tagline: 'Dark fairy-tale, amber fantasy',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.24) saturate(1.1) brightness(0.9)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a180e', '#8a5a2a'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 22, vignette: 42, glow: 16 },
	},
	{
		id: 'life-of-pi',
		name: 'Life of Pi',
		tagline: 'Vivid ocean blue, sunset orange',
		genre: 'Fantasy & Adventure',
		filter: 'contrast(1.14) saturate(1.35) brightness(1.04)',
		overlay: { type: 'linear', angle: 90, stops: ['#08141c', '#e87a3a'], blend: 'soft-light', opacity: 0.32 },
		defaults: { grain: 8, vignette: 18, glow: 22 },
	},

	// --- Action ---
	{
		id: 'gladiator',
		name: 'Gladiator',
		tagline: 'Bleached sand, golden arena',
		genre: 'Action',
		filter: 'contrast(1.2) saturate(0.75) brightness(1.0) sepia(0.22)',
		overlay: { type: 'linear', angle: 90, stops: ['#1e1508', '#c9a262'], blend: 'soft-light', opacity: 0.38 },
		defaults: { grain: 20, vignette: 32, glow: 12 },
	},
	{
		id: 'kill-bill',
		name: 'Kill Bill: Vol. 1',
		tagline: 'Pulpy yellow pop, grindhouse punch',
		genre: 'Action',
		filter: 'contrast(1.3) saturate(1.4) brightness(1.02)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a1404', '#e8d23a'], blend: 'overlay', opacity: 0.3 },
		defaults: { grain: 26, vignette: 24, glow: 10 },
	},
	{
		id: 'mad-max-fury-road',
		name: 'Mad Max: Fury Road',
		tagline: 'Orange and teal, desert fury',
		genre: 'Action',
		filter: 'contrast(1.4) saturate(1.5) brightness(1.02)',
		overlay: { type: 'linear', angle: 90, stops: ['#062824', '#e0651e'], blend: 'overlay', opacity: 0.46 },
		defaults: { grain: 20, vignette: 30, glow: 20 },
	},
	{
		id: 'the-revenant',
		name: 'The Revenant',
		tagline: 'Cold wilderness, harsh survival',
		genre: 'Action',
		filter: 'contrast(1.2) saturate(0.68) brightness(0.9)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a1216', '#3a4a4a'], blend: 'overlay', opacity: 0.36 },
		defaults: { grain: 24, vignette: 36, glow: 8 },
	},
	{
		id: 'top-gun-maverick',
		name: 'Top Gun: Maverick',
		tagline: 'Glossy sky-blue, sunset amber',
		genre: 'Action',
		filter: 'contrast(1.2) saturate(1.25) brightness(1.05)',
		overlay: { type: 'linear', angle: 90, stops: ['#081c2a', '#e8823a'], blend: 'overlay', opacity: 0.32 },
		defaults: { grain: 8, vignette: 20, glow: 18 },
	},
	{
		id: 'baby-driver',
		name: 'Baby Driver',
		tagline: 'Punchy pop-color, sun-flared streets',
		genre: 'Action',
		filter: 'contrast(1.22) saturate(1.3) brightness(1.04)',
		overlay: { type: 'linear', angle: 90, stops: ['#160c1c', '#e8546a'], blend: 'overlay', opacity: 0.3 },
		defaults: { grain: 14, vignette: 22, glow: 20 },
	},

	// --- Superhero ---
	{
		id: 'dark-knight',
		name: 'The Dark Knight',
		tagline: 'Crushed blacks, cold steel',
		genre: 'Superhero',
		filter: 'contrast(1.38) saturate(0.68) brightness(0.86) blur(0)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a2a2e', '#333a26'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 22, vignette: 48, glow: 8 },
	},
	{
		id: 'deadpool',
		name: 'Deadpool',
		tagline: 'Punchy red-black, comic irreverence',
		genre: 'Superhero',
		filter: 'contrast(1.28) saturate(1.35) brightness(1.0)',
		overlay: { type: 'linear', angle: 90, stops: ['#1a0508', '#c21e2e'], blend: 'overlay', opacity: 0.36 },
		defaults: { grain: 16, vignette: 28, glow: 14 },
	},
	{
		id: 'spider-man',
		name: 'Spider-Man',
		tagline: 'Bright primary pop, NYC daylight',
		genre: 'Superhero',
		filter: 'contrast(1.15) saturate(1.3) brightness(1.05)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a1a30', '#c9283e'], blend: 'overlay', opacity: 0.28 },
		defaults: { grain: 12, vignette: 20, glow: 16 },
	},
	{
		id: 'the-batman',
		name: 'The Batman',
		tagline: 'Crimson-black noir, rain-soaked Gotham',
		genre: 'Superhero',
		filter: 'contrast(1.35) saturate(0.85) brightness(0.82)',
		overlay: { type: 'linear', angle: 90, stops: ['#0a0608', '#5a1420'], blend: 'overlay', opacity: 0.46 },
		defaults: { grain: 24, vignette: 48, glow: 10 },
	},
	{
		id: 'x-men-first-class',
		name: 'X-Men: First Class',
		tagline: 'Retro steel-blue, Cold War amber',
		genre: 'Superhero',
		filter: 'contrast(1.18) saturate(0.95) brightness(0.98) sepia(0.08)',
		overlay: { type: 'linear', angle: 90, stops: ['#0e141c', '#4a5468'], blend: 'overlay', opacity: 0.32 },
		defaults: { grain: 18, vignette: 30, glow: 10 },
	},
	{
		id: 'watchmen',
		name: 'Watchmen',
		tagline: 'Cold dystopia, sickly smiley yellow',
		genre: 'Superhero',
		filter: 'contrast(1.3) saturate(0.7) brightness(0.88)',
		overlay: { type: 'linear', angle: 90, stops: ['#0c1014', '#4a4520'], blend: 'overlay', opacity: 0.4 },
		defaults: { grain: 20, vignette: 40, glow: 8 },
	},
];

export const ALL_PRESETS: CinematicPreset[] = [ORIGINAL_PRESET, ...PRESETS];

export function getPreset(id: string): CinematicPreset {
	return ALL_PRESETS.find((p) => p.id === id) ?? ORIGINAL_PRESET;
}

export function getFeaturedPresets(): CinematicPreset[] {
	return FEATURED_PRESET_IDS.map((id) => getPreset(id));
}

export function getPresetsByGenre(genre: string): CinematicPreset[] {
	return PRESETS.filter((p) => p.genre === genre);
}
