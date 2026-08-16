import { getOverlayBackground, getPreset, type CinematicPreset } from './presets';
import {
	computeCanvasSize,
	computeCropForRatio,
	exportCanvas,
	getPanBounds,
	loadImageFromFile,
	prepareGradedBase,
	renderFrame,
	renderPreviewFrame,
	type AspectRatioId,
} from './engine';
import { clearCurrentImage, loadCurrentImage, saveCurrentImage } from './imageHandoff';
import { extractRawPreviewBlob, isRawContainerFile } from './rawPreview';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const previewWrap = document.getElementById('preview-wrap') as HTMLDivElement;
const editorDropzone = document.getElementById('editor-dropzone') as HTMLLabelElement;
const editorFileInput = document.getElementById('editor-file-input') as HTMLInputElement;
const editorDropzoneError = document.getElementById('editor-dropzone-error') as HTMLParagraphElement;
const presetGrid = document.getElementById('preset-grid') as HTMLDivElement;
const presetDropdown = document.getElementById('preset-dropdown') as HTMLSelectElement;
const aspectRatioGroup = document.getElementById('aspect-ratio-group') as HTMLDivElement;
const recenterCropBtn = document.getElementById('recenter-crop') as HTMLButtonElement;

const grainSlider = document.getElementById('grain-slider') as HTMLInputElement;
const vignetteSlider = document.getElementById('vignette-slider') as HTMLInputElement;
const glowSlider = document.getElementById('glow-slider') as HTMLInputElement;
const grainValue = document.getElementById('grain-value') as HTMLSpanElement;
const vignetteValue = document.getElementById('vignette-value') as HTMLSpanElement;
const glowValue = document.getElementById('glow-value') as HTMLSpanElement;
const resetAdjustmentsBtn = document.getElementById('reset-adjustments') as HTMLButtonElement;

const letterboxToggle = document.getElementById('letterbox-toggle') as HTMLButtonElement;
const metadataToggle = document.getElementById('metadata-toggle') as HTMLButtonElement;

const navReset = document.getElementById('nav-reset') as HTMLButtonElement;
const navRemove = document.getElementById('nav-remove') as HTMLButtonElement;
const navExport = document.getElementById('nav-export') as HTMLButtonElement;

const requestedPresetId = new URLSearchParams(location.search).get('preset');

interface State {
	image: HTMLImageElement | null;
	gradedBase: HTMLCanvasElement | null;
	fileBaseName: string;
	width: number;
	height: number;
	presetId: string;
	grain: number;
	vignette: number;
	glow: number;
	letterbox: boolean;
	metadata: boolean;
	aspectRatio: AspectRatioId;
	panX: number;
	panY: number;
}

const state: State = {
	image: null,
	gradedBase: null,
	fileBaseName: 'cinematic-photo',
	width: 0,
	height: 0,
	presetId: 'original',
	grain: 0,
	vignette: 0,
	glow: 0,
	letterbox: false,
	metadata: false,
	aspectRatio: 'original',
	panX: 0,
	panY: 0,
};

const STATE_STORAGE_KEY = 'cinematic-photo:editor-state';

interface PersistedState {
	presetId: string;
	grain: number;
	vignette: number;
	glow: number;
	letterbox: boolean;
	metadata: boolean;
	aspectRatio?: AspectRatioId;
}

/** Written on every render so a page reload can resume the same edit, not just the same photo. */
function persistState() {
	const persisted: PersistedState = {
		presetId: state.presetId,
		grain: state.grain,
		vignette: state.vignette,
		glow: state.glow,
		letterbox: state.letterbox,
		metadata: state.metadata,
		aspectRatio: state.aspectRatio,
	};
	localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(persisted));
}

function readPersistedState(): PersistedState | null {
	try {
		const raw = localStorage.getItem(STATE_STORAGE_KEY);
		return raw ? (JSON.parse(raw) as PersistedState) : null;
	} catch {
		return null;
	}
}

