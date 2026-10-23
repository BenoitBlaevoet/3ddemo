import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { SECTION } from '../../lib/store'
import { useSectionProgress } from '../../lib/useSectionProgress'
import styles from './Flip.module.css'

const STEPS = [
  {
    id: 'flip',
    title: 'Flip',
    text: 'One thumb and the straw springs up. No twisting, no fiddling, no lid in your teeth.',
  },
  {
    id: 'sip',
    title: 'Sip',
    text: 'A leak-proof valve. Tip it, toss it, throw it in your bag. Nothing gets out.',
  },
  {
    id: 'go',
    title: 'Go',
    text: 'The carry loop fits a finger, a bag strap or a bike bar. GULP goes where you go.',
  },
]

// Timeline positions are fractions of this section's scroll range. They match the
// bottle anchors in scene/poses.ts (stage 1.0 → 2.0).
const AT = {
  panelIn: [0.03, 0.27, 0.45],
  sfxIn: 0.19,
  sfxOut: 0.33,
  panelsOut: 0.6,
}
const BURST_POINTS = 14
const BURST_INNER = 0.68

function starburst(points: number, inner: number): string {
  const vertices = Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? 50 : 50 * inner
    const angle = (i / (points * 2)) * Math.PI * 2
    return `${(50 + Math.cos(angle) * radius).toFixed(1)}% ${(50 + Math.sin(angle) * radius).toFixed(1)}%`
  })
  return `polygon(${vertices.join(',')})`
}

const BURST_CLIP = starburst(BURST_POINTS, BURST_INNER)

export function Flip() {
  const root = useRef<HTMLElement>(null)
  useSectionProgress(root, SECTION.flip)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
      })

      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel, i) => {
        const fromLeft = i % 2 === 0
        tl.fromTo(
          panel,
          { autoAlpha: 0, x: fromLeft ? -80 : 80, rotate: fromLeft ? -8 : 8 },
          { autoAlpha: 1, x: 0, rotate: fromLeft ? -2 : 2, duration: 0.06, ease: 'back.out(2)' },
          AT.panelIn[i],
        )
      })

      tl.fromTo(
        '[data-sfx]',
        { autoAlpha: 0, scale: 0.2, rotate: -30 },
        { autoAlpha: 1, scale: 1, rotate: -10, duration: 0.04, ease: 'back.out(3)' },
        AT.sfxIn,
      )
        .to('[data-sfx]', { autoAlpha: 0, scale: 1.4, duration: 0.04 }, AT.sfxOut)
        .to('[data-panel]', { autoAlpha: 0, y: -40, duration: 0.06, stagger: 0.01 }, AT.panelsOut)
        .set({}, {}, 1)
    },
    { scope: root },
  )

  return (
    <section id="flip" ref={root} className={styles.section} aria-labelledby="flip-title">
      <div className={styles.sticky}>
        <h2 id="flip-title" className="visually-hidden">
          Flip, sip, go
        </h2>
        {STEPS.map((step, i) => (
          <article key={step.id} data-panel className={`${styles.panel} ${styles[step.id]}`}>
            <span className={styles.number}>0{i + 1}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
          </article>
        ))}
        <p data-sfx className={styles.sfx} aria-hidden="true">
          <span className={styles.burst} style={{ clipPath: BURST_CLIP }} />
          <span className={styles.sfxText}>POP!</span>
        </p>
      </div>
    </section>
  )
}
