# Stylized Lab: Decision Log

Each significant technical or art direction decision is recorded here in a simplified ADR (Architecture Decision Record) format.

---

## ADR-001: Build motion and 3D in code, use design tools for static reference only

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: Claude Design, Krea and Recraft produce static images or layouts. The target page relies on scroll animation and 3D, which mockups can't express.
- **Decision**: AI tools produce assets and static layout references. All motion, 3D and interaction is authored directly in code.
- **Reason**: Code is the only medium where timing, scroll coupling and real-time 3D can be judged. Mockups become references, not specs.
- **Alternatives rejected**: Full design in Figma or Claude Design with prototype animations (too limited for 3D and scroll). Webflow + Spline (less control, harder to version and to run experiments in).

---

## ADR-002: Stack: Vite + React + React Three Fiber + GSAP ScrollTrigger + Lenis

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: Need real-time 3D, scroll-driven timelines and fast iteration.
- **Decision**: Vite + React 18 + TypeScript, R3F + drei + postprocessing, GSAP ScrollTrigger, Lenis.
- **Reason**: R3F has the strongest ecosystem for declarative three.js (`useGLTF`, Outlines, effects). GSAP ScrollTrigger is the reference tool for scroll choreography. Lenis gives smooth scroll that stays in sync with GSAP. Vite gives instant HMR for visual tuning.
- **Alternatives rejected**: Astro (good for static content, but adds island complexity around one persistent canvas). Vanilla three.js (more boilerplate). Spline embed (fast, but heavy runtime and limited shader control for cel-shading). Framer Motion (weaker for scroll-scrubbed timelines).

---

## ADR-003: Art direction: anime cel-shaded

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: Need a highly stylized look to stress-test the pipeline.
- **Decision**: Anime cel-shading: toon ramps, ink outlines, flat bold palette, manga graphic language.
- **Reason**: Real-time toon shading is achievable in three.js. It also tests whether AI-generated 3D (usually realistic textures) can be restyled. And it puts real-time and fake 3D in direct competition, since AI video handles anime styles well.
- **Alternatives rejected**: Y2K chrome, claymorphism, brutalist.

---

## ADR-004: Plain CSS + CSS Modules + design tokens (no Tailwind)

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: Highly custom one-off visual design with heavy GSAP manipulation of DOM elements.
- **Decision**: CSS custom properties for tokens, CSS Modules per component.
- **Reason**: Bespoke layouts gain little from utility classes. Tokens stay readable from both CSS and JS (GSAP can tween CSS variables).
- **Alternatives rejected**: Tailwind (noisy markup for art-directed layouts), styled-components (runtime cost).

---

## ADR-005: Single persistent WebGL canvas

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: Several sections may show 3D.
- **Decision**: One fixed full-screen `<Canvas>` behind the DOM. Sections drive it through a shared scroll store.
- **Reason**: Avoids multiple WebGL contexts (memory, context loss) and allows continuous camera moves between sections.
- **Alternatives rejected**: One canvas per section; drei `<View>` scissoring (to revisit if needed).

---

## ADR-006: Phase 0 moodboards generated with Recraft instead of Krea

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: The Krea MCP is connected, but the free account has 2 compute units, enough for at most one Turbo image. The pipeline plan puts Krea first for exploration.
- **Decision**: Generate all 4 concept moodboards with Recraft V4.1 raster (default style). Krea stays in the pipeline and gets tested once credits are available.
- **Reason**: Unblocks concept selection now at low cost (2 credits per image). One model for all 4 boards keeps the concept comparison fair.
- **Alternatives rejected**: 1 Krea + 3 Recraft (mixed models skew the comparison); upgrading Krea first (decided against by the user).
- **Consequence**: The Krea vs Recraft comparison is still open. Log it in PIPELINE_NOTES once Krea is tested.

---

## ADR-007: GULP is the product; the hero bottle is procedural real-time 3D

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: The user picked GULP (flip-straw bottle). The main flaw in the moodboard is product drift: every generated image showed a different bottle. The brief says the bottle must be either strictly identical everywhere, or deliberately different colorways that swap with a "blink".
- **Decision**: Build the bottle in code (lathe body and lid, cylinder grip band, flip straw on a spring hinge, torus carry loop) with toon materials and inverted-hull ink outlines. Colorways change only material colors. The swap hides behind a 2-frame anime impact flash (white silhouette on black focus lines, then ink silhouette on white).
- **Reason**: Guarantees one identical silhouette in every shot, every angle and every colorway. No image-to-3D cleanup. Moving parts (straw pop, exploded view) come for free because every part is a separate mesh. Zero asset payload.
- **Alternatives rejected for this pass**: image-to-3D from a Recraft render (one mesh, so no moving parts, and texture style drift); fake 3D video (cannot recolor live, which kills the colorway feature).
- **Consequence**: Image-to-3D is still to be tested in Phase 2 as the comparison point. Use the procedural bottle as the reference silhouette and as the img2img source to lock 2D assets.

---

## ADR-008: Custom inverted-hull outlines instead of drei `<Outlines>`

- **Date**: 2026-10-23
- **Status**: Accepted
- **Context**: drei 9.117 `<Outlines>` rendered nothing on our meshes (no error).
- **Decision**: `shaders/inkOutline.ts`: a BackSide `MeshBasicMaterial` that pushes vertices along `normal` in `onBeforeCompile`, cached per thickness. Wrapped in `scene/InkedMesh.tsx`. The droplets use the same idea with a second InstancedMesh.
- **Reason**: ~20 lines, predictable, works on any geometry, thickness in object units.
- **Gotcha**: `MeshBasicMaterial` has no `objectNormal` in its vertex shader. Use the `normal` attribute, or the program silently fails to compile.

---

## ADR-009: Hosting on GitHub Pages via Actions

- **Date**: 2026-10-23
- **Status**: Accepted (replaces the "Vercel or Netlify" placeholder in ARCHITECTURE)
- **Decision**: A workflow on push to `main` runs `npm ci`, lint and build, then `actions/deploy-pages`. Vite `base: '/3ddemo/'` applies to builds only.
- **Reason**: The site is fully static, there's no extra account to manage, and the code and demo live in one place.
- **Constraint**: Pages needs a public repo on the current GitHub plan.

---

_To add a decision, copy the template above and increment the ADR number._
