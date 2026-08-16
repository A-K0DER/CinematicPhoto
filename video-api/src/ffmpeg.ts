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
		`lut3d=file='${LUT_PATH}'`,
		'-c:v',
		'libx264',
		'-preset',
		'fast',
		'-c:a',
		'copy',
		outputPath,
	].join(' ');
}
