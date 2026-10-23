# Stylized Lab: Generation Prompts

Log every generation that produced a **kept** asset so it can be reproduced or varied.

## Template

```
### {asset-file-name}
- Date:
- Tool / model: (Recraft vX / Krea model / Meshy...)
- Style ID / seed:
- Prompt:
- Negative / settings:
- Source image (if img2img / image-to-3D / video):
- Output path: assets-src/... → public/...
- Notes:
```

## Prompts

### Concept moodboards (Phase 0), batch 2026-10-23
- Tool / model: Recraft `recraftv4_1_raster`, no style ID (default), 1:1, 2 credits per image
- Output path: `design/moodboard/{concept}/{concept}-{hero|action|pattern}-{n}.webp` (1024px WebP, ~80–310 KB)
- Board: `design/moodboard/index.html`
- Shared hero suffix: `thick black ink outlines, two-tone hard cel shadows, sharp white specular highlight, flat bold colors, 3/4 view, centered, plain {bg} background, playful youthful energy, 90s anime commercial style, clean, no text, no logo`

#### poppo-hero-v0 (rejected, kept for reference)
- Prompt: original POPPO prompt from `design/concepts.md`
- Notes: the red/yellow halves plus a black shadow block read as a flag.

#### poppo-hero-1..3 (pick: hero-3)
- Prompt: `anime cel-shaded product illustration of a squat chubby mini soda can, short and wide with soft rounded shoulders, glossy cherry red body with a wavy lemon yellow band and white bubble dots, ...shared suffix... (bg: sky blue), small fizz bubbles`

#### poppo-action-1..2
- Prompt: `anime cel-shaded action scene, a squat chubby cherry red and lemon yellow soda can bursting open with an explosion of fizz, cherries and lemon slices flying, dramatic manga speed lines radiating, impact frame, thick black ink outlines, two-tone hard shadows, flat bold colors, sky blue and white background, 90s anime commercial style, dynamic low angle, no text`

#### poppo-pattern-1
- Prompt: `seamless flat anime pattern of bubbles, cherries, lemon slices and small starbursts, cherry red, lemon yellow, white and sky blue, thick black ink outlines, cel-shaded, manga halftone dots, 90s anime packaging graphic, no text`

#### blip-hero-1..3 (pick: hero-2)
- Prompt: `anime cel-shaded product illustration of a smooth round pebble-shaped wireless earbuds case, lid half open, two small bean-shaped earbuds floating out, mint green case with hot pink inner tray and buds, music notes and sparkles, ...shared suffix... (bg: lilac)`

#### blip-action-1..2
- Prompt: `anime cel-shaded action scene, a mint green and hot pink pebble earbuds case popping open, two earbuds flying out trailing music notes and sound wave rings, dramatic manga speed lines, impact frame, thick black ink outlines, two-tone hard shadows, flat bold colors, lilac and white background, 90s anime commercial style, dynamic angle, no text`

#### blip-pattern-1
- Prompt: `seamless flat anime pattern of music notes, sound waves, sparkles and small hearts, mint green, hot pink, white and lilac, thick black ink outlines, cel-shaded, manga halftone dots, 90s anime packaging graphic, no text`

#### snappy-hero-1..3 (pick: hero-2)
- Prompt: `anime cel-shaded product illustration of a chunky rounded instant camera with a big round lens, a photo print sliding out of the top, tangerine orange body, cream front panel, teal lens ring and shutter button, flash burst and sparkles, ...shared suffix... (bg: butter yellow)`

#### snappy-action-1..2
- Prompt: `anime cel-shaded action scene, a chunky tangerine orange and cream instant camera firing a giant flash burst, several photo prints spinning through the air, dramatic manga speed lines, impact frame, thick black ink outlines, two-tone hard shadows, flat bold colors, butter yellow and white background, 90s anime commercial style, dynamic angle, no text`

#### snappy-pattern-1
- Prompt: `seamless flat anime pattern of camera flash bursts, small blank photo frames, stars and sparkles, tangerine orange, cream, teal and butter yellow, thick black ink outlines, cel-shaded, manga halftone dots, 90s anime packaging graphic, no text`

#### gulp-hero-1..3 (pick: hero-2)
- Prompt: `anime cel-shaded product illustration of a chunky capsule-shaped water bottle with a flip-up straw lid and a carry loop, electric blue body with lime green lid and straw, water droplets splashing, ...shared suffix... (bg: coral pink)`

#### gulp-action-1..2
- Prompt: `anime cel-shaded action scene, a chunky electric blue and lime green capsule water bottle with flip straw flying through a huge splash of water, droplets and ice cubes everywhere, dramatic manga speed lines, impact frame, thick black ink outlines, two-tone hard shadows, flat bold colors, coral pink and white background, 90s anime commercial style, dynamic angle, no text`

#### gulp-pattern-1
- Prompt: `seamless flat anime pattern of water droplets, splashes, ice cubes and small starbursts, electric blue, lime green, white and coral pink, thick black ink outlines, cel-shaded, manga halftone dots, 90s anime packaging graphic, no text`