function clearPersistedState() {
	localStorage.removeItem(STATE_STORAGE_KEY);
}

let rafId: number | null = null;

function scheduleRender() {
	if (rafId !== null) cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(() => {
		rafId = null;
		render();
	});
}

function stampLabelFor(preset: CinematicPreset): string {
	return `CINEMATIC PHOTO · ${preset.name.toUpperCase()} · 35MM`;
}

/**
 * Draws the full photo with a live crop-window overlay (dimmed outside the
 * selected aspect ratio) rather than physically cropping the canvas, so
 * dragging to reposition the crop stays visible against the whole image.
 * The actual crop is only applied on export — see the `navExport` handler.
 */
function render() {
	if (!state.image || !state.gradedBase) return;
	persistState();
	const preset = getPreset(state.presetId);
	const crop = computeCropForRatio(state.width, state.height, state.aspectRatio, { x: state.panX, y: state.panY });
	renderPreviewFrame({
		canvas,
		gradedBase: state.gradedBase,
		width: state.width,
		height: state.height,
		cropRect: crop.sourceRect,
		preset,
		options: {
			grain: state.grain,
			vignette: state.vignette,
			glow: state.glow,
			letterbox: state.letterbox,
			metadata: state.metadata,
		},
		stampLabel: stampLabelFor(preset),
	});
}

/**
 * Re-runs the (potentially expensive, real-LUT-backed) color grading step for
 * the current preset and re-renders once it resolves. Slider changes never
 * call this directly — they call scheduleRender(), which reuses whichever
 * graded base is already cached here.
 */
async function updateGradedBase() {
	if (!state.image) return;
	const preset = getPreset(state.presetId);
	previewWrap.classList.add('opacity-60');
	const graded = await prepareGradedBase(state.image, preset, state.width, state.height);
	previewWrap.classList.remove('opacity-60');
	if (state.presetId !== preset.id) return; // a newer preset was selected meanwhile
	state.gradedBase = graded;
	scheduleRender();
}

function applyPresetDefaults(preset: CinematicPreset) {
	state.grain = preset.defaults.grain;
	state.vignette = preset.defaults.vignette;
	state.glow = preset.defaults.glow;
	grainSlider.value = String(state.grain);
	vignetteSlider.value = String(state.vignette);
	glowSlider.value = String(state.glow);
	grainValue.textContent = String(state.grain);
	vignetteValue.textContent = String(state.vignette);
	glowValue.textContent = String(state.glow);
}

/**
 * The sidebar grid is statically rendered with only Original + the 5 featured
 * presets. If the editor was opened with a different preset (e.g. via a
 * movie landing page), that preset has no card to highlight — so one is
 * created on the fly and pinned to the front of the grid.
 */
function ensurePresetCard(preset: CinematicPreset) {
	if (presetGrid.querySelector(`[data-preset-id="${preset.id}"]`)) return;
	const card = document.createElement('button');
	card.type = 'button';
	card.dataset.presetId = preset.id;
	card.className =
		'preset-card group flex flex-col items-start gap-2 rounded-md border border-hairline bg-canvas p-2.5 text-left transition-colors hover:border-hairline-strong data-[active=true]:border-ink data-[active=true]:ring-1 data-[active=true]:ring-ink';
	card.innerHTML = `
		<span class="relative block h-8 w-full overflow-hidden rounded-sm">
			<img loading="lazy" decoding="async" alt="${preset.name}" src="${preset.image}" style="filter: ${preset.filter};" class="absolute inset-0 h-full w-full object-cover" />
			<span class="absolute inset-0" style="background: ${getOverlayBackground(preset.overlay)}; opacity: ${preset.overlay.opacity}; mix-blend-mode: ${preset.overlay.blend};"></span>
		</span>
		<span class="font-sans text-xs font-medium text-ink">${preset.name}</span>
		<span class="font-mono text-[10px] leading-tight text-mute">${preset.tagline}</span>
	`;
	presetGrid.prepend(card);
}

