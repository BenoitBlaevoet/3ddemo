import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { COLORWAYS } from '../../lib/colorways'
import { ScrollTrigger, useGSAP } from '../../lib/gsap'
import { playImpact } from '../../lib/impact'
import { SECTION } from '../../lib/store'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useSectionProgress } from '../../lib/useSectionProgress'
import styles from './Colorways.module.css'

const AUTO_CYCLE_MS = 2600

type Props = {
  active: number
  onPick: (index: number) => void
}

export function Colorways({ active, onPick }: Props) {
  const root = useRef<HTMLElement>(null)
  const inView = useRef(false)
  const activeRef = useRef(active)
  const reduced = useReducedMotion()
  const [autoCycle, setAutoCycle] = useState(!reduced)
  useSectionProgress(root, SECTION.colors)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          inView.current = self.isActive
        },
      })
    },
    { scope: root },
  )

  const pick = useCallback(
    (index: number) => {
      if (index === activeRef.current) return
      playImpact(() => onPick(index), reduced)
    },
    [onPick, reduced],
  )

  useEffect(() => {
    if (!autoCycle || reduced) return
    const id = window.setInterval(() => {
      if (!inView.current) return
      pick((activeRef.current + 1) % COLORWAYS.length)
    }, AUTO_CYCLE_MS)
    return () => window.clearInterval(id)
  }, [autoCycle, reduced, pick])

  const current = COLORWAYS[active]

  return (
    <section id="colors" ref={root} className={styles.section} aria-labelledby="colors-title">
      <div className={styles.underlay} aria-hidden="true">
        <p key={current.id} className={styles.bigName}>
          {current.name}
        </p>
      </div>
      <div className={styles.sticky}>
        <div className={styles.panel}>
          <p className={styles.kicker}>{COLORWAYS.length} colorways · one bottle</p>
          <h2 id="colors-title" className={styles.title}>
            Pick your
            <br />
            splash.
          </h2>

          <ul className={styles.list}>
            {COLORWAYS.map((colorway, i) => (
              <li key={colorway.id}>
                <button
                  type="button"
                  className={styles.option}
                  aria-pressed={i === active}
                  onClick={() => {
                    setAutoCycle(false)
                    pick(i)
                  }}
                >
                  <span
                    className={styles.swatch}
                    style={
                      {
                        '--swatch-a': colorway.body,
                        '--swatch-b': colorway.accent,
                      } as CSSProperties
                    }
                  />
                  <span className={styles.name}>{colorway.name}</span>
                  <span className={styles.jp}>{colorway.jp}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.footer}>
            <span className={styles.counter}>
              {String(active + 1).padStart(2, '0')} / {String(COLORWAYS.length).padStart(2, '0')}
            </span>
            {!reduced && (
              <button
                type="button"
                className={styles.auto}
                onClick={() => setAutoCycle((on) => !on)}
              >
                {autoCycle ? '❚❚ Pause shuffle' : '▶ Shuffle'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
