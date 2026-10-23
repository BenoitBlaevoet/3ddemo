import { useEffect, useLayoutEffect, useState } from 'react'
import { Header } from './components/Header'
import { ImpactFlash } from './components/ImpactFlash'
import { Marquee } from './components/Marquee'
import { COLORWAYS, applyColorwayVars } from './lib/colorways'
import { ScrollTrigger } from './lib/gsap'
import { pointer } from './lib/store'
import { useLenis } from './lib/useLenis'
import { useReducedMotion } from './lib/useReducedMotion'
import { Stage } from './scene/Stage'
import { Colorways } from './sections/Colorways/Colorways'
import { Cta } from './sections/Cta/Cta'
import { Flip } from './sections/Flip/Flip'
import { Hero } from './sections/Hero/Hero'
import { Specs } from './sections/Specs/Specs'

const MARQUEE_TOP = ['Sip happens', 'ガルプ', 'Flip', 'Sip', 'Go', '750 ml']
const MARQUEE_BOTTOM = ['5 colorways', 'one bottle', '24 h cold', 'zero spills', 'ガルプ']

export default function App() {
  const reduced = useReducedMotion()
  const [colorway, setColorway] = useState(0)
  useLenis(!reduced)

  useLayoutEffect(() => {
    applyColorwayVars(COLORWAYS[colorway])
  }, [colorway])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <ImpactFlash />
      <Stage colorway={COLORWAYS[colorway]} reducedMotion={reduced} />
      <Header />
      <main>
        <Hero />
        <Marquee items={MARQUEE_TOP} />
        <Flip />
        <Colorways active={colorway} onPick={setColorway} />
        <Marquee items={MARQUEE_BOTTOM} reverse />
        <Specs />
        <Cta />
      </main>
    </>
  )
}