function setActivePreset(presetId: string) {
	state.presetId = presetId;
	for (const card of presetGrid.querySelectorAll<HTMLButtonElement>('[data-preset-id]')) {
		card.dataset.active = String(card.dataset.presetId === presetId);
	}
}

/** Shared by the preset grid, the "browse all" dropdown, and initial load from a `?preset=` link. */
function selectPreset(preset: CinematicPreset) {
	ensurePresetCard(preset);
	setActivePreset(preset.id);
	applyPresetDefaults(preset);
	updateGradedBase();
}

function showDropzoneError(message: string) {
	editorDropzoneError.textContent = message;
	editorDropzoneError.classList.remove('hidden');
}

function clearDropzoneError() {
	editorDropzoneError.classList.add('hidden');
	editorDropzoneError.textContent = '';
}

function setAspectRatio(ratio: AspectRatioId) {
	state.aspectRatio = ratio;
	state.panX = 0;
	state.panY = 0;
	for (const btn of aspectRatioGroup.querySelectorAll<HTMLButtonElement>('[data-aspect-ratio]')) {
		btn.dataset.active = String(btn.dataset.aspectRatio === ratio);
	}
	canvas.classList.toggle('cursor-grab', ratio !== 'original');
	recenterCropBtn.classList.toggle('hidden', ratio === 'original');
	scheduleRender();
}

function applyPersistedAdjustments(saved: PersistedState) {
	state.grain = saved.grain;
	state.vignette = saved.vignette;
	state.glow = saved.glow;
	state.letterbox = saved.letterbox;
	state.metadata = saved.metadata;
	grainSlider.value = String(state.grain);
	vignetteSlider.value = String(state.vignette);
	glowSlider.value = String(state.glow);
	grainValue.textContent = String(state.grain);
	vignetteValue.textContent = String(state.vignette);
	glowValue.textContent = String(state.glow);
	letterboxToggle.setAttribute('aria-pressed', String(state.letterbox));
	metadataToggle.setAttribute('aria-pressed', String(state.metadata));
	setAspectRatio(saved.aspectRatio ?? 'original');
	scheduleRender();
}

function showEmptyState() {
	canvas.classList.add('hidden');
	editorDropzone.classList.remove('hidden');
	editorDropzone.classList.add('flex');
	navExport.disabled = true;
}

function showCanvas() {
	editorDropzone.classList.add('hidden');
	editorDropzone.classList.remove('flex');
	canvas.classList.remove('hidden');
	navExport.disabled = false;
}

/**
 * Shared by the "New image" button, the empty-state dropzone (after
 * "Remove image"), drag & drop, and paste. If a photo is already loaded
 * (the "New image" case), the currently selected preset and slider values
 * are kept and the new photo is just re-graded; otherwise this is a fresh
 * editing session, so it resets to the "Original" preset and its defaults,
 * matching the initial landing-page handoff.
 */
async function loadFile(file: File) {
	const isRaw = isRawContainerFile(file);
	if (!file.type.startsWith('image/') && !isRaw) {
		showDropzoneError('That file type is not supported. Try a JPG, PNG, WEBP, or a camera RAW file.');
		return;
	}
	clearDropzoneError();
	const replace = state.image !== null;
	try {
		const source = isRaw ? await extractRawPreviewBlob(file) : file;
		const image = await loadImageFromFile(source);
		const { width, height } = computeCanvasSize(image.naturalWidth, image.naturalHeight);
		await saveCurrentImage(source, file.name);
		state.image = image;
		state.width = width;
		state.height = height;
		state.panX = 0;
		state.panY = 0;
		state.fileBaseName = file.name.replace(/\.[^.]+$/, '') || 'cinematic-photo';
		showCanvas();
		if (replace) {
			updateGradedBase();
		} else {
			selectPreset(getPreset('original'));
		}
	} catch (err) {
		showDropzoneError(err instanceof Error ? err.message : 'Could not read this image file.');
	}
}

