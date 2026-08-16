import { getJobStatus, jobOutputUrl, submitVideoJob, type JobStatus } from './videoApi';

const videoPreview = document.getElementById('video-preview') as HTMLVideoElement;
const videoDropzone = document.getElementById('video-dropzone') as HTMLLabelElement;
const videoFileInput = document.getElementById('video-file-input') as HTMLInputElement;
const videoDropzoneError = document.getElementById('video-dropzone-error') as HTMLParagraphElement;
const renderBtn = document.getElementById('video-render-btn') as HTMLButtonElement;
const statusEl = document.getElementById('video-status') as HTMLParagraphElement;

const navReset = document.getElementById('nav-reset') as HTMLButtonElement;
const navRemove = document.getElementById('nav-remove') as HTMLButtonElement;
const navExport = document.getElementById('nav-export') as HTMLButtonElement;

interface State {
	file: File | null;
	sourceUrl: string | null;
	gradedUrl: string | null;
	jobId: string | null;
	phase: 'idle' | 'uploading' | 'queued' | 'rendering' | 'done' | 'error';
}

const state: State = { file: null, sourceUrl: null, gradedUrl: null, jobId: null, phase: 'idle' };

let pollTimer: ReturnType<typeof setTimeout> | null = null;

function showDropzoneError(message: string) {
	videoDropzoneError.textContent = message;
	videoDropzoneError.classList.remove('hidden');
}

function clearDropzoneError() {
	videoDropzoneError.classList.add('hidden');
	videoDropzoneError.textContent = '';
}

function showEmptyState() {
	videoPreview.classList.add('hidden');
	videoPreview.removeAttribute('src');
	videoDropzone.classList.remove('hidden');
	videoDropzone.classList.add('flex');
	navExport.disabled = true;
	renderBtn.disabled = true;
	statusEl.textContent = '';
}

function showPreview() {
	videoDropzone.classList.add('hidden');
	videoDropzone.classList.remove('flex');
	videoPreview.classList.remove('hidden');
}

function stopPolling() {
	if (pollTimer !== null) {
		clearTimeout(pollTimer);
		pollTimer = null;
	}
}

function describeStatus(status: JobStatus['status']): string {
	switch (status) {
		case 'queued':
			return 'Queued…';
		case 'rendering':
			return 'Rendering with ffmpeg…';
		case 'done':
			return 'Done — showing the graded result.';
		case 'error':
			return 'Render failed.';
	}
}

async function pollJob(jobId: string) {
	let result: JobStatus;
	try {
		result = await getJobStatus(jobId);
	} catch (err) {
		state.phase = 'error';
		statusEl.textContent = err instanceof Error ? err.message : 'Could not check render status.';
		renderBtn.disabled = false;
		renderBtn.textContent = 'Retry';
		return;
	}

	if (state.jobId !== jobId) return; // a newer job superseded this one

	statusEl.textContent = describeStatus(result.status);

	if (result.status === 'queued' || result.status === 'rendering') {
		state.phase = result.status;
		pollTimer = setTimeout(() => pollJob(jobId), 3000);
		return;
	}

	if (result.status === 'error') {
		state.phase = 'error';
		statusEl.textContent = `Render failed: ${result.message}`;
		renderBtn.disabled = false;
		renderBtn.textContent = 'Retry';
		return;
	}

	// done — fetched as a blob rather than pointed at directly, since some
	// browsers won't reliably start a <video> element on a cross-origin URL
	// even with permissive CORS headers.
	statusEl.textContent = 'Downloading graded result…';
	try {
		const res = await fetch(jobOutputUrl(jobId));
		if (!res.ok) throw new Error(`Could not download the graded video (${res.status}).`);
		const blob = await res.blob();
		if (state.jobId !== jobId) return; // a newer job superseded this one
		if (state.gradedUrl) URL.revokeObjectURL(state.gradedUrl);
		state.gradedUrl = URL.createObjectURL(blob);
		videoPreview.src = state.gradedUrl;
	} catch (err) {
		state.phase = 'error';
		statusEl.textContent = err instanceof Error ? err.message : 'Could not download the graded video.';
		renderBtn.disabled = false;
		renderBtn.textContent = 'Retry';
		return;
	}

	state.phase = 'done';
	statusEl.textContent = describeStatus('done');
	navExport.disabled = false;
	renderBtn.disabled = false;
	renderBtn.textContent = 'Re-render';
}

