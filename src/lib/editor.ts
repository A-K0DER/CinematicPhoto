import { getOverlayBackground, getPreset, type CinematicPreset } from './presets';
import { computeCanvasSize, exportCanvas, loadImageFromFile, prepareGradedBase, renderFrame } from './engine';
import { takePendingImage } from './imageHandoff';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const previewWrap = document.getElementById('preview-wrap') as HTMLDivElement;
const presetGrid = document.getElementById('preset-grid') as HTMLDivElement;
const presetDropdown = document.getElementById('preset-dropdown') as HTMLSelectElement;

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
};

let rafId: number | null = null;

function scheduleRender() {
	if (rafId !== null) cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(() => {
		rafId = null;
		render();
	});
}

function render() {
	if (!state.image || !state.gradedBase) return;
	const preset = getPreset(state.presetId);
	const stampLabel = `CINEMATIC PHOTO · ${preset.name.toUpperCase()} · 35MM`;
	renderFrame({
		canvas,
		gradedBase: state.gradedBase,
		width: state.width,
		height: state.height,
		preset,
		options: {
			grain: state.grain,
			vignette: state.vignette,
			glow: state.glow,
			letterbox: state.letterbox,
			metadata: state.metadata,
		},
		stampLabel,
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

async function init() {
	const pending = await takePendingImage();
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

	const initialPresetId = requestedPresetId && getPreset(requestedPresetId).id === requestedPresetId ? requestedPresetId : 'original';
	selectPreset(getPreset(initialPresetId));
}

init();

// --- Preset grid ---

presetGrid.addEventListener('click', (e) => {
	const card = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-preset-id]');
	if (!card?.dataset.presetId) return;
	selectPreset(getPreset(card.dataset.presetId));
});

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
	location.href = '/';
});

navExport.addEventListener('click', async () => {
	if (!state.image) return;
	const preset = getPreset(state.presetId);
	const suffix = preset.id === 'original' ? 'original' : preset.id;
	navExport.disabled = true;
	navExport.textContent = 'Exporting…';
	try {
		await exportCanvas(canvas, `${state.fileBaseName}-${suffix}.png`);
	} finally {
		navExport.disabled = false;
		navExport.textContent = 'Export';
	}
});
