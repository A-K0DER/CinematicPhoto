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
	filter: 'none',
	overlay: { type: 'solid', stops: ['#000000', '#000000'], blend: 'source-over', opacity: 0 },
	defaults: { grain: 0, vignette: 0, glow: 0 },
};

export const PRESETS: CinematicPreset[] = [
	{
		id: 'dark-knight',
		name: 'The Dark Knight',
		tagline: 'Crushed blacks, cold steel',
		filter: 'contrast(1.38) saturate(0.68) brightness(0.86) blur(0)',
		overlay: {
			type: 'linear',
			angle: 90,
			stops: ['#0a2a2e', '#333a26'],
			blend: 'overlay',
			opacity: 0.4,
		},
		defaults: { grain: 22, vignette: 48, glow: 8 },
	},
	{
		id: 'blade-runner',
		name: 'Blade Runner 2049',
		tagline: 'Amber neon, teal haze',
		filter: 'contrast(1.22) saturate(1.4) brightness(1.02) sepia(0.14)',
		overlay: {
			type: 'linear',
			angle: 90,
			stops: ['#082830', '#ff8a3d'],
			blend: 'overlay',
			opacity: 0.48,
		},
		haze: { color: '#ff8a3d', opacity: 0.1 },
		defaults: { grain: 26, vignette: 30, glow: 38 },
	},
	{
		id: 'matrix',
		name: 'Matrix',
		tagline: 'High-gain digital green',
		filter: 'grayscale(1) contrast(1.4) brightness(0.94)',
		overlay: {
			type: 'solid',
			stops: ['#12ff6a', '#12ff6a'],
			blend: 'color',
			opacity: 0.85,
		},
		defaults: { grain: 20, vignette: 40, glow: 14 },
	},
	{
		id: 'dune',
		name: 'Dune',
		tagline: 'Desert gold, blown highlights',
		filter: 'sepia(0.42) saturate(1.15) contrast(1.08) brightness(1.08)',
		overlay: {
			type: 'linear',
			angle: 90,
			stops: ['#3a2c14', '#f0c987'],
			blend: 'soft-light',
			opacity: 0.55,
		},
		defaults: { grain: 30, vignette: 22, glow: 20 },
	},
	{
		id: 'interstellar',
		name: 'Interstellar',
		tagline: 'Cold cosmic blue, deep blacks',
		filter: 'saturate(0.58) contrast(1.18) brightness(0.92)',
		overlay: {
			type: 'linear',
			angle: 90,
			stops: ['#050912', '#28405e'],
			blend: 'overlay',
			opacity: 0.42,
		},
		defaults: { grain: 14, vignette: 42, glow: 16 },
	},
];

export const ALL_PRESETS: CinematicPreset[] = [ORIGINAL_PRESET, ...PRESETS];

export function getPreset(id: string): CinematicPreset {
	return ALL_PRESETS.find((p) => p.id === id) ?? ORIGINAL_PRESET;
}
