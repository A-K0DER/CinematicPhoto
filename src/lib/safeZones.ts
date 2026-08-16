/**
 * Standalone from the cinematic grading pipeline (engine.ts / presets.ts) on
 * purpose — this tool has nothing to do with color grading, LUTs, or export
 * crops, so it doesn't import from either.
 */

export type SafeZonePlatform = 'tiktok' | 'reels' | 'stories' | 'post';

export interface SafeZoneFrame {
	width: number;
	height: number;
}

export interface SafeZoneRect {
	label: string;
	/** All fields are fractions (0-1) of the platform's frame, not pixels, so the same data scales to any canvas size. */
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
	/** Reference frame this platform's zone percentages are authored against — not every format is 9:16 (e.g. a feed Post is 4:5). */
	frame: SafeZoneFrame;
	/** Whether this platform can be overlaid together with others on one shared canvas (the free multi-toggle "compare" tool). Only platforms sharing the same frame ratio are comparable. */
	comparable: boolean;
	zones: SafeZoneRect[];
}

/** Default/legacy reference frame (matches a 1080x1920 9:16 export) — most platforms use this. */
export const SAFE_ZONE_FRAME: SafeZoneFrame = { width: 1080, height: 1920 };

const POST_FRAME: SafeZoneFrame = { width: 1080, height: 1350 };

/**
 * Approximate UI overlap zones for each platform's native player/viewer, based
 * on published creator/ads specs. Apps tweak their UI over time, so treat
 * these as "keep clear" guidance, not pixel-exact.
 */
export const SAFE_ZONE_PLATFORMS: SafeZonePlatformConfig[] = [
	{
		id: 'tiktok',
		name: 'TikTok',
		color: '#00f2ea',
		frame: SAFE_ZONE_FRAME,
		comparable: true,
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
		frame: SAFE_ZONE_FRAME,
		comparable: true,
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
	{
		id: 'stories',
		name: 'Instagram Stories',
		color: '#c13584',
		frame: SAFE_ZONE_FRAME,
		comparable: true,
		zones: [
			{ label: 'Profile, username, timestamp, close', x: 0, y: 0, width: 1, height: 0.12, metricAxis: 'height' },
			{ label: 'Reply field / share row', x: 0, y: 0.88, width: 1, height: 0.12, metricAxis: 'height' },
		],
	},
	{
		id: 'post',
		name: 'Instagram Post',
		color: '#f77737',
		frame: POST_FRAME,
		// 4:5, not 9:16 — can't share a canvas with the vertical-video platforms above.
		comparable: false,
		zones: [
			{ label: 'Cropped off in square grid view (top)', x: 0, y: 0, width: 1, height: 0.1, metricAxis: 'height' },
			{ label: 'Cropped off in square grid view (bottom)', x: 0, y: 0.9, width: 1, height: 0.1, metricAxis: 'height' },
		],
	},
];

export function getSafeZonePlatform(id: SafeZonePlatform): SafeZonePlatformConfig {
	const platform = SAFE_ZONE_PLATFORMS.find((p) => p.id === id);
	if (!platform) throw new Error(`Unknown safe zone platform: ${id}`);
	return platform;
}

/** The zone's "keep clear" depth from its edge, in both px (at the platform's reference frame) and % of that axis — the same shape of figure competitors' safe-zone tools quote (e.g. "250px (13%)"). */
export function getZoneMetric(zone: SafeZoneRect, frame: SafeZoneFrame): { px: number; percent: number } {
	const fraction = zone.metricAxis === 'width' ? zone.width : zone.height;
	const dimension = zone.metricAxis === 'width' ? frame.width : frame.height;
	return { px: Math.round(fraction * dimension), percent: Math.round(fraction * 1000) / 10 };
}

export const DEFAULT_SAFE_ZONE_OPACITY = 0.35;

/** Draws shaded, dashed-outline guide rects for the given platforms onto a canvas already sized to that platform's frame ratio. `fillOpacity` (0-1) controls the shaded fill only — the dashed border stays at a constant, clearly visible strength. */
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

function clampNum(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/** The target frame's pixel size within a source photo, before any pan offset. */
function cropWindowSize(sourceWidth: number, sourceHeight: number, frameRatio: number) {
	const sourceRatio = sourceWidth / sourceHeight;
	if (sourceRatio > frameRatio) {
		// Source is relatively wider than the target frame — crop the sides.
		return { sw: Math.round(sourceHeight * frameRatio), sh: sourceHeight };
	}
	// Source is relatively taller than the target frame — crop top/bottom.
	return { sw: sourceWidth, sh: Math.round(sourceWidth / frameRatio) };
}

/** Max pixels the crop window can be dragged off-center in each direction (0 once it already fills that dimension). */
export function getSafeZoneCropPanBounds(sourceWidth: number, sourceHeight: number, frameRatio: number): SafeZoneCropPanBounds {
	const { sw, sh } = cropWindowSize(sourceWidth, sourceHeight, frameRatio);
	return { maxX: (sourceWidth - sw) / 2, maxY: (sourceHeight - sh) / 2 };
}

/**
 * Center-crops (cover-fit) a source photo down to the target frame ratio, the
 * same math as CSS `object-fit: cover`. `pan` shifts the crop window off
 * -center (e.g. from dragging the preview), clamped so it never leaves the
 * source photo.
 */
export function computeSafeZoneCropWindow(
	sourceWidth: number,
	sourceHeight: number,
	frameRatio: number,
	pan: SafeZoneCropPan = { x: 0, y: 0 },
): SafeZoneCropWindow {
	const { sw, sh } = cropWindowSize(sourceWidth, sourceHeight, frameRatio);
	const baseSx = (sourceWidth - sw) / 2;
	const baseSy = (sourceHeight - sh) / 2;
	const sx = Math.round(clampNum(baseSx + pan.x, 0, sourceWidth - sw));
	const sy = Math.round(clampNum(baseSy + pan.y, 0, sourceHeight - sh));
	return { sx, sy, sw, sh };
}
