import { DataTexture, NearestFilter, RedFormat } from 'three'

// Two hard tones: shadow and lit. NearestFilter keeps the terminator a crisp cel edge.
const TONES = [110, 255]

let cached: DataTexture | null = null

export function getToonGradient(): DataTexture {
  if (cached) return cached

  const texture = new DataTexture(new Uint8Array(TONES), TONES.length, 1, RedFormat)
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
  cached = texture
  return texture
}
