import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

const LENIS_LERP = 0.1
const LAG_SMOOTHING_THRESHOLD_MS = 500
const LAG_SMOOTHING_ADJUSTED_MS = 33

// Lenis feeds ScrollTrigger; GSAP's ticker drives Lenis so both share one clock.
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({ lerp: LENIS_LERP, anchors: true })
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(LAG_SMOOTHING_THRESHOLD_MS, LAG_SMOOTHING_ADJUSTED_MS)
      lenis.destroy()
    }
  }, [enabled])
}
