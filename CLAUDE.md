# Stylized Lab

Experimental homepage for a fictional product, built to validate an AI-assisted pipeline for highly stylized, 3D-heavy web design (anime cel-shaded look).

## Identity

- **Type**: Single-page marketing site / homepage (pipeline test bench)
- **State**: New project, nothing built yet
- **Audience**: Internal: the goal is to learn which workflow produces the best stylized 3D web results. A secondary goal is a portfolio-quality demo.
- **Art direction**: Anime cel-shaded. Toon shading, ink outlines, flat bold colors, hard shadows, speed lines, manga-panel compositions.

## Pipeline being tested

```
Krea (exploration, moodboard, hero renders)
  → Recraft (locked custom style, consistent assets, SVG vectors)
  → Claude Design (optional static layout reference)
  → 3D: image-to-3D (Meshy / Tripo / Rodin) → .glb   OR   fake 3D (image-to-video / frame sequence)
  → Code: Vite + React + R3F + GSAP ScrollTrigger + Lenis
```

The point is to compare **real-time 3D** with **fake 3D** (video and frame sequences) for a stylized look. Record findings in `docs/DECISIONS.md` and `docs/PIPELINE_NOTES.md`.

## Tech stack

- **Language**: TypeScript (strict)
- **Build**: Vite
- **UI**: React 18
- **3D**: three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Motion**: GSAP + ScrollTrigger (via `@gsap/react` `useGSAP`), Lenis smooth scroll
- **Styling**: Plain CSS with CSS custom properties (design tokens) and CSS Modules per component
- **Asset tooling**: `@gltf-transform/cli` (Draco/Meshopt and texture compression), ffmpeg (webm/mp4 encoding, frame extraction)
- **Asset generation**: Recraft (MCP connected in Claude Code), Krea (manual, web UI), image-to-3D services (manual)

## Architecture

```
/
├── CLAUDE.md
├── docs/                 # Project memory (brief, decisions, backlog, notes)
├── design/               # Not shipped: moodboards, prompts, layout refs
│   ├── moodboard/
│   ├── layout/           # Claude Design exports / screenshots
│   └── prompts.md        # Every generation prompt that produced a kept asset
├── assets-src/           # Not shipped: raw, high-res, unoptimized sources
│   ├── images/
│   ├── models/           # Raw .glb from image-to-3D
│   └── video/
├── public/               # Shipped, optimized assets only
│   ├── models/
│   ├── textures/
│   ├── video/
│   └── frames/           # Scroll-scrub image sequences
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── sections/         # One folder per homepage section (Hero, Features...)
    ├── scene/            # R3F canvas, models, lights, cameras
    ├── shaders/          # Toon / outline / custom GLSL materials
    ├── components/       # Reusable UI (Button, SpeedLines, PanelFrame...)
    ├── lib/              # gsap/lenis setup, hooks, utils
    └── styles/           # tokens.css, global.css
```

### Key patterns

- **One persistent `<Canvas>`** behind the page, fixed position. Sections drive the scene through scroll progress. Never mount one canvas per section.
- **Scroll is the timeline.** Lenis feeds ScrollTrigger, and ScrollTrigger progress drives both DOM and 3D animation.
- **Per-frame animation lives in refs and `useFrame`**, never in React state.
- **Cel-shading via materials and post-processing**: `MeshToonMaterial` with a stepped gradient map, inverted-hull or post-process outlines.
- **Every section works without 3D.** A static poster image is the fallback for low-power devices and `prefers-reduced-motion`.

## Conventions

### Naming
- Components and their files: `PascalCase` (`HeroSection.tsx`, `HeroSection.module.css`)
- Hooks: `useCamelCase` in `src/lib/`
- Assets: `kebab-case`, with a version suffix when iterating (`hero-can-v3.glb`)
- CSS tokens: `--color-*`, `--space-*`, `--font-*`, `--ease-*`

### Code style
- Guard clauses and early returns. No deep nesting.
- Small components, one section per folder.
- Clean up every GSAP animation with `useGSAP` scope or `gsap.context().revert()`.
- No magic numbers in animations. Name them (`HERO_ROTATE_DEG`).

### Formatting
- ESLint (typescript-eslint, react-hooks) + Prettier (single quotes, no semicolons, trailing commas, 100 print width)

### Git
- Trunk-based on `main`, short feature branches if needed
- Conventional Commits (`feat:`, `fix:`, `chore:`, `asset:` for asset drops, `docs:`)

## What you must do

- Read `docs/BACKLOG.md` and the latest `docs/CHANGELOG.md` entry at the start of every session.
- At the end of every session: update `docs/CHANGELOG.md`, tick items in `docs/BACKLOG.md`, and log new decisions in `docs/DECISIONS.md`.
- Log every generation prompt that produced a kept asset in `design/prompts.md`, with tool, model or style and settings.
- Log pipeline learnings (what worked, what failed, time and cost) in `docs/PIPELINE_NOTES.md`. This is the real deliverable of the project.
- Optimize every 3D or video asset before it goes into `public/`. Record before and after sizes.
- Verify visual changes in the browser (Claude in Chrome screenshots) before calling them done.
- Respect `prefers-reduced-motion`.
- Propose options with a recommendation when art direction is ambiguous. Don't guess silently.

## What you must never do

- Never put raw, unoptimized assets in `public/`. Target under 2 MB per `.glb` and under 3 MB per video loop.
- Never drive per-frame animation through `useState` or `setState`.
- Never create multiple WebGL canvases.
- Never leave ScrollTriggers or Lenis instances without cleanup.
- Never overwrite or delete a generated asset without asking. They cost credits. Version them instead.
- Never hardcode API keys or tokens in code or docs.
- Never add a UI framework (Tailwind, MUI, etc.) or a new animation library without logging an ADR first.
- Never drift from the cel-shaded art direction (no PBR realism, no soft gradients as the main look) without a decision.

## Documentation

| File | Content |
|------|---------|
| `docs/PROJECT_BRIEF.md` | Vision, goals, constraints, art direction |
| `docs/ARCHITECTURE.md` | Stack detail, structure, render and scroll flow |
| `docs/CONVENTIONS.md` | Full code rules with examples |
| `docs/ASSET_PIPELINE.md` | Step-by-step asset workflow (generate → optimize → ship) |
| `docs/PIPELINE_NOTES.md` | Experiment log: what worked, what didn't |
| `docs/DECISIONS.md` | ADR log |
| `docs/BACKLOG.md` | Todo, by priority |
| `docs/GLOSSARY.md` | Stylization and 3D terms used in this project |
| `docs/CHANGELOG.md` | Session history |
