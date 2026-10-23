import { useMemo } from 'react'
import styles from './SpeedLines.module.css'

const FRAME_SETS = 3
const OUTER_RADIUS = 160
const INNER_JITTER = 26
const MIN_WEDGE_DEG = 0.35
const WEDGE_RANGE_DEG = 1.5

type Props = {
  count?: number
  inner?: number
  className?: string
}

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildLines(count: number, inner: number, seed: number): string {
  const random = seeded(seed * 9973 + 17)
  const toRad = Math.PI / 180
  const segments: string[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + random() * 0.05
    const start = inner + random() * INNER_JITTER
    const half = ((MIN_WEDGE_DEG + random() * WEDGE_RANGE_DEG) * toRad) / 2
    const tip = [Math.cos(angle) * start, Math.sin(angle) * start]
    const left = [Math.cos(angle - half) * OUTER_RADIUS, Math.sin(angle - half) * OUTER_RADIUS]
    const right = [Math.cos(angle + half) * OUTER_RADIUS, Math.sin(angle + half) * OUTER_RADIUS]
    segments.push(
      `M${tip.map((n) => n.toFixed(2))}L${left.map((n) => n.toFixed(2))}L${right.map((n) => n.toFixed(2))}Z`,
    )
  }
  return segments.join('')
}

// Manga focus lines. Three random sets swap every few frames for the classic jitter.
export function SpeedLines({ count = 80, inner = 36, className }: Props) {
  const sets = useMemo(
    () => Array.from({ length: FRAME_SETS }, (_, i) => buildLines(count, inner, i + 1)),
    [count, inner],
  )

  return (
    <svg
      className={[styles.lines, className].filter(Boolean).join(' ')}
      viewBox="-100 -100 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {sets.map((d, i) => (
        <path key={i} d={d} className={styles.set} />
      ))}
    </svg>
  )
}
