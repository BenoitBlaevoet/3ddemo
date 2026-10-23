// Key light from the upper left, matching the painted highlight strips on the bottle.
const AMBIENT_INTENSITY = 1.05
const KEY_INTENSITY = 2.1
const KEY_POSITION: [number, number, number] = [-4, 3, 2.5]

export function Lights() {
  return (
    <>
      <ambientLight intensity={AMBIENT_INTENSITY} />
      <directionalLight position={KEY_POSITION} intensity={KEY_INTENSITY} />
    </>
  )
}
