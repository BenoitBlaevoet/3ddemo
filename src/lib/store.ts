// Mutable, non-React state shared between DOM sections and the WebGL scene.
// Written by ScrollTrigger / GSAP / pointer events, read every frame in useFrame.

export const SECTION = {
  hero: 0,
  flip: 1,
  colors: 2,
  specs: 3,
  cta: 4,
} as const

const SECTION_COUNT = Object.keys(SECTION).length

export const scroll = {
  progress: new Array<number>(SECTION_COUNT).fill(0),
}

// Sections tile the page, so summing their progress gives one continuous
// "stage" value: 0 = top of hero, 1 = top of flip, 2 = top of colors...
export function getStage(): number {
  return scroll.progress.reduce((sum, value) => sum + value, 0)
}

export const pointer = { x: 0, y: 0 }

export type ImpactMode = 0 | 1 | 2

export const fx = {
  intro: 0,
  impact: 0 as ImpactMode,
  squashAt: -10,
  pendingBurst: 0,
  burstPower: 1,
  emitter: { x: 0, y: 0, z: 0 },
}

export function now(): number {
  return performance.now() / 1000
}

export function splash(count: number, power = 1) {
  fx.pendingBurst += count
  fx.burstPower = power
  fx.squashAt = now()
}

if (import.meta.env.DEV) {
  Object.assign(window, { __gulp: { scroll, fx, getStage } })
}
