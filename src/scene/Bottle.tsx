import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  TorusGeometry,
  Vector3,
} from 'three'
import type { Colorway } from '../lib/colorways'
import { fx, getStage, now, pointer, splash } from '../lib/store'
import { getToonGradient } from '../shaders/toonGradient'
import {
  BAND,
  BODY,
  LID,
  LOGO,
  LOOP,
  MODEL_HEIGHT,
  SHINE,
  SPOUT,
  STRAW,
  createBodyGeometry,
  createLidGeometry,
  createShineGeometry,
} from './bottleGeometry'
import { InkedMesh } from './InkedMesh'
import { createLogoTexture } from './logoTexture'
import { POSE_KEYS, createPose, samplePose } from './poses'

const INK_HEX = '#111014'
const OUTLINE_THICKNESS = 0.024
const THIN_OUTLINE_THICKNESS = 0.017
const SHADOW_OPACITY = 0.22
const SHADOW_SIZE = { x: 0.95, y: 0.13 }

const MAX_DT = 1 / 30
// Damping is stable at any step, so poses use real time and catch up on slow frames.
const MAX_POSE_DT = 0.5
const POSE_DAMPING = 5
const STRAW_FOLDED_RAD = Math.PI / 2
const STRAW_OPEN_RAD = -0.14
const STRAW_STIFFNESS = 260
const STRAW_DAMPING = 10
const STRAW_POP_SPLASH = { count: 16, power: 0.8 }

const IDLE_SPEED = 0.7
const IDLE_SWAY_RAD = 0.16
const IDLE_ROLL_RAD = 0.04
const IDLE_FLOAT = 0.035
const POINTER_YAW_RAD = 0.35
const POINTER_PITCH_RAD = 0.16

const PORTRAIT_ASPECT = 0.8
const PORTRAIT_X_FACTOR = 0.1
const PORTRAIT_SCALE = 0.72

const EXPLODE = { lid: 0.7, straw: 0.3, loop: 0.5, band: 0.45, bandGrow: 0.12 }
const SQUASH = { amount: 0.14, decay: 7, frequency: 28, window: 1.2 }

const WHITE = new Color('#ffffff')
const INK = new Color(INK_HEX)
const BLACK = new Color('#000000')

type Props = {
  colorway: Colorway
  reducedMotion: boolean
}

