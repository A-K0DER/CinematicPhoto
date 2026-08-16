/**
 * Standalone from the cinematic grading pipeline (engine.ts / presets.ts) on
 * purpose — this tool has nothing to do with color grading or LUTs, so it
 * doesn't import from either.
 */

/** Mirrors YouTube's own abbreviation rules: raw count under 1,000, then one decimal K/M/B, dropping the decimal once the value itself hits 100+. */
export function formatViewCount(count: number): string {
	if (!Number.isFinite(count) || count < 0) return '0 views';
	const rounded = Math.round(count);
	if (rounded < 1000) return `${rounded} view${rounded === 1 ? '' : 's'}`;

	const units: [number, string][] = [
		[1_000_000_000, 'B'],
		[1_000_000, 'M'],
		[1_000, 'K'],
	];
	for (const [threshold, suffix] of units) {
		if (rounded >= threshold) {
			const value = rounded / threshold;
			const formatted = value >= 100 ? Math.round(value).toString() : (Math.round(value * 10) / 10).toString();
			return `${formatted}${suffix} views`;
		}
	}
	return `${rounded} views`;
}

export const YOUTUBE_TIME_AGO_OPTIONS = [
	'Just now',
	'1 hour ago',
	'6 hours ago',
	'1 day ago',
	'3 days ago',
	'1 week ago',
	'2 weeks ago',
	'1 month ago',
	'6 months ago',
	'1 year ago',
];

/** Validates and normalizes a duration typed as mm:ss or h:mm:ss, the same shape YouTube stamps on its own duration badge. Returns null for anything unparseable so callers can hide the badge. */
export function parseDurationBadge(raw: string): string | null {
	const trimmed = raw.trim();
	if (!/^\d{1,2}(:\d{2}){1,2}$/.test(trimmed)) return null;
	const parts = trimmed.split(':');
	// Every non-leading segment must be a valid 0-59 seconds/minutes field.
	if (parts.slice(1).some((p) => Number(p) > 59)) return null;
	return trimmed;
}

const AVATAR_COLORS = ['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#22d3ee', '#818cf8', '#e879f9', '#fb7185'];

/** Deterministic placeholder-avatar color from the channel name, so the same name always renders the same color across previews. */
export function avatarColorFor(name: string): string {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
	return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
