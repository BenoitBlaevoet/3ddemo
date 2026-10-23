import { useRef } from 'react'
import { Button } from '../../components/Button'
import { SpeedLines } from '../../components/SpeedLines'
import { gsap, useGSAP } from '../../lib/gsap'
import { SECTION } from '../../lib/store'
import { useSectionProgress } from '../../lib/useSectionProgress'
import styles from './Cta.module.css'

const PRICE = '$29'

export function Cta() {
  const root = useRef<HTMLElement>(null)
  useSectionProgress(root, SECTION.cta)

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'top top', scrub: 0.4 },
        })
        .from('[data-word]', {
          yPercent: 60,
          scale: 1.4,
          autoAlpha: 0,
          stagger: 0.15,
          ease: 'back.out(2)',
        })
        .from('[data-actions]', { y: 40, autoAlpha: 0 }, '<0.2')
    },
    { scope: root },
  )

  return (
    <section id="buy" ref={root} className={styles.section} aria-labelledby="buy-title">
      <SpeedLines className={styles.lines} count={96} inner={30} />
      <h2 id="buy-title" className={styles.big}>
        <span data-word>Sip</span>
        <span data-word>happens.</span>
      </h2>
      <div className={styles.actions} data-actions>
        <Button href="#colors">Get your GULP · {PRICE}</Button>
        <p className={styles.note}>Free shipping on your first splash.</p>
      </div>
      <footer className={styles.footer}>
        Stylized Lab · concept page · GULP is a fictional product
      </footer>
    </section>
  )
}
