// Hand-written for the Phase 1 spike rather than `wrangler types`, since the
// R2/KV bindings here point at resources you create yourself (see README.md)
// and `wrangler types` needs those to already exist to resolve correctly.

import type { Sandbox } from '@cloudflare/sandbox';

export interface Env {
	SANDBOX: DurableObjectNamespace<Sandbox>;
	VIDEO_BUCKET: R2Bucket;
	VIDEO_JOBS: KVNamespace;
}
