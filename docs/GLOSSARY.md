# Stylized Lab: Glossary

| Term | Definition | Usage context |
|------|------------|---------------|
| Cel-shading / toon shading | Rendering with a few hard light bands instead of smooth gradients, mimicking hand-painted animation cels | `shaders/toonMaterial.ts`, `MeshToonMaterial` + gradient map |
| Gradient map / ramp | Small texture (e.g. 3×1 px) defining the light bands of a toon material | Controls how many shadow steps are visible |
| Inverted hull outline | Outline technique: duplicate mesh, scale along normals, render back faces in black | drei `<Outlines>` |
| Post-process outline | Edge detection on depth or normals in a screen-space pass | `scene/Effects.tsx` |
| Impact frame | Brief high-contrast, inverted or monochrome frame at a key moment (anime convention) | Section transitions |
| Speed lines | Radial or parallel streaks showing motion or focus | SVG components, background layers |
| Screentone / halftone | Dot-pattern shading from manga printing | CSS/SVG/shader texture overlay |
| Smear frame | Stretched, distorted frame suggesting fast motion | Hero rotation transitions |
| Real-time 3D | Geometry rendered live by WebGL each frame | `.glb` models in R3F |
| Fake 3D | Pre-rendered motion (video, image sequence) that looks 3D but isn't interactive geometry | Video loops, frame scrubbing |
| Frame scrub | Mapping scroll progress to a frame index of an image sequence drawn on canvas | Apple-style product turnarounds |
| Image-to-3D | AI generating a 3D mesh from one or more images | Meshy, Tripo, Rodin |
| Recraft custom style | Style trained from reference images to keep generations consistent | Asset generation |
| Scene store | Mutable shared object holding scroll-driven values read in `useFrame` | Bridge between sections and scene |
| Poster fallback | Static image shown before 3D loads or when motion is reduced | Progressive enhancement |
| Draco / Meshopt | Geometry compression formats for glTF | `gltf-transform optimize` |
