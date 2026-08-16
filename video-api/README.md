# cinematicphoto-video-api

Phase 1 infra spike from the approved video-grading plan: prove the
upload → ffmpeg render → download loop works end-to-end, with one
hardcoded LUT-backed preset (Dark Knight) and no payment gate yet. A
separate Workers project from the main Astro site on purpose — see the
plan for why.

## What's here

- `wrangler.jsonc` — Container binding (`SANDBOX`, runs ffmpeg via
  `@cloudflare/sandbox`), an R2 bucket binding (`VIDEO_BUCKET`), and a KV
  namespace binding (`VIDEO_JOBS`) for job status.
- `Dockerfile` — the Sandbox base image + `ffmpeg` + the Dark Knight
  `.cube` LUT (copied from `../public/luts/dark-knight.cube`).
- `src/index.ts` — routes: `POST /jobs` (upload + start a render),
  `GET /jobs/:id` (poll status), `GET /jobs/:id/output` (download once done).
- `src/render.ts` — the actual render: pulls the source from R2, hands it
  to the sandbox, runs ffmpeg, writes the result back to R2.
- `src/ffmpeg.ts` — builds the ffmpeg command for the one Phase-1 preset.

## What you need to provision before this runs

I can't create real Cloudflare account resources on your behalf — these
need your login and account:

1. `wrangler login` (from this directory, or anywhere — it's account-wide).
2. `wrangler r2 bucket create cinematicphoto-video`
3. `wrangler kv namespace create VIDEO_JOBS` — copy the returned id into
   `wrangler.jsonc`'s `kv_namespaces[0].id` (currently a placeholder).
4. Containers require your account to have the Containers feature enabled
   — check `wrangler containers --help` / the Cloudflare dashboard if
   `wrangler dev` complains about it.

## Running it

```
npm install
npm run dev
```

Then, from another terminal, exercise the loop against a short test clip:

```
curl -X POST --data-binary @test-clip.mp4 http://localhost:8787/jobs
# => {"jobId":"..."}

curl http://localhost:8787/jobs/<jobId>
# => {"status":"rendering"} then eventually {"status":"done"}

curl http://localhost:8787/jobs/<jobId>/output -o graded.mp4
```

Open `graded.mp4` and confirm the Dark Knight LUT was actually applied.

## Known shortcuts to revisit before this is real

- **No payment gate.** `POST /jobs` is wide open. Phase 2 in the plan adds
  Stripe Checkout + a single-use job token this route should require.
- **CORS is `*`.** Tighten to the real site origin once there's an actual
  gate protecting this route.
- **The source video is buffered into Worker memory and base64-encoded**
  into the sandbox (see the comment in `render.ts`) rather than streamed.
  Fine for small spike clips; revisit before raising the ~300MB v1 cap
  from the plan.
- **One preset, no grain/vignette/glow/letterbox/stamp.** Phase 3 in the
  plan maps the rest of `src/lib/presets.ts` onto ffmpeg filters.
- **R2 objects never expire.** The plan calls for a ~48h lifecycle rule on
  the bucket (`source/` and `output/` prefixes) — not set up yet; add via
  `wrangler r2 bucket lifecycle` or the dashboard.
