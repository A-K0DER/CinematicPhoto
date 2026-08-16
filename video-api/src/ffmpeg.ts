import { fileURLToPath } from 'node:url';

/**
 * Phase 1 spike: a single hardcoded, LUT-backed preset (no filter-mapping
 * work needed — ffmpeg's lut3d consumes the same .cube file the photo
 * editor uses). Grain/vignette/glow/letterbox/metadata-stamp and the
 * remaining ~55 CSS-filter presets are a later phase ("Effect -> ffmpeg
 * filter mapping").
 */
export const PHASE1_PRESET_ID = 'dark-knight';

const LUT_PATH = fileURLToPath(new URL(`../assets/luts/${PHASE1_PRESET_ID}.cube`, import.meta.url));

export function buildFfmpegArgs(inputPath: string, outputPath: string): string[] {
	return [
		'-y',
		'-i',
		inputPath,
		'-vf',
		// lut3d outputs a high-precision pixel format (yuv444p/gbrp); without
		// forcing back to yuv420p, libx264 encodes as High 4:4:4 Predictive,
		// which no browser's H.264 decoder supports (playback just hangs).
		`lut3d=file='${LUT_PATH}',format=yuv420p`,
		'-c:v',
		'libx264',
		'-preset',
		'fast',
		// moov (metadata) at the front so browsers can start playback from the
		// first bytes without needing Range-request support to seek for it.
		'-movflags',
		'+faststart',
		'-c:a',
		'copy',
		outputPath,
	];
}