async function init() {
	const pending = await loadCurrentImage();
	if (!pending) {
		location.href = '/';
		return;
	}
	const image = await loadImageFromFile(pending.blob);
	const { width, height } = computeCanvasSize(image.naturalWidth, image.naturalHeight);
	state.image = image;
	state.width = width;
	state.height = height;
	state.fileBaseName = pending.fileName.replace(/\.[^.]+$/, '') || 'cinematic-photo';

	const savedState = readPersistedState();
	const initialPresetId =
		requestedPresetId && getPreset(requestedPresetId).id === requestedPresetId
			? requestedPresetId
			: (savedState?.presetId ?? 'original');
	selectPreset(getPreset(initialPresetId));
	// Only reuse the saved grain/vignette/glow/toggle values if they belong to
	// the preset we just selected — otherwise keep that preset's own defaults.
	if (savedState && savedState.presetId === initialPresetId) {
		applyPersistedAdjustments(savedState);
	}
}

init();

// --- Image upload (New image / Remove image / empty-state dropzone) ---

editorFileInput.addEventListener('change', () => {
	const file = editorFileInput.files?.[0];
	editorFileInput.value = '';
	if (file) loadFile(file);
});

for (const evt of ['dragenter', 'dragover']) {
	editorDropzone.addEventListener(evt, (e) => {
		e.preventDefault();
		editorDropzone.classList.add('border-zinc-500', 'bg-canvas-soft-2');
	});
}

for (const evt of ['dragleave', 'dragend']) {
	editorDropzone.addEventListener(evt, (e) => {
		e.preventDefault();
		editorDropzone.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	});
}

editorDropzone.addEventListener('drop', (e) => {
	e.preventDefault();
	editorDropzone.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	const file = e.dataTransfer?.files?.[0];
	if (file) loadFile(file);
});

// Prevent the browser from navigating away if a file is dropped outside the target.
for (const evt of ['dragover', 'drop']) {
	window.addEventListener(evt, (e) => {
		if ((e.target as HTMLElement)?.closest('#editor-dropzone')) return;
		e.preventDefault();
	});
}

window.addEventListener('paste', (e) => {
	if (state.image) return; // "New image" is the explicit way to replace an existing photo
	const items = e.clipboardData?.items;
	if (!items) return;
	for (const item of items) {
		if (item.type.startsWith('image/')) {
			const file = item.getAsFile();
			if (file) loadFile(file);
			break;
		}
	}
});

// --- Preset grid ---

presetGrid.addEventListener('click', (e) => {
	const card = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-preset-id]');
	if (!card?.dataset.presetId) return;
	selectPreset(getPreset(card.dataset.presetId));
});

// --- Aspect ratio ---

aspectRatioGroup.addEventListener('click', (e) => {
	const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-aspect-ratio]');
	if (!btn?.dataset.aspectRatio) return;
	setAspectRatio(btn.dataset.aspectRatio as AspectRatioId);
});

recenterCropBtn.addEventListener('click', () => {
	state.panX = 0;
	state.panY = 0;
	scheduleRender();
});

// --- Drag to reposition the crop (only active once an aspect ratio is picked) ---

interface DragState {
	pointerId: number;
	startClientX: number;
	startClientY: number;
	startPanX: number;
	startPanY: number;
}

let drag: DragState | null = null;

canvas.addEventListener('pointerdown', (e) => {
	if (state.aspectRatio === 'original' || !state.image) return;
	drag = {
		pointerId: e.pointerId,
		startClientX: e.clientX,
		startClientY: e.clientY,
		startPanX: state.panX,
		startPanY: state.panY,
	};
	canvas.setPointerCapture(e.pointerId);
	canvas.classList.add('cursor-grabbing');
});

