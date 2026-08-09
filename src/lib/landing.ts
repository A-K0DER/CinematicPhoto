import { getPreset } from './presets';
import { extractRawPreviewBlob, isRawContainerFile } from './rawPreview';
import { saveCurrentImage } from './imageHandoff';

const dropzoneSection = document.getElementById('dropzone') as HTMLElement;
const dropzoneTarget = document.getElementById('dropzone-target') as HTMLLabelElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const dropzoneError = document.getElementById('dropzone-error') as HTMLParagraphElement;
const presetShowcase = document.getElementById('preset-showcase') as HTMLDivElement;
const pendingPresetLabel = document.getElementById('pending-preset-label') as HTMLParagraphElement;

// Query param wins (e.g. links from /presets/); otherwise fall back to the
// page's default preset (e.g. a movie landing page pre-selecting its grade).
const requestedPresetId = new URLSearchParams(location.search).get('preset') ?? dropzoneSection.dataset.defaultPreset ?? null;
let pendingPresetId = requestedPresetId && getPreset(requestedPresetId).id === requestedPresetId ? requestedPresetId : null;

function showError(message: string) {
	dropzoneError.textContent = message;
	dropzoneError.classList.remove('hidden');
}

function clearError() {
	dropzoneError.classList.add('hidden');
	dropzoneError.textContent = '';
}

async function handleFile(file: File) {
	const isRaw = isRawContainerFile(file);
	if (!file.type.startsWith('image/') && !isRaw) {
		showError('That file type is not supported. Try a JPG, PNG, WEBP, or a camera RAW file.');
		return;
	}
	clearError();
	try {
		const source = isRaw ? await extractRawPreviewBlob(file) : file;
		await saveCurrentImage(source, file.name);
		location.href = pendingPresetId ? `/editor?preset=${pendingPresetId}` : '/editor';
	} catch (err) {
		showError(err instanceof Error ? err.message : 'Could not read this image file.');
	}
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
		if ((e.target as HTMLElement)?.closest('#dropzone-target')) return;
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

// --- Preset showcase ---

function showPendingPreset(id: string) {
	const preset = getPreset(id);
	pendingPresetId = preset.id;
	for (const card of presetShowcase.querySelectorAll<HTMLButtonElement>('[data-preset-id]')) {
		card.dataset.active = String(card.dataset.presetId === preset.id);
	}
	pendingPresetLabel.textContent = `${preset.name} selected — drop a photo below to apply it`;
	pendingPresetLabel.classList.remove('hidden');
}

presetShowcase.addEventListener('click', (e) => {
	const card = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-preset-id]');
	if (!card?.dataset.presetId) return;
	showPendingPreset(card.dataset.presetId);
	history.replaceState(null, '', `?preset=${card.dataset.presetId}`);
	dropzoneTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

if (pendingPresetId) {
	showPendingPreset(pendingPresetId);
}
