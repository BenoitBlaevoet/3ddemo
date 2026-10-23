import { gsap } from './gsap'
import { fx, splash } from './store'

// Anime "impact frame": two single-frame flashes (inverted, then white) hide the swap.
const IMPACT_FRAME_S = 0.075
const SWAP_SPLASH_COUNT = 28
const SWAP_SPLASH_POWER = 1.2

export function playImpact(swap: () => void, reducedMotion: boolean) {
  if (reducedMotion) {
    swap()
    return
  }

  const root = document.documentElement

  gsap
    .timeline()
    .call(() => {
      root.classList.add('is-impact', 'is-impact-dark')
      fx.impact = 1
    })
    .call(
      () => {
        root.classList.replace('is-impact-dark', 'is-impact-light')
        fx.impact = 2
        swap()
      },
      [],
      IMPACT_FRAME_S,
    )
    .call(
      () => {
        root.classList.remove('is-impact', 'is-impact-light')
        fx.impact = 0
        splash(SWAP_SPLASH_COUNT, SWAP_SPLASH_POWER)
      },
      [],
      IMPACT_FRAME_S * 2,
    )
}
