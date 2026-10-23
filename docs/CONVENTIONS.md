# Stylized Lab: Conventions

## Naming

### Files & folders
- React components: `PascalCase.tsx` with matching `PascalCase.module.css`
- Section folders: `src/sections/Hero/HeroSection.tsx`
- Hooks and utils: `camelCase.ts` (`useScrollProgress.ts`)
- Shaders: `camelCase.ts` exporting GLSL strings or material factories
- Assets: `kebab-case` + version suffix (`hero-can-v2.glb`, `hero-turn-v1.webm`, `frames/hero-turn/0001.webp`)

### Variables & functions
- `camelCase` for variables and functions
- `SCREAMING_SNAKE_CASE` for animation and tuning constants (`HERO_ENTRY_DURATION`)
- Booleans prefixed `is` / `has` / `should`

### CSS
- Tokens in `src/styles/tokens.css`: `--color-ink`, `--color-paper`, `--color-primary`, `--color-accent`, `--space-1..8`, `--font-display`, `--font-body`, `--ease-snap`
- CSS Modules for components. Class names in `camelCase`.

## Code style

- Guard clauses and early returns. Avoid `else` after `return`.
- One component per file. Keep sections under ~150 lines and extract pieces.
- GSAP: always scope animations with `useGSAP(() => {...}, { scope: ref })` so they revert automatically.
- R3F: animate in `useFrame` with refs. Use `damp`/`lerp` from `three/src/math/MathUtils` or `maath` for smoothing.
- Load models with `useGLTF` + `useGLTF.preload`. Wrap in `<Suspense>` with a poster fallback.
- Respect reduced motion: check `useReducedMotion()` before creating scroll-driven timelines.

### Do ✅

```tsx
function HeroModel() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/hero-can-v1.glb')

  useFrame((_, delta) => {
    if (!ref.current) return
    const target = sceneStore.heroRotation
    ref.current.rotation.y = damp(ref.current.rotation.y, target, 6, delta)
  })

  return <primitive ref={ref} object={scene} />
}
```

### Don't ❌

```tsx
function HeroModel() {
  const [rot, setRot] = useState(0) // re-renders every frame
  useEffect(() => {
    window.addEventListener('scroll', () => setRot(window.scrollY / 500)) // no cleanup, bypasses Lenis
  }, [])
  // ...
}
```

## Formatting

- Linter: ESLint with `typescript-eslint` + `eslint-plugin-react-hooks`
- Formatter: Prettier: single quotes, no semicolons, trailing commas, 100 print width
- Run `npm run lint` before committing

## Git

### Branches
Trunk-based on `main`. Use short-lived branches (`feat/hero-scene`) for bigger experiments.

### Commit messages
Conventional Commits:
- `feat(hero): add toon material with 3-step ramp`
- `fix(scroll): sync lenis with gsap ticker`
- `asset(hero): add optimized hero-can-v2.glb (4.1MB → 820KB)`
- `docs: log ADR-004 fake-3d for showcase`
- `chore: bump three`

## Assets

- Raw files go in `assets-src/`, optimized files in `public/`. Nothing raw ships.
- Every kept asset has an entry in `design/prompts.md` (tool, prompt, seed or style ID, settings, date).
- Budgets: `.glb` under 2 MB, video loop under 3 MB, frame sequence under 4 MB total (WebP, ~1280px wide).
