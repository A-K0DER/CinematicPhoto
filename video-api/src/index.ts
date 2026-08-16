import type { Env } from '../worker-configuration';
import { getStatus, outputKey, runRender, sourceKey } from './render';

export { Sandbox } from '@cloudflare/sandbox';

// TODO(user): before this leaves the spike stage, replace '*' with the
// real site origin (https://cinematicphoto.com) — wide open for now since
// there's no auth/payment gate yet to protect.
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...init.headers },
	});
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		// POST /jobs — body is the raw video file. Kicks off a render and
		// returns immediately; the caller polls GET /jobs/:id for status.
		//
		// No payment gate yet (Phase 1 spike, see the approved plan — Stripe
		// + job tokens are Phase 2). Do not expose this route publicly as-is.
		if (request.method === 'POST' && url.pathname === '/jobs') {
			if (!request.body) return json({ error: 'Missing request body.' }, { status: 400 });

			const jobId = crypto.randomUUID();
			await env.VIDEO_BUCKET.put(sourceKey(jobId), request.body);
			await env.VIDEO_JOBS.put(jobId, JSON.stringify({ status: 'queued' }), { expirationTtl: 60 * 60 * 48 });

			ctx.waitUntil(runRender(env, jobId));

			return json({ jobId }, { status: 202 });
		}

		// GET /jobs/:id — poll for status.
		const statusMatch = url.pathname.match(/^\/jobs\/([^/]+)$/);
		if (request.method === 'GET' && statusMatch) {
			const status = await getStatus(env, statusMatch[1]);
			if (!status) return json({ error: 'Unknown job id.' }, { status: 404 });
			return json(status);
		}

		// GET /jobs/:id/output — download the rendered file once status is "done".
		const outputMatch = url.pathname.match(/^\/jobs\/([^/]+)\/output$/);
		if (request.method === 'GET' && outputMatch) {
			const jobId = outputMatch[1];
			const status = await getStatus(env, jobId);
			if (!status || status.status !== 'done') {
				return json({ error: 'Job is not finished yet.' }, { status: 409 });
			}
			const object = await env.VIDEO_BUCKET.get(outputKey(jobId));
			if (!object) return json({ error: 'Rendered output is missing.' }, { status: 404 });
			return new Response(object.body, {
				headers: { 'Content-Type': 'video/mp4', ...CORS_HEADERS },
			});
		}

		return json({ error: 'Not found.' }, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
