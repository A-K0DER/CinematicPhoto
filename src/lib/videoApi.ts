/**
 * Client for the separate `video-api` Worker (see ../../video-api/README.md).
 * Phase 1 spike: one hardcoded preset (Dark Knight), no auth/payment gate,
 * no streaming upload. Set PUBLIC_VIDEO_API_URL once video-api is deployed;
 * defaults to the local `wrangler dev` port for local testing.
 */
const VIDEO_API_BASE = import.meta.env.PUBLIC_VIDEO_API_URL ?? 'http://localhost:8787';

export type JobStatus =
	| { status: 'queued' }
	| { status: 'rendering' }
	| { status: 'done' }
	| { status: 'error'; message: string };

export async function submitVideoJob(file: File): Promise<string> {
	const res = await fetch(`${VIDEO_API_BASE}/jobs`, { method: 'POST', body: file });
	if (!res.ok) throw new Error(`Upload failed (${res.status}). Is video-api running?`);
	const data = (await res.json()) as { jobId: string };
	return data.jobId;
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
	const res = await fetch(`${VIDEO_API_BASE}/jobs/${jobId}`);
	if (!res.ok) throw new Error(`Could not check render status (${res.status}).`);
	return (await res.json()) as JobStatus;
}

export function jobOutputUrl(jobId: string): string {
	return `${VIDEO_API_BASE}/jobs/${jobId}/output`;
}