async function startRender() {
	if (!state.file) return;
	stopPolling();
	state.phase = 'uploading';
	state.jobId = null;
	navExport.disabled = true;
	renderBtn.disabled = true;
	renderBtn.textContent = 'Uploading…';
	statusEl.textContent = 'Uploading…';

	try {
		const jobId = await submitVideoJob(state.file);
		state.jobId = jobId;
		state.phase = 'queued';
		renderBtn.textContent = 'Rendering…';
		statusEl.textContent = describeStatus('queued');
		pollTimer = setTimeout(() => pollJob(jobId), 1500);
	} catch (err) {
		state.phase = 'error';
		statusEl.textContent = err instanceof Error ? err.message : 'Upload failed.';
		renderBtn.disabled = false;
		renderBtn.textContent = 'Retry';
	}
}

function loadFile(file: File) {
	if (!file.type.startsWith('video/')) {
		showDropzoneError('That file type is not supported. Try an MP4, MOV, or WEBM video.');
		return;
	}
	clearDropzoneError();
	stopPolling();

	if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
	if (state.gradedUrl) URL.revokeObjectURL(state.gradedUrl);
	state.file = file;
	state.sourceUrl = URL.createObjectURL(file);
	state.gradedUrl = null;
	state.jobId = null;
	state.phase = 'idle';

	videoPreview.src = state.sourceUrl;
	showPreview();
	navExport.disabled = true;
	renderBtn.disabled = false;
	renderBtn.textContent = 'Apply grade';
	statusEl.textContent = '';
}

function reset() {
	stopPolling();
	if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
	if (state.gradedUrl) URL.revokeObjectURL(state.gradedUrl);
	state.file = null;
	state.sourceUrl = null;
	state.gradedUrl = null;
	state.jobId = null;
	state.phase = 'idle';
	showEmptyState();
}

showEmptyState();

// --- Video upload (dropzone, drag & drop, paste) ---

videoFileInput.addEventListener('change', () => {
	const file = videoFileInput.files?.[0];
	videoFileInput.value = '';
	if (file) loadFile(file);
});

for (const evt of ['dragenter', 'dragover']) {
	videoDropzone.addEventListener(evt, (e) => {
		e.preventDefault();
		videoDropzone.classList.add('border-zinc-500', 'bg-canvas-soft-2');
	});
}

for (const evt of ['dragleave', 'dragend']) {
	videoDropzone.addEventListener(evt, (e) => {
		e.preventDefault();
		videoDropzone.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	});
}

videoDropzone.addEventListener('drop', (e) => {
	e.preventDefault();
	videoDropzone.classList.remove('border-zinc-500', 'bg-canvas-soft-2');
	const file = e.dataTransfer?.files?.[0];
	if (file) loadFile(file);
});

for (const evt of ['dragover', 'drop']) {
	window.addEventListener(evt, (e) => {
		if ((e.target as HTMLElement)?.closest('#video-dropzone')) return;
		e.preventDefault();
	});
}

window.addEventListener('paste', (e) => {
	if (state.file) return; // "New video" is the explicit way to replace an existing clip
	const items = e.clipboardData?.items;
	if (!items) return;
	for (const item of items) {
		if (item.type.startsWith('video/')) {
			const file = item.getAsFile();
			if (file) loadFile(file);
			break;
		}
	}
});

// --- Render ---

renderBtn.addEventListener('click', startRender);

// --- Nav actions ---

navReset.addEventListener('click', () => {
	videoFileInput.click();
});

navRemove.addEventListener('click', reset);

navExport.addEventListener('click', () => {
	if (!state.jobId || state.phase !== 'done') return;
	window.open(jobOutputUrl(state.jobId), '_blank');
});
