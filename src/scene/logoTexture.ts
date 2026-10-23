import { CanvasTexture, SRGBColorSpace } from 'three'

const WIDTH = 2048
const HEIGHT = 320
const DISPLAY_FONT = '"Dela Gothic One"'
const WORDMARK_SIZE = 190
const KANA_SIZE = 40
const STROKE = 26
const INK = '#111014'
const PAPER = '#fffaf0'
const ANISOTROPY = 8

// Cylinder UVs start at the front (+z), so the front mark is drawn twice, split across the seam.
const MARK_CENTERS = [0, WIDTH / 2, WIDTH]

function drawMark(ctx: CanvasRenderingContext2D, cx: number) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'

  ctx.font = `${WORDMARK_SIZE}px ${DISPLAY_FONT}`
  ctx.lineWidth = STROKE
  ctx.strokeStyle = INK
  ctx.strokeText('GULP', cx, HEIGHT * 0.44)
  ctx.fillStyle = PAPER
  ctx.fillText('GULP', cx, HEIGHT * 0.44)

  ctx.font = `${KANA_SIZE}px ${DISPLAY_FONT}`
  ctx.fillStyle = INK
  ctx.fillText('ガルプ · 750ML', cx, HEIGHT * 0.88)
}

export function createLogoTexture(): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = ANISOTROPY

  const ctx = canvas.getContext('2d')
  if (!ctx) return texture

  const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    MARK_CENTERS.forEach((cx) => drawMark(ctx, cx))
    texture.needsUpdate = true
  }

  draw()
  document.fonts.load(`${WORDMARK_SIZE}px ${DISPLAY_FONT}`).then(draw)
  return texture
}
