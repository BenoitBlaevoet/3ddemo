// Bottle choreography keyed on the scroll "stage" (see lib/store getStage).
// x / y are fractions of the half viewport, h is bottle height as a fraction of viewport height.
// py replaces y on portrait screens, where text and bottle stack instead of sitting side by side.

export type Pose = {
  x: number
  y: number
  py: number
  h: number
  rotY: number
  tiltX: number
  tiltZ: number
  straw: number
  explode: number
}

export const POSE_KEYS = [
  'x',
  'y',
  'py',
  'h',
  'rotY',
  'tiltX',
  'tiltZ',
  'straw',
  'explode',
] as const

const TAU = Math.PI * 2

const HERO: Pose = {
  x: 0.38,
  y: -0.06,
  py: -0.42,
  h: 0.64,
  rotY: -0.35,
  tiltX: 0.12,
  tiltZ: -0.16,
  straw: 0,
  explode: 0,
}
const FLIP_IN: Pose = {
  x: 0,
  y: -0.08,
  py: -0.04,
  h: 0.64,
  rotY: 0,
  tiltX: 0.1,
  tiltZ: 0,
  straw: 0,
  explode: 0,
}
const FLIP_TOP: Pose = {
  x: 0,
  y: -0.2,
  py: -0.1,
  h: 0.68,
  rotY: -0.5,
  tiltX: 0.48,
  tiltZ: 0,
  straw: 0,
  explode: 0,
}
const SIP: Pose = {
  x: 0,
  y: -0.16,
  py: -0.1,
  h: 0.64,
  rotY: -1.2,
  tiltX: 0.2,
  tiltZ: 0.34,
  straw: 1,
  explode: 0,
}
const GO: Pose = {
  x: 0,
  y: -0.06,
  py: -0.04,
  h: 0.64,
  rotY: -3.78,
  tiltX: 0.1,
  tiltZ: -0.06,
  straw: 1,
  explode: 0,
}
const COLORS: Pose = {
  x: -0.4,
  y: -0.12,
  py: 0.42,
  h: 0.6,
  rotY: -TAU + 0.25,
  tiltX: 0.1,
  tiltZ: -0.1,
  straw: 1,
  explode: 0,
}
const SPECS: Pose = {
  x: 0.4,
  y: -0.06,
  py: 0.48,
  h: 0.6,
  rotY: -TAU - 0.5,
  tiltX: 0.12,
  tiltZ: 0,
  straw: 1,
  explode: 0,
}
const SPECS_OPEN: Pose = { ...SPECS, y: -0.24, py: 0.36, h: 0.42, rotY: -TAU - 1.1, explode: 1 }
const SPECS_OUT: Pose = { ...SPECS_OPEN, x: 0.2, explode: 0 }
const CTA: Pose = {
  x: 0.3,
  y: -0.04,
  py: 0.1,
  h: 0.6,
  rotY: -2 * TAU + 0.3,
  tiltX: 0.12,
  tiltZ: -0.12,
  straw: 1,
  explode: 0,
}

const ANCHORS: Array<[number, Pose]> = [
  [0, HERO],
  [1, FLIP_IN],
  [1.12, FLIP_TOP],
  [1.19, FLIP_TOP],
  [1.23, { ...FLIP_TOP, straw: 1 }],
  [1.34, SIP],
  [1.5, GO],
  [1.67, GO],
  [2, COLORS],
  [2.5, COLORS],
  [3, SPECS],
  [3.08, SPECS],
  [3.35, SPECS_OPEN],
  [3.6, SPECS_OPEN],
  [3.82, SPECS_OUT],
  [4, CTA],
]

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

export function createPose(): Pose {
  return { ...HERO }
}

export function samplePose(stage: number, out: Pose): Pose {
  const first = ANCHORS[0]
  const last = ANCHORS[ANCHORS.length - 1]
  if (stage <= first[0]) return Object.assign(out, first[1])
  if (stage >= last[0]) return Object.assign(out, last[1])

  const next = ANCHORS.findIndex(([s]) => s > stage)
  const [fromStage, from] = ANCHORS[next - 1]
  const [toStage, to] = ANCHORS[next]
  const t = smoothstep((stage - fromStage) / (toStage - fromStage))

  for (const key of POSE_KEYS) {
    out[key] = from[key] + (to[key] - from[key]) * t
  }
  return out
}
