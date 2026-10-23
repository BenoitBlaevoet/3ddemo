# Stylized Lab: Pipeline Notes

Experiment log. This file is the real deliverable: an honest record of what each tool and technique produced, what it cost, and whether to reuse it.

## Comparison matrix

Fill in as experiments complete. Scores are 1–5.

| Technique | Visual quality | Style fidelity (cel-shaded) | Effort | Payload | Perf | Verdict |
|---|---|---|---|---|---|---|
| Procedural R3F model + toon shader (GULP v1) | 4 | 5 | 3 | 5 (0 assets) | 4 | Baseline. Perfect consistency, easy colorways |
| Real-time `.glb` + toon shader | | | | | | |
| AI video loop | | | | | | |
| Frame-sequence scrub | | | | | | |
| SVG + GSAP (2D motion) | | | | | | |

## Tool notes

### Krea
- 2026-10-23: MCP connected, but the free plan has only 2 compute units. Preflight cost per 1K 1:1 image: Krea 2 Turbo 2, Z Image ~3.3, Flux 2 Klein ~3.9, Krea 2 Medium 9. Not enough for a moodboard. Not tested yet.
- Tip: `generate_image` with `preflight: true` returns an exact cost quote and charges nothing. Use it before any batch.

### Recraft
- `recraftv4_1_raster` with no custom style costs 2 credits per 1024px image and returns WebP. 29 images = 58 credits, a few minutes with parallel calls.
- The cel-shaded look comes through from the prompt alone: ink outlines, hard shadows and flat color are consistent across all concepts.
- Weak spot: **product consistency**. The same product drifts between generations (the GULP bottle turns into a jug or jerrycan; BLIP buds become stem-style buds in the action shots). A locked custom style or a reference image (img2img) is needed before final assets.
- Weak spot: proportion words ("chubby", "squat") are only partly respected.
- Color blocking matters: two flat halves plus a solid black shadow read as a flag. Ask for a darker-tone shadow instead of black, and a shaped band instead of halves.

### Image-to-3D (Meshy / Tripo / Rodin)
_No experiments yet._

### Claude Design
_No experiments yet._

## Log

Entry format:

```
### YYYY-MM-DD — {experiment}
- Tool / settings:
- Result:
- Time / credits:
- Keep? Why:
```

### 2026-10-23: Concept moodboards (4 concepts x 6 images)
- Tool / settings: Recraft `recraftv4_1_raster`, default style, 1:1. Per concept: 3 hero variations, 2 action panels, 1 seamless pattern.
- Result: all 4 boards work as direction. Best palette: BLIP. Best 3D candidate: POPPO. Best manga energy: SNAPPY action. Least consistent product: GULP. Board: `design/moodboard/index.html`.
- Time / credits: ~15 min, 58 Recraft credits (29 images, incl. 1 rejected v0). Krea: 0 (budget).
- Keep? Yes, as Phase 0 direction. Next: pick 1 concept, then build a Recraft custom style from 3–5 picks to fix product drift.

### 2026-10-23: GULP concept page, procedural 3D bottle
- Tool / settings: R3F + three 0.170, `MeshToonMaterial` with a 2-tone `DataTexture` gradient (110/255, NearestFilter), custom inverted-hull outlines, `<Canvas flat>` (no tone mapping, so flat colors stay exact), ambient 1.05 + key light 2.1 from (-4, 3, 2.5).
- Result: reads as a cel-shaded anime product in every pose. The bottle is identical across 5 colorways and every scroll stage, which fixes the main moodboard flaw. The impact-frame swap (2 × 75 ms flashes) sells the color change.
- Cheap anime tricks that worked: painted white highlight strips on a non-spinning layer (they stay locked to the light while the bottle turns), a flat contact-shadow ellipse, squash and stretch on every splash, a spring on the straw for overshoot, a canvas-texture wordmark wrapped on a cylinder.
- Failed: drei `<Outlines>` (rendered nothing, see ADR-008). `body { overflow-x: hidden }` plus `html { overflow-x: clip }` made body the scroll container and broke every sticky section. `position: sticky` creates a stacking context, so anything meant to sit under the canvas needs its own underlay layer.
- Testing note: the Claude-in-Chrome window is throttled to ~1.5 fps when it's not in the foreground, so time-based effects look slow in screenshots. Damping now uses real delta (clamped at 0.5 s) so poses still land.
- Time / credits: ~2 h, 0 generation credits. Payload: 0 assets, JS 1.13 MB (328 KB gzip), mostly three.js.
- Keep? Yes. This is the baseline the image-to-3D and fake-3D variants must beat.
