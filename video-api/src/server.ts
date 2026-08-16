import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { getStatus, readOutput, runRender, saveSource, setStatus } from './render';

const PORT = Number(process.env.PORT) || 8787;

// Wide open for now — this is a local-only dev server with no auth/payment
// gate yet (Phase 1 spike). Tighten to the real site origin once there's an
// actual gate protecting /jobs.
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res: ServerResponse, body: unknown, status = 200): void {
	res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
	res.end(JSON.stringify(body));
}

async function readRequestBody(req: IncomingMessage): Promise<Buffer> {
	const chunks: Buffer[] = [];
	for await (const chunk of req) chunks.push(chunk as Buffer);
	return Buffer.concat(chunks);
}

const server = createServer(async (req, res) => {
	const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

	if (req.method === 'OPTIONS') {
		res.writeHead(204, CORS_HEADERS);
		res.end();
		return;
	}

	// POST /jobs — body is the raw video file. Kicks off a render and returns
	// immediately; the caller polls GET /jobs/:id for status.
	if (req.method === 'POST' && url.pathname === '/jobs') {
		const body = await readRequestBody(req);
		if (body.length === 0) {
			json(res, { error: 'Missing request body.' }, 400);
			return;
		}
		const jobId = randomUUID();
		await saveSource(jobId, body);
		setStatus(jobId, { status: 'queued' });
		void runRender(jobId);
		json(res, { jobId }, 202);
		return;
	}

	// GET /jobs/:id — poll for status.
	const statusMatch = url.pathname.match(/^\/jobs\/([^/]+)$/);
	if (req.method === 'GET' && statusMatch) {
		const status = getStatus(statusMatch[1]);
		if (!status) {
			json(res, { error: 'Unknown job id.' }, 404);
			return;
		}
		json(res, status);
		return;
	}

	// GET /jobs/:id/output — download the rendered file once status is "done".
	const outputMatch = url.pathname.match(/^\/jobs\/([^/]+)\/output$/);
	if (req.method === 'GET' && outputMatch) {
		const jobId = outputMatch[1];
		const status = getStatus(jobId);
		if (!status || status.status !== 'done') {
			json(res, { error: 'Job is not finished yet.' }, 409);
			return;
		}
		try {
			const output = await readOutput(jobId);
			res.writeHead(200, {
				'Content-Type': 'video/mp4',
				'Content-Length': String(output.length),
				...CORS_HEADERS,
			});
			res.end(output);
		} catch {
			json(res, { error: 'Rendered output is missing.' }, 404);
		}
		return;
	}

	json(res, { error: 'Not found.' }, 404);
});

server.listen(PORT, () => {
	console.log(`video-api listening on http://localhost:${PORT}`);
});
