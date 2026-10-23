# Stylized Lab: Architecture

## Tech stack

### Languages
- TypeScript 5 (strict)
- GLSL (custom toon/outline shaders)
- CSS (custom properties + CSS Modules)

### Frameworks & libraries
| Package | Role |
|---|---|
| `vite` | Dev server and build |
| `react`, `react-dom` 18 | UI |
| `three` | WebGL engine |
| `@react-three/fiber` | React renderer for three.js |
| `@react-three/drei` | Helpers (useGLTF, Environment, ScrollControls if needed, Outlines) |
| `@react-three/postprocessing` | Outline and edge pass, bloom, noise, chromatic aberration |
| `gsap` + `ScrollTrigger` + `@gsap/react` | Timeline and scroll animation |
| `lenis` | Smooth scroll, synced to the GSAP ticker |

### Tooling
- `@gltf-transform/cli`: compress and optimize `.glb` (Draco/Meshopt, KTX2/WebP textures, resize)
- `ffmpeg`: encode video loops (VP9 webm + H.264 mp4 fallback), extract frame sequences
- ESLint + Prettier

### Hosting
To be decided (Vercel or Netlify static). No backend.

## Project structure

```
/
├── CLAUDE.md
├── docs/
├── design/               # Reference only, never imported by code
│   ├── moodboard/
│   ├── layout/
│   └── prompts.md
├── assets-src/           # Raw generated assets (gitignored if large)
│   ├── images/
│   ├── models/
│   └── video/
├── public/               # Optimized, shipped assets
│   ├── models/
│   ├── textures/
│   ├── video/
│   └── frames/
└── src/
    ├── main.tsx
    ├── App.tsx           # Lenis + ScrollTrigger bootstrap, layout, <Stage/>
    ├── sections/
    │   ├── Hero/
    │   ├── Features/
    │   ├── Showcase/
    │   └── Cta/
    ├── scene/
    │   ├── Stage.tsx     # The single fixed <Canvas>
    │   ├── HeroModel.tsx
    │   ├── Lights.tsx
    │   └── Effects.tsx   # Postprocessing stack
    ├── shaders/
    │   ├── toonMaterial.ts
    │   └── outline.ts
    ├── components/       # SpeedLines, Halftone, PanelFrame, ImpactText...
    ├── lib/
    │   ├── lenis.ts
    │   ├── gsap.ts       # Plugin registration
    │   ├── useScrollProgress.ts
    │   └── useReducedMotion.ts
    └── styles/
        ├── tokens.css
        └── global.css
```

- **design/** and **assets-src/** keep generation work traceable without shipping it.
- **sections/** contains DOM content and section-level GSAP timelines.
- **scene/** contains everything in WebGL. Sections never import three.js directly. They talk to the scene through shared scroll progress or a small store.

## Architectural patterns

- **Single persistent canvas**: `Stage` is fixed full-screen behind the DOM (`pointer-events: none` except on interactive zones). One WebGL context means no context loss and lets the camera move continuously between sections.
- **Scroll as master timeline**: Lenis smooths the native scroll. Its `scroll` event calls `ScrollTrigger.update`, and the GSAP ticker drives `lenis.raf`. Each section registers a ScrollTrigger whose progress updates either DOM tweens or scene refs.
- **Scene state in refs or a tiny store**: Scroll progress goes into a mutable store (plain object or zustand transient updates) that `useFrame` reads every frame. No React re-renders at 60 fps.
- **Hybrid 3D strategy**: each section picks the technique that fits best:
  - real-time `.glb` + toon material (interactive hero)
  - `<video>` loop (complex stylized motion)
  - canvas frame-sequence scrub (cinematic "fake 3D" turnarounds)
- **Progressive enhancement**: the DOM ships a poster image first. The canvas fades in after the model is loaded. Reduced-motion users get static posters and no scroll-jacking.

## Render & scroll flow

```
User scroll
  → Lenis (smoothed scroll position)
  → ScrollTrigger.update()
  → section triggers compute progress 0..1
      ├── DOM tweens (impact text, panels, speed lines)
      └── write to sceneStore (camera target, model rotation, active section)
  → R3F useFrame reads sceneStore → lerps camera/model → renders
  → Effects pass (outline + grain) → screen
```
