# Stylized Lab: Asset Pipeline

The working procedure for producing visuals. Update it whenever a step proves better or worse. Raw observations go in `PIPELINE_NOTES.md`.

## 0. Art direction lock

1. Explore in **Krea**: 10–30 images exploring the cel-shaded product look. Save picks to `design/moodboard/`.
2. Pick 3–5 references and create a **Recraft custom style** from them. Record the style ID in `DECISIONS.md`.
3. Define palette tokens from the picks and write them to `src/styles/tokens.css`.

## 1. 2D assets (Recraft)

| Need | Recraft tool | Output |
|---|---|---|
| Illustrations, backgrounds | `generate_image` with custom style | PNG/WebP |
| Icons, speed lines, panel frames, halftone | `generate_image` (vector) or `vectorize_image` | SVG (animatable in code) |
| Isolated product shots | `remove_background` | Transparent PNG |
| Final resolution | `crisp_upscale` / `creative_upscale` | Hi-res |

Log every kept generation in `design/prompts.md`.

## 2. 3D: real-time path

1. Generate a clean **orthographic-ish product image** (front or 3/4 view, plain background, no heavy shading) in Recraft or Krea.
2. Run image-to-3D (**Meshy / Tripo / Rodin**). Compare outputs and save the raw `.glb` to `assets-src/models/`.
3. Clean up if needed (Blender: decimate, fix normals, separate materials for toon zones).
4. Optimize:
   ```sh
   npx @gltf-transform/cli optimize assets-src/models/hero-v1.glb public/models/hero-v1.glb \
     --compress draco --texture-compress webp --texture-size 1024
   ```
5. In code, replace materials with the toon material + outlines. Generated textures are often too realistic, so flat colors per material zone usually look better.

## 3. 3D: fake path

### Video loop
1. Hero still → **Recraft `image_to_video`** or **Krea video** (turntable, idle motion, impact pose).
2. Encode:
   ```sh
   ffmpeg -i raw.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -an public/video/hero-loop-v1.webm
   ffmpeg -i raw.mp4 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart public/video/hero-loop-v1.mp4
   ```

### Scroll-scrubbed frame sequence
1. Generate the turnaround or move as video.
2. Extract frames:
   ```sh
   ffmpeg -i raw.mp4 -vf "fps=24,scale=1280:-1" -c:v libwebp -quality 75 public/frames/hero-turn/%04d.webp
   ```
3. Draw to a `<canvas>` indexed by ScrollTrigger progress.

## 4. Layout reference (optional)

- Mock section layouts in **Claude Design** and export screenshots to `design/layout/`.
- Annotate motion intent next to each layout (`design/layout/NOTES.md`). Static mockups can't show it.

## 5. QA

- Check in the browser with Claude in Chrome screenshots at 1440px and 390px.
- Check the Performance panel: 60 fps target, no long tasks during scroll.
- Record payload sizes in `PIPELINE_NOTES.md`.
