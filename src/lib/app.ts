import { getPreset, type CinematicPreset } from './presets';
import { computeCanvasSize, exportCanvas, loadImageFromFile, renderFrame } from './engine';

const dropzoneTarget = document.getElementById('dropzone-target') as HTMLLabelElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const dropzoneError = document.getElementById('dropzone-error') as HTMLParagraphElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const presetGrid = document.getElementById('preset-grid') as HTMLDivElement;

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

interface State {
	image: HTMLImageElement | null;
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
	if (!state.image) return;
	const preset = getPreset(state.presetId);
	const stampLabel = `CINEMATIC PHOTO · ${preset.name.toUpperCase()} · 35MM`;
	renderFrame({
		canvas,
		image: state.image,
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

function setAppState(appState: 'drop' | 'editor') {
	document.body.dataset.appState = appState;
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

function setActivePreset(presetId: string) {
	state.presetId = presetId;
	for (const card of presetGrid.querySelectorAll<HTMLButtonElement>('[data-preset-id]')) {
		card.dataset.active = String(card.dataset.presetId === presetId);
	}
}

function showError(message: string) {
	dropzoneError.textContent = message;
	dropzoneError.classList.remove('hidden');
}

function clearError() {
	dropzoneError.classList.add('hidden');
	dropzoneError.textContent = '';
}

async function handleFile(file: File) {
	if (!file.type.startsWith('image/')) {
		showError('That file type is not supported. Try a JPG, PNG, or WEBP.');
		return;
	}
	clearError();
	try {
		const image = await loadImageFromFile(file);
		const { width, height } = computeCanvasSize(image.naturalWidth, image.naturalHeight);
		state.image = image;
		state.width = width;
		state.height = height;
		state.fileBaseName = file.name.replace(/\.[^.]+$/, '') || 'cinematic-photo';
		state.letterbox = false;
		state.metadata = false;
		letterboxToggle.setAttribute('aria-pressed', 'false');
		metadataToggle.setAttribute('aria-pressed', 'false');
		setActivePreset('original');
		applyPresetDefaults(getPreset('original'));
		setAppState('editor');
		scheduleRender();
	} catch (err) {
		showError(err instanceof Error ? err.message : 'Could not read this image file.');
	}
}

function resetToDropzone() {
	state.image = null;
	fileInput.value = '';
	clearError();
	setAppState('drop');
}

// --- Dropzone wiring ---

fileInput.addEventListener('change', () => {
	const file = fileInput.files?.[0];
	if (file) handleFile(file);
});

for (const evt of ['dragenter', 'dragover']) {
	dropzoneTarget.addEventListener(evt, (e) => {
		e.preventDefault();
		dropzoneTarget.classList.add('border-zinc-500', 'bg-canvas-soft-2');
	});
}

for (const evt of ['dragleave', 'dragend']) {
	dropzoneTarget.addEventListener(evt, (e) => {
		e.preventDefault();
		dropzoneTarget.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	});
}

dropzoneTarget.addEventListener('drop', (e) => {
	e.preventDefault();
	dropzoneTarget.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	const file = e.dataTransfer?.files?.[0];
	if (file) handleFile(file);
});

// Prevent the browser from navigating away if a file is dropped outside the target.
for (const evt of ['dragover', 'drop']) {
	window.addEventListener(evt, (e) => {
		if (document.body.dataset.appState === 'drop' && (e.target as HTMLElement)?.closest('#dropzone-target')) {
			return;
		}
		e.preventDefault();
	});
}

window.addEventListener('paste', (e) => {
	const items = e.clipboardData?.items;
	if (!items) return;
	for (const item of items) {
		if (item.type.startsWith('image/')) {
			const file = item.getAsFile();
			if (file) handleFile(file);
			break;
		}
	}
});

// --- Preset grid ---

presetGrid.addEventListener('click', (e) => {
	const card = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-preset-id]');
	if (!card?.dataset.presetId) return;
	const preset = getPreset(card.dataset.presetId);
	setActivePreset(preset.id);
	applyPresetDefaults(preset);
	scheduleRender();
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

navReset.addEventListener('click', resetToDropzone);

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
