import { BackSide, MeshBasicMaterial } from 'three'

const INK_HEX = '#111014'
const cache = new Map<number, MeshBasicMaterial>()

// Inverted hull: back faces pushed out along the normal, drawn in flat ink.
// Thickness is in object units, so it scales with the mesh.
export function getInkOutlineMaterial(thickness: number): MeshBasicMaterial {
  const cached = cache.get(thickness)
  if (cached) return cached

  const material = new MeshBasicMaterial({ color: INK_HEX, side: BackSide })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\ntransformed += normalize(normal) * ${thickness.toFixed(4)};`,
    )
  }
  material.customProgramCacheKey = () => `ink-outline-${thickness}`
  cache.set(thickness, material)
  return material
}
