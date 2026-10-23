import type { RefObject } from 'react'
import { ScrollTrigger, useGSAP } from './gsap'
import { scroll } from './store'

// Writes a section's scroll progress (top hits top → bottom hits top) into the shared store.
export function useSectionProgress(ref: RefObject<HTMLElement>, index: number) {
  useGSAP(
    () => {
      if (!ref.current) return

      const write = (self: ScrollTrigger) => {
        scroll.progress[index] = self.progress
      }

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: write,
        onRefresh: write,
      })
    },
    { scope: ref },
  )
}
