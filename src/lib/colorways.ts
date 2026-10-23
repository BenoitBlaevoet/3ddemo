export type Colorway = {
  id: string
  name: string
  jp: string
  body: string
  accent: string
  straw: string
  bg: string
}

// One bottle, five paint jobs. Geometry never changes between colorways.
export const COLORWAYS: Colorway[] = [
  {
    id: 'electric',
    name: 'Electric',
    jp: 'エレクトリック',
    body: '#1e6fe0',
    accent: '#a6e22e',
    straw: '#ffffff',
    bg: '#ff5a7a',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    jp: 'サクラ',
    body: '#ff7eb6',
    accent: '#fff3e0',
    straw: '#ff3d7f',
    bg: '#63d9c6',
  },
  {
    id: 'yuzu',
    name: 'Yuzu',
    jp: 'ユズ',
    body: '#ffd23f',
    accent: '#ff6b1a',
    straw: '#ffffff',
    bg: '#35b3c4',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    jp: 'ミッドナイト',
    body: '#2b2f7a',
    accent: '#ff3d9a',
    straw: '#ffe14d',
    bg: '#a99cff',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    jp: 'マッチャ',
    body: '#7cc04b',
    accent: '#f6ebd2',
    straw: '#e8304a',
    bg: '#f6a33d',
  },
]

export function applyColorwayVars(colorway: Colorway) {
  const root = document.documentElement.style
  root.setProperty('--color-bg', colorway.bg)
  root.setProperty('--color-body', colorway.body)
  root.setProperty('--color-accent', colorway.accent)
  root.setProperty('--color-straw', colorway.straw)
}
