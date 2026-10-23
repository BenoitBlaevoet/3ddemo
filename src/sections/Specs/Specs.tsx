import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { SECTION } from '../../lib/store'
import { useSectionProgress } from '../../lib/useSectionProgress'
import styles from './Specs.module.css'

const PARTS = [
  { name: 'Flip lid', text: 'One-thumb latch that clicks shut and stays shut.' },
  { name: 'Pop straw', text: 'Soft silicone tip on a spring hinge.' },
  { name: 'Carry loop', text: 'Fits a finger, a strap or a handlebar.' },
  { name: 'Grip band', text: 'Grippy silicone, swappable in any colorway.' },
  { name: 'Body', text: 'Double-wall steel. Cold all day, never sweaty.' },
]

const STATS = [
  { value: '750', unit: 'ml', label: 'Big gulps' },
  { value: '24', unit: 'h', label: 'Ice cold' },
  { value: '0', unit: '', label: 'Spills, ever' },
  { value: '290', unit: 'g', label: 'Featherweight' },
]

// Fractions of the section scroll range, matching the explode anchors in scene/poses.ts (stage 3 → 4).
const AT = { parts: 0.06, stats: 0.3, out: 0.62 }

export function Specs() {
  const root = useRef<HTMLElement>(null)
  useSectionProgress(root, SECTION.specs)

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
        .from('[data-heading]', { autoAlpha: 0, x: -60, duration: 0.05 }, 0)
        .from(
          '[data-part]',
          { autoAlpha: 0, x: -50, duration: 0.05, stagger: 0.035, ease: 'back.out(2)' },
          AT.parts,
        )
        .from(
          '[data-stat]',
          { autoAlpha: 0, y: 50, rotate: -6, duration: 0.05, stagger: 0.03, ease: 'back.out(2)' },
          AT.stats,
        )
        .to('[data-content]', { autoAlpha: 0, y: -60, duration: 0.08 }, AT.out)
        .set({}, {}, 1)
    },
    { scope: root },
  )

  return (
    <section id="specs" ref={root} className={styles.section} aria-labelledby="specs-title">
      <div className={styles.sticky}>
        <div className={styles.content} data-content>
          <h2 id="specs-title" className={styles.title} data-heading>
            Every part,
            <br />
            on purpose.
          </h2>
          <ol className={styles.parts}>
            {PARTS.map((part, i) => (
              <li key={part.name} className={styles.part} data-part>
                <span className={styles.index}>{i + 1}</span>
                <span>
                  <strong className={styles.partName}>{part.name}</strong>
                  <span className={styles.partText}>{part.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat} data-stat>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  {stat.value}
                  <small>{stat.unit}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
