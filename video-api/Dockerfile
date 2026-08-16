FROM docker.io/cloudflare/sandbox:0.12.7

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Phase 1 spike ships with a single hardcoded LUT-backed preset (see
# src/ffmpeg.ts). Copied from ../public/luts/dark-knight.cube in the main
# Astro site as a one-time snapshot — re-copy if that file changes.
# Widening to the full preset library is Phase 3 in the approved plan.
COPY assets/luts/ /luts/

EXPOSE 8080
