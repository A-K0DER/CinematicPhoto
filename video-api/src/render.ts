import { getSandbox } from '@cloudflare/sandbox';
import type { Env } from '../worker-configuration';
import { buildFfmpegCommand } from './ffmpeg';

export type JobStatus =
	| { status: 'queued' }
	| { status: 'rendering' }
	| { status: 'done' }
	| { status: 'error'; message: string };

export const sourceKey = (jobId: string) => `source/${jobId}.mp4`;
export const outputKey = (jobId: string) => `output/${jobId}.mp4`;

async function setStatus(env: Env, jobId: string, status: JobStatus) {
	await env.VIDEO_JOBS.put(jobId, JSON.stringify(status), { expirationTtl: 60 * 60 * 48 });
}

export async function getStatus(env: Env, jobId: string): Promise<JobStatus | null> {
	const raw = await env.VIDEO_JOBS.get(jobId);
	return raw ? (JSON.parse(raw) as JobStatus) : null;
}

/**
 * Runs in `ctx.waitUntil()` — the request that kicked off the job has
 * already returned a jobId to the client, which polls GET /jobs/:id for
 * this to finish.
 *
 * Phase-1 shortcut: the source is pulled from R2 into Worker memory and
 * base64-written into the sandbox (`writeFile(..., { encoding: 'base64' })`)
 * rather than streamed, since the Sandbox SDK's file API is string/base64
 * based. Fine for the spike's small test clips; before raising the v1 size
 * cap (~300MB in the plan) this should move to a presigned-URL + curl
 * transfer so the Worker never buffers the whole file.
 */
export async function runRender(env: Env, jobId: string): Promise<void> {
	const sandbox = getSandbox(env.SANDBOX, jobId);

	try {
		await setStatus(env, jobId, { status: 'rendering' });

		const source = await env.VIDEO_BUCKET.get(sourceKey(jobId));
		if (!source) throw new Error('Source object missing from R2 — upload may not have finished.');
		const sourceBytes = await source.arrayBuffer();

		const inputPath = '/workspace/input.mp4';
		const outputPath = '/workspace/output.mp4';
		await sandbox.writeFile(inputPath, Buffer.from(sourceBytes).toString('base64'), { encoding: 'base64' });

		const result = await sandbox.exec(buildFfmpegCommand(inputPath, outputPath), { timeout: 180_000 });
		if (!result.success) {
			throw new Error(`ffmpeg exited ${result.exitCode}: ${result.stderr.slice(-2000)}`);
		}

		const output = await sandbox.readFile(outputPath, { encoding: 'base64' });
		await env.VIDEO_BUCKET.put(outputKey(jobId), Buffer.from(output.content, 'base64'), {
			httpMetadata: { contentType: 'video/mp4' },
		});

		await setStatus(env, jobId, { status: 'done' });
	} catch (err) {
		await setStatus(env, jobId, { status: 'error', message: err instanceof Error ? err.message : String(err) });
	} finally {
		await sandbox.destroy();
	}
}
