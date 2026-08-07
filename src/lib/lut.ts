/**
 * Minimal Adobe .cube 3D LUT parser + trilinear sampler.
 * Format reference: a `LUT_3D_SIZE N` header followed by N^3 "R G B" lines
 * (0-1 floats), ordered with R varying fastest, then G, then B.
 */

export interface ParsedCube {
	size: number;
	/** Flat R-fastest-varying table of [r,g,b] triples, length = size^3 * 3. */
	data: Float32Array;
	domainMin: [number, number, number];
	domainMax: [number, number, number];
}

function clamp01(v: number): number {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function parseCubeFile(text: string): ParsedCube {
	let size = 0;
	let domainMin: [number, number, number] = [0, 0, 0];
	let domainMax: [number, number, number] = [1, 1, 1];
	const values: number[] = [];

	for (const rawLine of text.split('\n')) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#') || line.startsWith('TITLE')) continue;

		if (line.startsWith('LUT_3D_SIZE')) {
			size = parseInt(line.split(/\s+/)[1] ?? '', 10);
			continue;
		}
		if (line.startsWith('LUT_1D_SIZE')) {
			throw new Error('1D LUTs are not supported.');
		}
		if (line.startsWith('DOMAIN_MIN')) {
			domainMin = line.split(/\s+/).slice(1).map(Number) as [number, number, number];
			continue;
		}
		if (line.startsWith('DOMAIN_MAX')) {
			domainMax = line.split(/\s+/).slice(1).map(Number) as [number, number, number];
			continue;
		}

		const parts = line.split(/\s+/);
		if (parts.length !== 3) continue;
		values.push(Number(parts[0]), Number(parts[1]), Number(parts[2]));
	}

	if (!size || Number.isNaN(size)) throw new Error('Missing or invalid LUT_3D_SIZE in .cube file.');
	const expected = size * size * size * 3;
	if (values.length !== expected) {
		throw new Error(`Cube data length mismatch: expected ${expected} values, got ${values.length}.`);
	}

	return { size, data: Float32Array.from(values), domainMin, domainMax };
}

function sampleAt(cube: ParsedCube, ri: number, gi: number, bi: number): [number, number, number] {
	const { size, data } = cube;
	const idx = (ri + gi * size + bi * size * size) * 3;
	return [data[idx], data[idx + 1], data[idx + 2]];
}

/** Trilinear-interpolated LUT lookup. r/g/b are 0-1. */
export function sampleLut(cube: ParsedCube, r: number, g: number, b: number): [number, number, number] {
	const { size, domainMin, domainMax } = cube;
	const nr = clamp01((r - domainMin[0]) / (domainMax[0] - domainMin[0])) * (size - 1);
	const ng = clamp01((g - domainMin[1]) / (domainMax[1] - domainMin[1])) * (size - 1);
	const nb = clamp01((b - domainMin[2]) / (domainMax[2] - domainMin[2])) * (size - 1);

	const r0 = Math.floor(nr);
	const g0 = Math.floor(ng);
	const b0 = Math.floor(nb);
	const r1 = Math.min(r0 + 1, size - 1);
	const g1 = Math.min(g0 + 1, size - 1);
	const b1 = Math.min(b0 + 1, size - 1);
	const fr = nr - r0;
	const fg = ng - g0;
	const fb = nb - b0;

	const c000 = sampleAt(cube, r0, g0, b0);
	const c100 = sampleAt(cube, r1, g0, b0);
	const c010 = sampleAt(cube, r0, g1, b0);
	const c110 = sampleAt(cube, r1, g1, b0);
	const c001 = sampleAt(cube, r0, g0, b1);
	const c101 = sampleAt(cube, r1, g0, b1);
	const c011 = sampleAt(cube, r0, g1, b1);
	const c111 = sampleAt(cube, r1, g1, b1);

	const out: [number, number, number] = [0, 0, 0];
	for (let ch = 0; ch < 3; ch++) {
		const c00 = c000[ch] * (1 - fr) + c100[ch] * fr;
		const c10 = c010[ch] * (1 - fr) + c110[ch] * fr;
		const c01 = c001[ch] * (1 - fr) + c101[ch] * fr;
		const c11 = c011[ch] * (1 - fr) + c111[ch] * fr;
		const c0 = c00 * (1 - fg) + c10 * fg;
		const c1 = c01 * (1 - fg) + c11 * fg;
		out[ch] = c0 * (1 - fb) + c1 * fb;
	}
	return out;
}

/** Mutates imageData in place, applying the LUT to every pixel's RGB (alpha untouched). */
export function applyLutToImageData(imageData: ImageData, cube: ParsedCube): void {
	const { data } = imageData;
	for (let i = 0; i < data.length; i += 4) {
		const [r, g, b] = sampleLut(cube, data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
		data[i] = Math.round(clamp01(r) * 255);
		data[i + 1] = Math.round(clamp01(g) * 255);
		data[i + 2] = Math.round(clamp01(b) * 255);
	}
}

const lutCache = new Map<string, Promise<ParsedCube | null>>();

/** Fetches + parses a .cube file, caching the result (including failures, as null) per URL for the session. */
export function loadLut(url: string): Promise<ParsedCube | null> {
	let cached = lutCache.get(url);
	if (!cached) {
		cached = fetch(url)
			.then((res) => (res.ok ? res.text() : Promise.reject(new Error(`LUT not found: ${url}`))))
			.then((text) => parseCubeFile(text))
			.catch(() => null);
		lutCache.set(url, cached);
	}
	return cached;
}
