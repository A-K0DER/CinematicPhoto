import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import { buildFfmpegArgs } from './ffmpeg';

const execFileAsync = promisify(execFile);

export type JobStatus =
	| { status: 'queued' }
	| { status: 'rendering' }
	| { status: 'done' }
	| { status: 'error'; message: string };

// In-memory job tracking and on-disk source/output files — this is a local
// dev server, not the deployed article; there's no R2/KV equivalent here.
const jobs = new Map<string, JobStatus>();
const DATA_DIR = path.join(process.cwd(), '.local-data');

export function setStatus(jobId: string, status: JobStatus): void {
	jobs.set(jobId, status);
}

export function getStatus(jobId: string): JobStatus | null {
	return jobs.get(jobId) ?? null;
}

function jobDir(jobId: string): string {
	return path.join(DATA_DIR, jobId);
}

function sourcePath(jobId: string): string {
	return path.join(jobDir(jobId), 'input.mp4');
}

function outputPath(jobId: string): string {
	return path.join(jobDir(jobId), 'output.mp4');
}

export async function saveSource(jobId: string, bytes: Buffer): Promise<void> {
	await mkdir(jobDir(jobId), { recursive: true });
	await writeFile(sourcePath(jobId), bytes);
}

export async function readOutput(jobId: string): Promise<Buffer> {
	return readFile(outputPath(jobId));
}

/**
 * Fired-and-forgotten by the /jobs route — the client already has the jobId
 * and polls GET /jobs/:id for this to finish.
 */
export async function runRender(jobId: string): Promise<void> {
	setStatus(jobId, { status: 'rendering' });
	try {
		if (!ffmpegPath) throw new Error('ffmpeg-static did not resolve a binary path for this platform.');
		const args = buildFfmpegArgs(sourcePath(jobId), outputPath(jobId));
		await execFileAsync(ffmpegPath, args, { maxBuffer: 1024 * 1024 * 64 });
		setStatus(jobId, { status: 'done' });
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		setStatus(jobId, { status: 'error', message: message.slice(-2000) });
	}
}
