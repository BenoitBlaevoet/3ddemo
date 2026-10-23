import { Canvas } from '@react-three/fiber'
import type { Colorway } from '../lib/colorways'
import { Bottle } from './Bottle'
import { Droplets } from './Droplets'
import { Lights } from './Lights'
import styles from './Stage.module.css'

const CAMERA = { position: [0, 0, 8] as [number, number, number], fov: 30 }
const DPR: [number, number] = [1, 2]

type Props = {
  colorway: Colorway
  reducedMotion: boolean
}

// The single, fixed WebGL canvas behind the page. Sections drive it through lib/store.
export function Stage({ colorway, reducedMotion }: Props) {
  return (
    <div className={styles.stage} aria-hidden="true">
      <Canvas flat dpr={DPR} camera={CAMERA} gl={{ antialias: true, alpha: true }}>
        <Lights />
        <Bottle colorway={colorway} reducedMotion={reducedMotion} />
        <Droplets />
      </Canvas>
    </div>
  )
}
