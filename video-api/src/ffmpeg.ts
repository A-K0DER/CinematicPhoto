/**
 * Phase 1 spike: a single hardcoded, LUT-backed preset (no filter-mapping
 * work needed — ffmpeg's lut3d consumes the same .cube file the photo
 * editor uses). Grain/vignette/glow/letterbox/metadata-stamp and the
 * remaining ~55 CSS-filter presets are Phase 3 in the approved plan
 * (../../.claude/plans — "Effect -> ffmpeg filter mapping").
 */
export const PHASE1_PRESET_ID = 'dark-knight';

const LUT_PATH = `/luts/${PHASE1_PRESET_ID}.cube`;

export function buildFfmpegCommand(inputPath: string, outputPath: string): string {
	return [
		'ffmpeg',
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
		// first bytes — the output route below doesn't support Range requests,
		// so without this the moov atom (written at the end by default) is
		// unreachable and playback hangs forever.
		'-movflags',
		'+faststart',
		'-c:a',
		'copy',
		outputPath,
	].join(' ');
}