canvas.addEventListener('pointermove', (e) => {
	if (!drag || drag.pointerId !== e.pointerId) return;
	const rect = canvas.getBoundingClientRect();
	if (rect.width === 0) return;
	// Backing-store pixels per CSS pixel — the canvas is drawn at full crop
	// resolution but displayed scaled down, so mouse deltas need converting.
	const scale = canvas.width / rect.width;
	const dxSource = (e.clientX - drag.startClientX) * scale;
	const dySource = (e.clientY - drag.startClientY) * scale;
	const bounds = getPanBounds(state.width, state.height, state.aspectRatio);
	// Dragging right/down should reveal more of the image's left/top edge,
	// i.e. slide the crop window the opposite way — so we subtract, not add.
	state.panX = Math.min(Math.max(drag.startPanX - dxSource, -bounds.maxX), bounds.maxX);
	state.panY = Math.min(Math.max(drag.startPanY - dySource, -bounds.maxY), bounds.maxY);
	scheduleRender();
});

function endDrag(e: PointerEvent) {
	if (!drag || drag.pointerId !== e.pointerId) return;
	drag = null;
	canvas.classList.remove('cursor-grabbing');
	if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
}

canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

// --- "Browse all presets" dropdown ---

presetDropdown.addEventListener('change', () => {
	if (!presetDropdown.value) return;
	selectPreset(getPreset(presetDropdown.value));
});

// --- Sliders ---

grainSlider.addEventListener('input', () => {
	state.grain = Number(grainSlider.value);
	grainValue.textContent = grainSlider.value;
	scheduleRender();
});

vignetteSlider.addEventListener('input', () => {
	state.vignette = Number(vignetteSlider.value);
	vignetteValue.textContent = vignetteSlider.value;
	scheduleRender();
});

glowSlider.addEventListener('input', () => {
	state.glow = Number(glowSlider.value);
	glowValue.textContent = glowSlider.value;
	scheduleRender();
});

resetAdjustmentsBtn.addEventListener('click', () => {
	applyPresetDefaults(getPreset(state.presetId));
	scheduleRender();
});

// --- Toggles ---

letterboxToggle.addEventListener('click', () => {
	state.letterbox = letterboxToggle.getAttribute('aria-pressed') !== 'true';
	letterboxToggle.setAttribute('aria-pressed', String(state.letterbox));
	scheduleRender();
});

metadataToggle.addEventListener('click', () => {
	state.metadata = metadataToggle.getAttribute('aria-pressed') !== 'true';
	metadataToggle.setAttribute('aria-pressed', String(state.metadata));
	scheduleRender();
});

// --- Nav actions ---

navReset.addEventListener('click', () => {
	editorFileInput.click();
});

navRemove.addEventListener('click', () => {
	state.image = null;
	state.gradedBase = null;
	showEmptyState();
	clearCurrentImage();
	clearPersistedState();
});

const ASPECT_RATIO_FILE_SUFFIXES: Record<AspectRatioId, string> = {
	original: '',
	'1:1': '-1x1',
	'4:5': '-4x5',
	'9:16': '-9x16',
};

navExport.addEventListener('click', async () => {
	if (!state.image || !state.gradedBase) return;
	const preset = getPreset(state.presetId);
	const suffix = preset.id === 'original' ? 'original' : preset.id;
	const ratioSuffix = ASPECT_RATIO_FILE_SUFFIXES[state.aspectRatio];
	navExport.disabled = true;
	navExport.textContent = 'Exporting…';
	try {
		const crop = computeCropForRatio(state.width, state.height, state.aspectRatio, { x: state.panX, y: state.panY });
		const output = document.createElement('canvas');
		renderFrame({
			canvas: output,
			gradedBase: state.gradedBase,
			width: crop.width,
			height: crop.height,
			sourceRect: crop.sourceRect,
			preset,
			options: {
				grain: state.grain,
				vignette: state.vignette,
				glow: state.glow,
				letterbox: state.letterbox,
				metadata: state.metadata,
			},
			stampLabel: stampLabelFor(preset),
		});
		await exportCanvas(output, `${state.fileBaseName}-${suffix}${ratioSuffix}.png`);
	} finally {
		navExport.disabled = false;
		navExport.textContent = 'Export';
	}
});
