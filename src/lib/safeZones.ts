/**
 * Standalone from the cinematic grading pipeline (engine.ts / presets.ts) on
 * purpose — this tool has nothing to do with color grading, LUTs, or export
 * crops, so it doesn't import from either.
 */

export type SafeZonePlatform = 'tiktok' | 'reels';

export interface SafeZoneRect {
	label: string;
	/** All fields are fractions (0-1) of the 9:16 frame, not pixels, so the same data scales to any canvas size. */
	x: number;
	y: number;
	width: number;
	height: number;
	/** Which extent is the meaningful "how far does this zone cut in" figure for a creator — a caption band's depth is its height, a side icon rail's depth is its width. */
	metricAxis: 'width' | 'height';
}

export interface SafeZonePlatformConfig {
	id: SafeZonePlatform;
	name: string;
	color: string;
	zones: SafeZoneRect[];
}

/** Reference frame the zone percentages below are authored against (matches a 1080x1920 export). */
export const SAFE_ZONE_FRAME = { width: 1080, height: 1920 };

/**
 * Approximate UI overlap zones for each platform's native vertical video
 * player, based on published creator/ads specs. Both apps tweak their UI
 * over time, so treat these as "keep clear" guidance, not pixel-exact.
 */
export const SAFE_ZONE_PLATFORMS: SafeZonePlatformConfig[] = [
	{
		id: 'tiktok',
		name: 'TikTok',
		color: '#00f2ea',
		zones: [
			{ label: 'Top bar (Following / For You)', x: 0, y: 0, width: 1, height: 0.05, metricAxis: 'height' },
			{ label: 'Caption, username, sound', x: 0, y: 0.8, width: 0.78, height: 0.2, metricAxis: 'height' },
			{
				label: 'Like, comment, bookmark, share, profile',
				x: 0.86,
				y: 0.42,
				width: 0.14,
				height: 0.46,
				metricAxis: 'width',
			},
		],
	},
	{
		id: 'reels',
		name: 'Instagram Reels',
		color: '#fd1d8d',
		zones: [
			{ label: 'Top bar (Reels label / audio)', x: 0, y: 0, width: 1, height: 0.045, metricAxis: 'height' },
			{ label: 'Caption, username, audio', x: 0, y: 0.76, width: 0.82, height: 0.24, metricAxis: 'height' },
			{
				label: 'Like, comment, share, profile',
				x: 0.88,
				y: 0.36,
				width: 0.12,
				height: 0.46,
				metricAxis: 'width',
			},
		],
	},
];

/** The zone's "keep clear" depth from its edge, in both px (at the reference 1080x1920 frame) and % of that axis — the same shape of figure competitors' safe-zone tools quote (e.g. "250px (13%)"). */
export function getZoneMetric(zone: SafeZoneRect): { px: number; percent: number } {
	const fraction = zone.metricAxis === 'width' ? zone.width : zone.height;
	const dimension = zone.metricAxis === 'width' ? SAFE_ZONE_FRAME.width : SAFE_ZONE_FRAME.height;
	return { px: Math.round(fraction * dimension), percent: Math.round(fraction * 1000) / 10 };
}

export const DEFAULT_SAFE_ZONE_OPACITY = 0.35;

/** Draws shaded, dashed-outline guide rects for the given platforms onto a canvas already sized to the 9:16 frame. `fillOpacity` (0-1) controls the shaded fill only — the dashed border stays at a constant, clearly visible strength. */
export function drawSafeZones(
	ctx: CanvasRenderingContext2D,
	frameWidth: number,
	frameHeight: number,
	platforms: SafeZonePlatform[],
	fillOpacity: number = DEFAULT_SAFE_ZONE_OPACITY,
) {
	for (const platformId of platforms) {
		const platform = SAFE_ZONE_PLATFORMS.find((p) => p.id === platformId);
		if (!platform) continue;

		ctx.save();
		ctx.lineWidth = Math.max(2, frameWidth * 0.0025);
		ctx.setLineDash([Math.max(6, frameWidth * 0.012), Math.max(4, frameWidth * 0.008)]);

		for (const zone of platform.zones) {
			const rx = zone.x * frameWidth;
			const ry = zone.y * frameHeight;
			const rw = zone.width * frameWidth;
			const rh = zone.height * frameHeight;

			ctx.globalAlpha = fillOpacity;
			ctx.fillStyle = platform.color;
			ctx.fillRect(rx, ry, rw, rh);

			ctx.globalAlpha = 0.95;
			ctx.strokeStyle = platform.color;
			ctx.strokeRect(rx, ry, rw, rh);
		}

		ctx.restore();
	}
}

export interface SafeZoneCropPan {
	x: number;
	y: number;
}

export interface SafeZoneCropWindow {
	sx: number;
	sy: number;
	sw: number;
	sh: number;
}

export interface SafeZoneCropPanBounds {
	maxX: number;
	maxY: number;
}

const FRAME_RATIO = SAFE_ZONE_FRAME.width / SAFE_ZONE_FRAME.height;

function clampNum(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/** The 9:16 crop window's pixel size within a source photo, before any pan offset. */
function cropWindowSize(sourceWidth: number, sourceHeight: number) {
	const sourceRatio = sourceWidth / sourceHeight;
	if (sourceRatio > FRAME_RATIO) {
		// Source is relatively wider than 9:16 — crop the sides.
		return { sw: Math.round(sourceHeight * FRAME_RATIO), sh: sourceHeight };
	}
	// Source is relatively taller than 9:16 — crop top/bottom.
	return { sw: sourceWidth, sh: Math.round(sourceWidth / FRAME_RATIO) };
}

/** Max pixels the crop window can be dragged off-center in each direction (0 once it already fills that dimension). */
export function getSafeZoneCropPanBounds(sourceWidth: number, sourceHeight: number): SafeZoneCropPanBounds {
	const { sw, sh } = cropWindowSize(sourceWidth, sourceHeight);
	return { maxX: (sourceWidth - sw) / 2, maxY: (sourceHeight - sh) / 2 };
}

/**
 * Center-crops (cover-fit) a source photo down to the 9:16 safe-zone frame,
 * the same math as CSS `object-fit: cover`. `pan` shifts the crop window off
 * -center (e.g. from dragging the preview), clamped so it never leaves the
 * source photo.
 */
export function computeSafeZoneCropWindow(
	sourceWidth: number,
	sourceHeight: number,
	pan: SafeZoneCropPan = { x: 0, y: 0 },
): SafeZoneCropWindow {
	const { sw, sh } = cropWindowSize(sourceWidth, sourceHeight);
	const baseSx = (sourceWidth - sw) / 2;
	const baseSy = (sourceHeight - sh) / 2;
	const sx = Math.round(clampNum(baseSx + pan.x, 0, sourceWidth - sw));
	const sy = Math.round(clampNum(baseSy + pan.y, 0, sourceHeight - sh));
	return { sx, sy, sw, sh };
}
