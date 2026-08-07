import type { CinematicPreset } from './presets';

export const LETTERBOX_RATIO = 2.39;
const MAX_DIMENSION = 2400;

export interface RenderOptions {
	grain: number; // 0-100
	vignette: number; // 0-100
	glow: number; // 0-100
	letterbox: boolean;
	metadata: boolean;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Could not read this image file.'));
		};
		img.src = url;
	});
}

export function computeCanvasSize(naturalWidth: number, naturalHeight: number) {
	const scale = Math.min(1, MAX_DIMENSION / Math.max(naturalWidth, naturalHeight));
	return {
		width: Math.round(naturalWidth * scale),
		height: Math.round(naturalHeight * scale),
	};
}

let noiseTile: HTMLCanvasElement | null = null;

function getNoiseTile(): HTMLCanvasElement {
	if (noiseTile) return noiseTile;
	const size = 256;
	const tile = document.createElement('canvas');
	tile.width = size;
	tile.height = size;
	const tctx = tile.getContext('2d')!;
	const imageData = tctx.createImageData(size, size);
	for (let i = 0; i < imageData.data.length; i += 4) {
		const v = Math.floor(Math.random() * 255);
		imageData.data[i] = v;
		imageData.data[i + 1] = v;
		imageData.data[i + 2] = v;
		imageData.data[i + 3] = 255;
	}
	tctx.putImageData(imageData, 0, 0);
	noiseTile = tile;
	return tile;
}

let glowScratch: HTMLCanvasElement | null = null;

function getGlowScratch(width: number, height: number): HTMLCanvasElement {
	if (!glowScratch) glowScratch = document.createElement('canvas');
	if (glowScratch.width !== width || glowScratch.height !== height) {
		glowScratch.width = width;
		glowScratch.height = height;
	}
	return glowScratch;
}

function buildLinearGradient(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	angle: number | undefined,
) {
	if (angle === 0) return ctx.createLinearGradient(0, 0, w, 0);
	return ctx.createLinearGradient(0, 0, 0, h);
}

function applyOverlay(ctx: CanvasRenderingContext2D, preset: CinematicPreset, w: number, h: number) {
	const { overlay } = preset;
	if (overlay.opacity <= 0) return;

	ctx.save();
	ctx.globalCompositeOperation = overlay.blend;
	ctx.globalAlpha = overlay.opacity;

	if (overlay.type === 'solid') {
		ctx.fillStyle = overlay.stops[0];
		ctx.fillRect(0, 0, w, h);
	} else {
		const gradient =
			overlay.type === 'radial'
				? ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.1)
				: buildLinearGradient(ctx, w, h, overlay.angle);
		gradient.addColorStop(0, overlay.stops[0]);
		gradient.addColorStop(1, overlay.stops[1]);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, w, h);
	}

	ctx.restore();
}

function applyHaze(ctx: CanvasRenderingContext2D, preset: CinematicPreset, w: number, h: number) {
	if (!preset.haze || preset.haze.opacity <= 0) return;
	ctx.save();
	ctx.globalCompositeOperation = 'screen';
	ctx.globalAlpha = preset.haze.opacity;
	const gradient = ctx.createRadialGradient(w / 2, h * 0.15, 0, w / 2, h * 0.15, Math.max(w, h) * 0.75);
	gradient.addColorStop(0, preset.haze.color);
	gradient.addColorStop(1, 'transparent');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
	ctx.restore();
}

function applyGlow(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
	if (amount <= 0) return;
	const scratch = getGlowScratch(w, h);
	const sctx = scratch.getContext('2d')!;
	sctx.clearRect(0, 0, w, h);
	sctx.filter = `blur(${Math.max(4, Math.round(Math.min(w, h) * 0.02))}px) brightness(1.35)`;
	sctx.drawImage(ctx.canvas, 0, 0, w, h);
	sctx.filter = 'none';

	ctx.save();
	ctx.globalCompositeOperation = 'screen';
	ctx.globalAlpha = (amount / 100) * 0.65;
	ctx.drawImage(scratch, 0, 0, w, h);
	ctx.restore();
}

function applyVignette(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
	if (amount <= 0) return;
	ctx.save();
	ctx.globalCompositeOperation = 'multiply';
	ctx.globalAlpha = (amount / 100) * 0.85;
	const gradient = ctx.createRadialGradient(
		w / 2,
		h / 2,
		Math.min(w, h) * 0.3,
		w / 2,
		h / 2,
		Math.max(w, h) * 0.75,
	);
	gradient.addColorStop(0, '#ffffff');
	gradient.addColorStop(1, '#000000');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
	ctx.restore();
}

function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
	if (amount <= 0) return;
	const tile = getNoiseTile();
	const pattern = ctx.createPattern(tile, 'repeat');
	if (!pattern) return;
	ctx.save();
	ctx.globalCompositeOperation = 'overlay';
	ctx.globalAlpha = (amount / 100) * 0.5;
	ctx.fillStyle = pattern;
	ctx.fillRect(0, 0, w, h);
	ctx.restore();
}

function drawLetterbox(ctx: CanvasRenderingContext2D, w: number, h: number) {
	const targetHeight = w / LETTERBOX_RATIO;
	if (targetHeight >= h) return;
	const barHeight = (h - targetHeight) / 2;
	ctx.save();
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, w, barHeight);
	ctx.fillRect(0, h - barHeight, w, barHeight);
	ctx.restore();
}

function drawMetadataStamp(ctx: CanvasRenderingContext2D, w: number, h: number, label: string) {
	const fontSize = Math.max(11, Math.round(w * 0.011));
	const padding = fontSize * 1.4;
	ctx.save();
	ctx.font = `500 ${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'right';
	ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
	ctx.shadowBlur = fontSize * 0.6;
	ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
	ctx.fillText(label, w - padding, h - padding);
	ctx.restore();
}

export interface RenderFrameArgs {
	canvas: HTMLCanvasElement;
	image: HTMLImageElement;
	width: number;
	height: number;
	preset: CinematicPreset;
	options: RenderOptions;
	stampLabel?: string;
}

export function renderFrame({ canvas, image, width, height, preset, options, stampLabel }: RenderFrameArgs) {
	if (canvas.width !== width) canvas.width = width;
	if (canvas.height !== height) canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.clearRect(0, 0, width, height);
	ctx.filter = preset.filter;
	ctx.drawImage(image, 0, 0, width, height);
	ctx.filter = 'none';

	applyOverlay(ctx, preset, width, height);
	applyHaze(ctx, preset, width, height);
	applyGlow(ctx, width, height, options.glow);
	applyVignette(ctx, width, height, options.vignette);
	applyGrain(ctx, width, height, options.grain);

	if (options.letterbox) drawLetterbox(ctx, width, height);
	if (options.metadata && stampLabel) drawMetadataStamp(ctx, width, height, stampLabel);
}

export function exportCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('Export failed.'));
				return;
			}
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
			resolve();
		}, 'image/png');
	});
}
