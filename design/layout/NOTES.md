# GULP homepage: section plan

Scroll stage = sum of section progress (0 → 4). Bottle poses live in `src/scene/poses.ts`.

| # | Section | Height | Bottle | DOM motion |
|---|---|---|---|---|
| 0 | Hero | 100vh | Drops in with a bounce and a landing splash, idle sway, pointer tilt. Right side, lower half on phones | Letters slam in, slogan pops, tap = splash |
| 1 | Flip | 300vh, sticky | Centre. Tips its top to camera, straw pops (spring), tilts to sip, spins to show the loop | 3 manga panels (deck on phones), POP! starburst |
| 2 | Colorways | 200vh, sticky | Left, front-facing. Recolors through an impact flash | Picker, hollow name slams in, auto shuffle every 2.6 s while in view |
| 3 | Specs | 250vh, sticky | Right. Explodes (lid, straw, loop, band) then reassembles | Part list + stat tiles stagger in |
| 4 | CTA | 100vh | Centre-right, full turn | "Sip happens." poster type, focus lines, buy button |

Reduced motion: no intro drop, idle sway, shuffle, impact flashes, marquee or focus-line flicker. Scroll-linked poses stay, since they are user-driven.
