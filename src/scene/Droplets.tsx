import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, InstancedMesh, Matrix4, Quaternion, SphereGeometry, Vector3 } from 'three'
import { fx } from '../lib/store'
import { getToonGradient } from '../shaders/toonGradient'

const CAPACITY = 90
const LIFE_S = 1.4
const GRAVITY = -9.5
const MAX_DT = 1 / 30
const SPREAD = { x: 3.2, z: 1.6, upMin: 2.4, upRange: 3 }
const SIZE = { min: 0.025, range: 0.04 }
const STRETCH_PER_SPEED = 0.12
const MAX_STRETCH = 0.9
const OUTLINE = 0.014
const FADE_IN_LIFE = 0.33
const DROP_HEX = '#d9f4ff'
const INK_HEX = '#111014'
const UP = new Vector3(0, 1, 0)

// Cel-shaded water: instanced spheres stretched along velocity, with a manual inverted-hull outline.
export function Droplets() {
  const drops = useRef<InstancedMesh>(null)
  const hull = useRef<InstancedMesh>(null)

  const sim = useMemo(
    () => ({
      position: new Float32Array(CAPACITY * 3),
      velocity: new Float32Array(CAPACITY * 3),
      age: new Float32Array(CAPACITY).fill(LIFE_S),
      size: new Float32Array(CAPACITY),
      next: 0,
    }),
    [],
  )
  const geometry = useMemo(() => new SphereGeometry(1, 14, 10), [])
  const temp = useMemo(
    () => ({
      matrix: new Matrix4(),
      quat: new Quaternion(),
      pos: new Vector3(),
      dir: new Vector3(),
      scale: new Vector3(),
    }),
    [],
  )

  useFrame((_, rawDelta) => {
    if (!drops.current || !hull.current) return
    const dt = Math.min(rawDelta, MAX_DT)

    for (; fx.pendingBurst > 0; fx.pendingBurst--) {
      const i = sim.next
      sim.next = (i + 1) % CAPACITY
      const power = fx.burstPower
      sim.position.set([fx.emitter.x, fx.emitter.y, fx.emitter.z], i * 3)
      sim.velocity.set(
        [
          (Math.random() - 0.5) * SPREAD.x * power,
          (SPREAD.upMin + Math.random() * SPREAD.upRange) * power,
          (Math.random() - 0.5) * SPREAD.z * power,
        ],
        i * 3,
      )
      sim.age[i] = 0
      sim.size[i] = SIZE.min + Math.random() * SIZE.range
    }

    const { matrix, quat, pos, dir, scale } = temp
    for (let i = 0; i < CAPACITY; i++) {
      if (sim.age[i] >= LIFE_S) {
        matrix.makeScale(0, 0, 0)
        drops.current.setMatrixAt(i, matrix)
        hull.current.setMatrixAt(i, matrix)
        continue
      }

      const p = i * 3
      sim.age[i] += dt
      sim.velocity[p + 1] += GRAVITY * dt
      sim.position[p] += sim.velocity[p] * dt
      sim.position[p + 1] += sim.velocity[p + 1] * dt
      sim.position[p + 2] += sim.velocity[p + 2] * dt

      pos.fromArray(sim.position, p)
      dir.fromArray(sim.velocity, p)
      const speed = dir.length()
      quat.setFromUnitVectors(UP, dir.normalize())

      const life = 1 - sim.age[i] / LIFE_S
      const s = sim.size[i] * Math.min(1, life / FADE_IN_LIFE)
      const stretch = 1 + Math.min(speed * STRETCH_PER_SPEED, MAX_STRETCH)

      drops.current.setMatrixAt(i, matrix.compose(pos, quat, scale.set(s, s * stretch, s)))
      hull.current.setMatrixAt(
        i,
        matrix.compose(pos, quat, scale.set(s + OUTLINE, s * stretch + OUTLINE, s + OUTLINE)),
      )
    }
    drops.current.instanceMatrix.needsUpdate = true
    hull.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={hull} args={[geometry, undefined, CAPACITY]} frustumCulled={false}>
        <meshBasicMaterial color={INK_HEX} side={BackSide} />
      </instancedMesh>
      <instancedMesh ref={drops} args={[geometry, undefined, CAPACITY]} frustumCulled={false}>
        <meshToonMaterial color={DROP_HEX} gradientMap={getToonGradient()} />
      </instancedMesh>
    </>
  )
}
