# Preset LUTs

Drop a `.cube` 3D LUT file here named after the matching preset id from
`src/lib/presets.ts`, e.g. `dark-knight.cube`, `blade-runner.cube`.

The editor (`src/lib/engine.ts`) fetches `/luts/<preset-id>.cube` for the
active preset. If the file doesn't exist, it silently falls back to that
preset's CSS filter approximation — nothing breaks either way, so LUTs can
be added incrementally, one preset at a time.

## Exporting a LUT from Lightroom

Lightroom has no native "export as LUT" button, but the standard round-trip
works reliably:

1. Generate an identity Hald CLUT image (e.g. via
   [IWLTBAP LUT Generator](https://generator.iwltbap.com/) or
   [lutcreator.js](https://project.iwltbap.com/lutcreator/)).
2. Open it in Lightroom and apply the grade using only the Basic panel, Tone
   Curve, HSL/Color, and Color Grading (split-toning). Leave Detail, Lens
   Corrections, Transform, Effects, and Calibration off — a LUT can only
   encode a pure per-pixel color transform, not spatial or detail effects
   (grain/vignette are already handled separately by the editor itself).
3. Export the graded Hald image flat: PNG (no compression) or JPG (100%
   quality), no resizing, no output sharpening.
4. Convert it back to `.cube` with the same tool.
5. Drop the resulting file here, named after the preset id.
