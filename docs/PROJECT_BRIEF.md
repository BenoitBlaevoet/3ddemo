# Stylized Lab: Project Brief

## Vision

Stylized Lab is a test bench. It answers one question: **what is the best workflow today for building highly stylized web pages that use 3D and motion, with AI tools doing most of the asset work?**

The vehicle is a single homepage for a **fictional product**, rendered in an **anime cel-shaded** style: toon-shaded hero object, ink outlines, bold flat palette, speed lines, manga-panel layout, and dramatic scroll-driven camera moves. The page should feel like an anime opening sequence you scroll through.

Static design tools (Claude Design, Figma) can't express motion or real-time 3D. So design is split: visuals and layout are explored in AI tools, and motion and 3D are authored directly in code.

## Goals

1. Ship one polished, performant homepage (4–5 sections) in the cel-shaded style.
2. Compare **real-time 3D** (image-to-3D `.glb` + toon shaders) with **fake 3D** (AI video loops, scroll-scrubbed frame sequences) on visual quality, effort, file size and performance.
3. Produce a reusable, documented pipeline (`docs/ASSET_PIPELINE.md` + `docs/PIPELINE_NOTES.md`) for future projects.
4. Keep asset style consistent across tools, using a locked Recraft custom style.

## Art direction

- **Look**: anime cel-shading. 2–3 tone hard shadows, black or colored ink outlines, rim highlights.
- **Palette**: limited, bold, flat. 1 dominant, 1 accent, black and off-white. Exact tokens to be decided (see backlog).
- **Graphic language**: speed lines, halftone dots, manga panel frames, impact text (big kinetic type), screentone textures.
- **Motion**: snappy anime timing (holds and smears, not floaty easing), camera whip-pans, impact frames on section changes.

## Product

Fictional product, still to be decided. It must have a strong silhouette that works as a single hero object (energy drink can, sneaker, headphones, gadget, mecha figure). See `BACKLOG.md`.

## Constraints

- Solo project with AI assistance, no deadline. Learning comes before speed.
- Performance budget: LCP under 2.5 s on desktop, 60 fps on a mid-range laptop, total initial payload under 6 MB.
- Must degrade gracefully: static poster fallback for mobile, low-power devices and `prefers-reduced-motion`.
- AI generation costs credits. Every kept asset and its prompt is logged so it can be reproduced.

## Integrations

- **Recraft**: MCP connected in Claude Code (generate, vectorize, remove background, upscale, image-to-video, custom styles)
- **Krea**: manual web UI (image gen, realtime, video, enhance)
- **Image-to-3D**: Meshy / Tripo / Rodin, manual, to be compared
- **Claude Design**: optional static layout reference
- **Claude in Chrome**: visual QA through screenshots

## Team

Solo developer (senior, web background) + Claude Code as pair programmer and creative technologist.
