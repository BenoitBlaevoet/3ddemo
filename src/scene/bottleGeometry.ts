import { LatheGeometry, Vector2 } from 'three'

// Model units. The whole bottle (body + lid) is about 2.45 tall, centred near y = 0.
export const BODY = { radius: 0.65, bottomY: -1.3, corner: 0.28, shoulderY: 0.58, shoulder: 0.2 }
export const LID = { radius: 0.59, baseY: 0.76, topY: 1.14, corner: 0.12 }
export const BAND = { radius: 0.668, height: 0.4, y: -0.72 }
export const LOGO = { radius: 0.661, height: 0.62, y: 0.08 }
export const STRAW = { x: 0.28, pivotY: 1.22, length: 0.62, radius: 0.075, tip: 0.09 }
export const SPOUT = { radius: 0.13, height: 0.1 }
export const LOOP = { y: 0.97, hingeX: -0.6, ringX: -0.86, radius: 0.22, tube: 0.065 }
export const SHINE = {
  radius: 0.675,
  lidRadius: 0.596,
  phi: -0.98,
  width: 0.1,
  thinPhi: -0.78,
  thinWidth: 0.03,
}
export const MODEL_HEIGHT = 2.45

const LATHE_SEGMENTS = 64
const ARC_STEPS = 10
const SHINE_SEGMENTS = 4

function arc(cx: number, cy: number, r: number, from: number, to: number): Vector2[] {
  return Array.from({ length: ARC_STEPS + 1 }, (_, i) => {
    const angle = from + ((to - from) * i) / ARC_STEPS
    return new Vector2(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
  })
}

export function createBodyGeometry(): LatheGeometry {
  const { radius, bottomY, corner, shoulderY, shoulder } = BODY
  const points = [
    new Vector2(0, bottomY),
    ...arc(radius - corner, bottomY + corner, corner, -Math.PI / 2, 0),
    ...arc(radius - shoulder, shoulderY, shoulder, 0, Math.PI / 2),
  ]
  return new LatheGeometry(points, LATHE_SEGMENTS)
}

export function createLidGeometry(): LatheGeometry {
  const { radius, baseY, topY, corner } = LID
  const points = [
    new Vector2(radius - 0.12, baseY),
    new Vector2(radius, baseY + 0.02),
    ...arc(radius - corner, topY - corner, corner, 0, Math.PI / 2),
    new Vector2(0, topY),
  ]
  return new LatheGeometry(points, LATHE_SEGMENTS)
}

// A vertical strip glued to the surface: the hard white anime specular highlight.
export function createShineGeometry(
  radius: number,
  phi: number,
  width: number,
  fromY: number,
  toY: number,
): LatheGeometry {
  const points = [new Vector2(radius, fromY), new Vector2(radius, toY)]
  return new LatheGeometry(points, SHINE_SEGMENTS, phi - width / 2, width)
}
