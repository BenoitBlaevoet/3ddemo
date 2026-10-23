# Stylized Lab: Changelog

## 2026-10-23: Repo + GitHub Pages deploy

- Git repo on `main`, remote github.com/BenoitBlaevoet/3ddemo (public)
- `.github/workflows/deploy.yml`: lint, build, deploy `dist/` to Pages on every push to `main`
- Vite `base` is `/3ddemo/` for builds only. Live at https://benoitblaevoet.github.io/3ddemo/

## 2026-10-23: GULP concept page

- Picked GULP as the product (user call). Built the concept homepage with the full stack: Vite + React 18 + TS, R3F, GSAP ScrollTrigger, Lenis
- Procedural 3D bottle in a single fixed canvas: toon shading, custom ink outlines, a spring straw, an exploded view, toon droplets
- 5 colorways on the same geometry, swapped with an anime impact-frame blink (ADR-007). Outlines approach: ADR-008
- Sections: Hero, Flip (pinned, straw pop), Colorways, Specs (exploded), CTA, plus header and marquees
- Verified in Chrome on desktop and in 390 px iframes. `tsc`, ESLint and `vite build` are clean
- Next: commit, poster fallback, then Phase 2 image-to-3D comparison against this baseline

## 2026-10-23: Concept moodboards

- Krea MCP connected, but the free plan has only 2 credits, so generation was skipped (ADR-006)
- Generated 4 concept moodboards with Recraft V4.1: POPPO, BLIP, SNAPPY, GULP. Each has 3 heroes, 2 action panels and 1 pattern → `design/moodboard/{concept}/`
- Visual board with picks, palettes and notes: `design/moodboard/index.html`
- Logged all prompts in `design/prompts.md` and the Recraft and Krea findings in `docs/PIPELINE_NOTES.md`
- Next: choose the product concept, then build a Recraft custom style from the picks

## 2026-10-23: Project initialization

- Created the project documentation kit
- Files: `CLAUDE.md`, `docs/PROJECT_BRIEF.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `ASSET_PIPELINE.md`, `PIPELINE_NOTES.md`, `DECISIONS.md`, `BACKLOG.md`, `GLOSSARY.md`, `CHANGELOG.md`
- Set up `design/` folder with `prompts.md`
- Initial decisions logged: ADR-001 to ADR-005 (code-first motion, stack, cel-shaded direction, plain CSS, single canvas)
- Next: Phase 0, choosing the fictional product and building the Krea moodboard

---

_Format: each entry starts with the date, then a short title and a list of changes. Update at the end of every session._
