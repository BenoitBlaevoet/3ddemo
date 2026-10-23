import { SpeedLines } from './SpeedLines'
import styles from './ImpactFlash.module.css'

const IMPACT_LINE_COUNT = 110
const IMPACT_INNER_RADIUS = 14

// Full-screen impact frame. Shown by the `is-impact-*` classes set in lib/impact.
export function ImpactFlash() {
  return (
    <div className={styles.flash} aria-hidden="true">
      <SpeedLines count={IMPACT_LINE_COUNT} inner={IMPACT_INNER_RADIUS} className={styles.lines} />
    </div>
  )
}