export function Bottle({ colorway, reducedMotion }: Props) {
  const root = useRef<Group>(null)
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const lid = useRef<Group>(null)
  const straw = useRef<Group>(null)
  const strawTip = useRef<Group>(null)
  const loop = useRef<Group>(null)
  const band = useRef<Mesh>(null)
  const logo = useRef<Mesh>(null)
  const shines = useRef<Group>(null)
  const lidShine = useRef<Mesh>(null)
  const shadow = useRef<Mesh>(null)

  const geometry = useMemo(
    () => ({
      body: createBodyGeometry(),
      lid: createLidGeometry(),
      band: new CylinderGeometry(BAND.radius, BAND.radius, BAND.height, 64),
      logo: new CylinderGeometry(LOGO.radius, LOGO.radius, LOGO.height, 64, 1, true),
      shine: createShineGeometry(SHINE.radius, SHINE.phi, SHINE.width, -0.88, 0.5),
      shineThin: createShineGeometry(SHINE.radius, SHINE.thinPhi, SHINE.thinWidth, -0.62, 0.32),
      lidShine: createShineGeometry(SHINE.lidRadius, SHINE.phi, SHINE.width, 0.84, 1.0),
      spout: new CylinderGeometry(SPOUT.radius, SPOUT.radius, SPOUT.height, 24),
      straw: new CylinderGeometry(STRAW.radius, STRAW.radius, STRAW.length, 20),
      tip: new CapsuleGeometry(STRAW.tip, 0.1, 6, 16),
      hinge: new BoxGeometry(0.16, 0.2, 0.18),
      loop: new TorusGeometry(LOOP.radius, LOOP.tube, 16, 48),
      shadow: new CircleGeometry(1, 48),
    }),
    [],
  )

  const materials = useMemo(() => {
    const gradientMap = getToonGradient()
    return {
      body: new MeshToonMaterial({ gradientMap }),
      accent: new MeshToonMaterial({ gradientMap }),
      straw: new MeshToonMaterial({ gradientMap }),
      shine: new MeshBasicMaterial({ color: WHITE }),
      logo: new MeshBasicMaterial({ map: createLogoTexture(), transparent: true, alphaTest: 0.5 }),
      shadow: new MeshBasicMaterial({
        color: INK,
        transparent: true,
        opacity: SHADOW_OPACITY,
        depthWrite: false,
      }),
    }
  }, [])

  useEffect(
    () => () => {
      Object.values(geometry).forEach((g) => g.dispose())
      materials.logo.map?.dispose()
      Object.values(materials).forEach((m) => m.dispose())
    },
    [geometry, materials],
  )

  const palette = useRef({ body: new Color(), accent: new Color(), straw: new Color() })
  useEffect(() => {
    palette.current.body.set(colorway.body)
    palette.current.accent.set(colorway.accent)
    palette.current.straw.set(colorway.straw)
  }, [colorway])

  const target = useMemo(createPose, [])
  const current = useMemo(createPose, [])
  const motion = useRef({
    ready: false,
    strawAngle: STRAW_FOLDED_RAD,
    strawVelocity: 0,
    lastStraw: 0,
  })
  const tipWorld = useMemo(() => new Vector3(), [])

  useFrame((state, rawDelta) => {
    const parts = [
      root,
      tilt,
      spin,
      lid,
      straw,
      strawTip,
      loop,
      band,
      logo,
      shines,
      lidShine,
      shadow,
    ]
    if (parts.some((part) => !part.current)) return

    const dt = Math.min(rawDelta, MAX_DT)
    const poseDt = Math.min(rawDelta, MAX_POSE_DT)
    const { viewport, clock } = state
    const m = motion.current
    const idle = reducedMotion ? 0 : 1
    const t = clock.elapsedTime

    samplePose(getStage(), target)
    if (!m.ready) {
      Object.assign(current, target)
      m.ready = true
    }
    for (const key of POSE_KEYS) {
      current[key] = MathUtils.damp(current[key], target[key], POSE_DAMPING, poseDt)
    }

    // Placement: pose is expressed in viewport fractions so it survives any screen size.
    const portrait = viewport.aspect < PORTRAIT_ASPECT
    const scale = ((current.h * viewport.height) / MODEL_HEIGHT) * (portrait ? PORTRAIT_SCALE : 1)
    const introDrop = (1 - fx.intro) * viewport.height
    root.current!.position.set(
      current.x * (viewport.width / 2) * (portrait ? PORTRAIT_X_FACTOR : 1),
      ((portrait ? current.py : current.y) * viewport.height) / 2 +
        introDrop +
        Math.sin(t * IDLE_SPEED * 1.6) * IDLE_FLOAT * idle,
      0,
    )
    root.current!.scale.setScalar(scale)

    tilt.current!.rotation.set(
      current.tiltX + pointer.y * POINTER_PITCH_RAD * idle,
      0,
      current.tiltZ + Math.sin(t * IDLE_SPEED) * IDLE_ROLL_RAD * idle,
    )
    spin.current!.rotation.y =
      current.rotY +
      pointer.x * POINTER_YAW_RAD * idle +
      Math.sin(t * IDLE_SPEED * 0.8) * IDLE_SWAY_RAD * idle

    // Squash and stretch after every splash.
    const since = now() - fx.squashAt
    const squash =
      since < SQUASH.window
        ? Math.exp(-since * SQUASH.decay) * Math.sin(since * SQUASH.frequency) * SQUASH.amount
        : 0
    tilt.current!.scale.set(1 - squash * 0.5, 1 + squash, 1 - squash * 0.5)

    // Straw: a spring, so it overshoots when it pops.
    const strawTarget = MathUtils.lerp(STRAW_FOLDED_RAD, STRAW_OPEN_RAD, target.straw)
    m.strawVelocity += (strawTarget - m.strawAngle) * STRAW_STIFFNESS * dt
    m.strawVelocity *= Math.exp(-STRAW_DAMPING * dt)
    m.strawAngle += m.strawVelocity * dt
    straw.current!.rotation.z = m.strawAngle
    if (target.straw > 0.5 && m.lastStraw <= 0.5)
      splash(STRAW_POP_SPLASH.count, STRAW_POP_SPLASH.power)
    m.lastStraw = target.straw

    // Exploded view.
    const e = current.explode
    lid.current!.position.y = e * EXPLODE.lid
    lidShine.current!.position.y = e * EXPLODE.lid
    straw.current!.position.y = STRAW.pivotY + e * EXPLODE.straw
    loop.current!.position.x = -e * EXPLODE.loop
    band.current!.position.y = BAND.y - e * EXPLODE.band
    const bandGrow = 1 + e * EXPLODE.bandGrow
    band.current!.scale.set(bandGrow, 1, bandGrow)

    // Contact shadow stays on the "ground" while the bottle drops in.
    shadow.current!.position.y = BODY.bottomY - 0.06 - introDrop / scale
    shadow.current!.scale.set(SHADOW_SIZE.x * (0.4 + 0.6 * fx.intro), SHADOW_SIZE.y, 1)

    // Impact frames: flat white silhouette, then flat ink silhouette.
    const mode = fx.impact
    const flat = mode === 1 ? WHITE : INK
    materials.body.color.copy(mode ? flat : palette.current.body)
    materials.accent.color.copy(mode ? flat : palette.current.accent)
    materials.straw.color.copy(mode ? flat : palette.current.straw)
    const glow = mode === 1 ? WHITE : BLACK
    materials.body.emissive.copy(glow)
    materials.accent.emissive.copy(glow)
    materials.straw.emissive.copy(glow)
    shines.current!.visible = mode === 0
    logo.current!.visible = mode === 0
    shadow.current!.visible = mode === 0

    strawTip.current!.getWorldPosition(tipWorld)
    fx.emitter.x = tipWorld.x
    fx.emitter.y = tipWorld.y
    fx.emitter.z = tipWorld.z
  })

  return (
    <group ref={root}>
      <mesh
        ref={shadow}
        geometry={geometry.shadow}
        material={materials.shadow}
        position={[0, BODY.bottomY, -0.7]}
      />
      <group ref={tilt}>
        <InkedMesh
          geometry={geometry.body}
          material={materials.body}
          thickness={OUTLINE_THICKNESS}
        />
        <InkedMesh
          ref={band}
          geometry={geometry.band}
          material={materials.accent}
          position={[0, BAND.y, 0]}
          thickness={THIN_OUTLINE_THICKNESS}
        />
        <group ref={shines}>
          <mesh geometry={geometry.shine} material={materials.shine} />
          <mesh geometry={geometry.shineThin} material={materials.shine} />
          <mesh ref={lidShine} geometry={geometry.lidShine} material={materials.shine} />
        </group>

        <group ref={spin}>
          <mesh
            ref={logo}
            geometry={geometry.logo}
            material={materials.logo}
            position={[0, LOGO.y, 0]}
          />
          <group ref={lid}>
            <InkedMesh
              geometry={geometry.lid}
              material={materials.accent}
              thickness={OUTLINE_THICKNESS}
            />
            <InkedMesh
              geometry={geometry.spout}
              material={materials.accent}
              position={[STRAW.x, LID.topY + SPOUT.height / 2 - 0.02, 0]}
              thickness={THIN_OUTLINE_THICKNESS}
            />
            <group ref={straw} position={[STRAW.x, STRAW.pivotY, 0]}>
              <InkedMesh
                geometry={geometry.straw}
                material={materials.straw}
                position={[0, STRAW.length / 2, 0]}
                thickness={THIN_OUTLINE_THICKNESS}
              />
              <InkedMesh
                geometry={geometry.tip}
                material={materials.straw}
                position={[0, STRAW.length, 0]}
                thickness={THIN_OUTLINE_THICKNESS}
              />
              <group ref={strawTip} position={[0, STRAW.length + 0.12, 0]} />
            </group>
            <group ref={loop}>
              <InkedMesh
                geometry={geometry.hinge}
                material={materials.accent}
                position={[LOOP.hingeX, LOOP.y, 0]}
                thickness={THIN_OUTLINE_THICKNESS}
              />
              <InkedMesh
                geometry={geometry.loop}
                material={materials.accent}
                position={[LOOP.ringX, LOOP.y, 0]}
                thickness={THIN_OUTLINE_THICKNESS}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
