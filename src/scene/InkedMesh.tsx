import { forwardRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import type { BufferGeometry, Mesh } from 'three'
import { getInkOutlineMaterial } from '../shaders/inkOutline'

type Props = ThreeElements['mesh'] & {
  geometry: BufferGeometry
  thickness: number
}

// A mesh plus its inverted-hull ink outline, sharing one geometry.
export const InkedMesh = forwardRef<Mesh, Props>(function InkedMesh(
  { geometry, thickness, children, ...props },
  ref,
) {
  return (
    <mesh ref={ref} geometry={geometry} {...props}>
      <mesh geometry={geometry} material={getInkOutlineMaterial(thickness)} />
      {children}
    </mesh>
  )
})
