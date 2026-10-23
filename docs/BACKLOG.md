# Stylized Lab: Backlog

## Phase 0: Direction

- [x] Choose the fictional product: **GULP**, chunky flip-straw bottle, "Sip happens." (ADR-007)
- [x] Moodboard: 25 cel-shaded explorations across 4 concepts → `design/moodboard/` (Recraft, see ADR-006)
- [ ] Krea test: same prompts on Krea 2 Medium once credits are available, compare with Recraft
- [ ] Create a Recraft custom style from 3–5 picks and log the style ID (ADR)
- [x] Define palette and typography tokens: 5 colorways in `src/lib/colorways.ts`, Dela Gothic One + Outfit
- [x] Write homepage section plan + motion intent per section (`design/layout/NOTES.md`)
- [ ] (Optional) Static layout in Claude Design → `design/layout/`

## Phase 1: Scaffold

- [x] `git init`, `.gitignore` (node_modules, dist, large `assets-src/` files)
- [x] Vite + React + TS scaffold, ESLint + Prettier
- [x] Install three, R3F, drei, gsap, @gsap/react, lenis (postprocessing not needed yet)
- [x] Lenis ↔ ScrollTrigger sync in `src/lib/`
- [x] `Stage` fixed canvas + placeholder object + toon material + outline pass
- [x] `tokens.css` + `global.css`
- [x] `useReducedMotion` hook (no intro, idle, shuffle, flashes or marquee when reduced)
- [ ] Static poster fallback when WebGL is unavailable (render the bottle once, export a WebP)

## Phase 1.5: GULP concept page (done 2026-10-23)

- [x] Procedural cel-shaded bottle: toon ramp, ink outlines, highlight strips, wordmark
- [x] Scroll choreography: hero drop-in, flip (straw pop), colorways, exploded specs, CTA
- [x] 5 colorways, same geometry, impact-frame blink swap + auto shuffle
- [x] Toon droplet bursts, squash and stretch, speed lines, halftone, marquees
- [x] Phone layout (portrait poses, panel deck)
- [x] `git init` + first commit, pushed to github.com/BenoitBlaevoet/3ddemo
- [ ] Code-split three.js chunk (1.1 MB JS)
- [ ] Real-device mobile check (tested only in 390 px iframes)
- [ ] Use a bottle render as the img2img reference for consistent 2D assets (Recraft)

## Phase 2: Hero (pipeline proof)

- [ ] Generate a clean hero product image (Recraft, custom style)
- [ ] Image-to-3D: try Meshy, Tripo and Rodin, compare, keep the best
- [ ] Optimize the `.glb`, apply toon material and outlines
- [ ] Hero scroll choreography (rotate, camera push, impact text)
- [ ] Fake-3D variant of the same hero (video loop or frame scrub) for direct comparison
- [ ] Fill the comparison matrix in `PIPELINE_NOTES.md`

## Phase 3: Full homepage

- [ ] Features section: manga panels + SVG speed lines + halftone
- [ ] Showcase section: technique picked from the Phase 2 results
- [ ] CTA / footer: impact frame transition
- [ ] Mobile layout + static fallback

## Phase 4: Polish & wrap-up

- [ ] Performance pass (payload, fps, LCP)
- [ ] Accessibility pass (contrast, reduced motion, keyboard)
- [x] Deploy: GitHub Pages via Actions on push to `main` (ADR-009)
- [ ] Final write-up in `PIPELINE_NOTES.md`: recommended pipeline for future projects

## Nice to have

- [ ] Mouse-reactive hero (parallax tilt, hover smear)
- [ ] Custom cursor with speed-line trail
- [ ] Sound design toggle (whoosh on section impacts)

---

_Update at the end of every session: tick completed items and add new ones._
