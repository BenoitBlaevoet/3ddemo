import { useRef } from 'react'
import { Button } from '../../components/Button'
import { SpeedLines } from '../../components/SpeedLines'
import { gsap, useGSAP } from '../../lib/gsap'
import { SECTION, fx, splash } from '../../lib/store'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useSectionProgress } from '../../lib/useSectionProgress'
import styles from './Hero.module.css'

const TITLE = 'GULP'
const INTRO_DELAY_S = 0.25
const INTRO_DROP_S = 1.1
// bounce.out first touches the ground at 1 / 2.75 of its duration.
const FIRST_LANDING_S = INTRO_DELAY_S + INTRO_DROP_S / 2.75
const LANDING_SPLASH = { count: 34, power: 1.3 }
const CLICK_SPLASH = { count: 26, power: 1.15 }
const LETTER_TILT_DEG = [-14, 9, -7, 12]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  useSectionProgress(root, SECTION.hero)

  useGSAP(
    () => {
      if (reduced) {
        fx.intro = 1
        return
      }

      gsap
        .timeline({ delay: INTRO_DELAY_S })
        .fromTo(fx, { intro: 0 }, { intro: 1, duration: INTRO_DROP_S, ease: 'bounce.out' }, 0)
        .call(
          () => splash(LANDING_SPLASH.count, LANDING_SPLASH.power),
          [],
          FIRST_LANDING_S - INTRO_DELAY_S,
        )
        .from(
          '[data-letter]',
          {
            yPercent: -140,
            rotate: (i: number) => LETTER_TILT_DEG[i % LETTER_TILT_DEG.length],
            duration: 0.55,
            stagger: 0.07,
            ease: 'back.out(2.4)',
          },
          0.35,
        )
        .from(
          '[data-slogan]',
          { scale: 0, rotate: -30, duration: 0.5, ease: 'back.out(2.2)' },
          0.75,
        )
        .from(
          '[data-reveal]',
          { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          0.9,
        )
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section
      id="top"
      ref={root}
      className={styles.hero}
      onClick={() => splash(CLICK_SPLASH.count, CLICK_SPLASH.power)}
    >
      <SpeedLines className={styles.lines} />

      <h1 className={styles.title} aria-label={`${TITLE}, the flip-straw bottle`}>
        {TITLE.split('').map((letter, i) => (
          <span key={i} data-letter className={styles.letter}>
            {letter}
          </span>
        ))}
      </h1>

      <div className={styles.copy}>
        <p className={styles.kicker} data-reveal>
          New · flip-straw bottle · 750 ml
        </p>
        <p className={styles.slogan} data-slogan>
          Sip
          <br />
          happens.
        </p>
        <p className={styles.lede} data-reveal>
          The chunky bottle that flips, sips and goes wherever you go. Zero spills. Zero boring.
        </p>
        <div className={styles.ctas} data-reveal>
          <Button href="#colors">Pick your color</Button>
          <Button href="#flip" variant="ghost">
            See the flip ↓
          </Button>
        </div>
      </div>

      <p className={styles.kana} aria-hidden="true">
        ガルプ・水筒
      </p>
      <p className={styles.hint} data-reveal>
        Tap anywhere to splash
      </p>
    </section>
  )
}
