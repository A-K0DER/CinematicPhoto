# cinematicphoto-video-api

Phase 1 infra spike from the approved video-grading plan: prove the
upload → ffmpeg render → download loop works end-to-end, with one
hardcoded LUT-backed preset (Dark Knight) and no payment gate yet. A
separate project from the main Astro site on purpose — see the plan for
why.

Runs as a plain local Node HTTP server — no Docker, no Cloudflare
Containers/Sandbox. ffmpeg comes from the `ffmpeg-static` npm package (a
prebuilt binary for your platform), so nothing needs to be installed
system-wide.

## What's here

- `src/server.ts` — the HTTP server. Routes: `POST /jobs` (upload + start a
  render), `GET /jobs/:id` (poll status), `GET /jobs/:id/output` (download
  once done).
- `src/render.ts` — the actual render: writes the upload to `.local-data/`,
  runs ffmpeg via `ffmpeg-static`, tracks job status in memory.
- `src/ffmpeg.ts` — builds the ffmpeg args for the one Phase-1 preset.
- `assets/luts/dark-knight.cube` — the LUT (same file the browser-side
  photo editor uses).

## Running it

```
npm install
npm run dev
```

Listens on `http://localhost:8787` by default (override with `PORT`).
Uploaded/rendered files land in `.local-data/<jobId>/` (gitignored) —
delete that directory any time to clear old jobs; nothing else depends on
it surviving a restart, since job status is in-memory only.

Exercise the loop against a short test clip:

```
curl -X POST --data-binary @tmp-test/input.mp4 http://localhost:8787/jobs
# => {"jobId":"..."}

curl http://localhost:8787/jobs/<jobId>
# => {"status":"rendering"} then eventually {"status":"done"}

curl http://localhost:8787/jobs/<jobId>/output -o graded.mp4
```

Open `graded.mp4` and confirm the Dark Knight LUT was actually applied.

## Known shortcuts to revisit before this is real

- **No payment gate.** `POST /jobs` is wide open. A later phase adds a real
  gate this route should require.
- **CORS is `*`.** Tighten to the real site origin once there's an actual
  gate protecting this route.
- **The whole upload is buffered into server memory** before being written
  to disk — fine for spike-scale clips, revisit before raising the size cap
  much past what fits comfortably in memory.
- **One preset, no grain/vignette/glow/letterbox/stamp.** A later phase
  maps the rest of `src/lib/presets.ts` (in the main site) onto ffmpeg
  filters.
- **Job status is in-memory and files live on local disk** — this only
  works as a single local dev process. Deploying this for real (multiple
  instances, durability, a real storage backend) is a separate decision to
  make later, not assumed by this code.
