// src/data/dinoSprites.js
// SVG 픽셀 마스코트용 데이터/조합 함수
// '.' = 투명, X = 외곽선, A = dinos.json accent 색, B = 밝은 배색,
// D = 어두운 몸색, E = 눈, W = 흰색/이빨, H = 뿔/뼈,
// P = 골판/장식, F = 깃털, C = 볏/특수부위

export const GRID_W = 48
export const GRID_H = 40

function normalizeGrid(grid) {
  return Array.from({ length: GRID_H }, (_, y) =>
    (grid[y] ?? '').padEnd(GRID_W, '.').slice(0, GRID_W),
  )
}

function mergeLayers(layers) {
  const normalized = layers.filter(Boolean).map(normalizeGrid)
  const canvas = Array.from({ length: GRID_H }, () => Array(GRID_W).fill('.'))

  for (const layer of normalized) {
    for (let y = 0; y < GRID_H; y += 1) {
      for (let x = 0; x < GRID_W; x += 1) {
        const ch = layer[y][x]
        if (ch !== '.') canvas[y][x] = ch
      }
    }
  }

  return canvas.map((row) => row.join(''))
}

function offsetLayer(grid, dx = 0, dy = 0) {
  const src = normalizeGrid(grid)
  const out = Array.from({ length: GRID_H }, () => Array(GRID_W).fill('.'))

  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      const ch = src[y][x]
      if (ch === '.') continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
        out[ny][nx] = ch
      }
    }
  }

  return out.map((row) => row.join(''))
}

// ------------------------------------------------------------
// 디테일 패스: 48x40으로 늘어난 해상도를 실제로 활용한다.
// 원본 24x20에서는 한 칸도 못 쓰던 표현이라 2배 확대 후에만 의미가 있다.
// ------------------------------------------------------------

// 명암 두께. 2배 캔버스에서 2칸 = 원본 기준 1칸이라 실루엣을 해치지 않는다.
const SHADE_DEPTH = 2

// 몸통(A)에 위/아래 명암을 넣어 입체감을 만든다.
// 위에서 빛이 온다고 보고 윗면은 B(밝게), 아랫면은 D(어둡게).
function applyShading(rows) {
  const src = rows.map((row) => [...row])
  const isBody = (x, y) => src[y]?.[x] === 'A'

  return src.map((row, y) =>
    row
      .map((ch, x) => {
        if (ch !== 'A') return ch

        // 이 픽셀 위로 몸통이 몇 칸이나 이어지는지 센다
        let up = 0
        while (up < SHADE_DEPTH && isBody(x, y - up - 1)) up += 1
        if (up < SHADE_DEPTH) return 'B'

        let down = 0
        while (down < SHADE_DEPTH && isBody(x, y + down + 1)) down += 1
        if (down < SHADE_DEPTH) return 'D'

        return 'A'
      })
      .join(''),
  )
}

// 눈(E) 덩어리의 좌상단 한 칸을 흰색으로 바꿔 반짝임을 넣는다.
// 확대 전에는 눈이 1칸뿐이라 불가능했던 표현.
function applyEyeHighlight(rows) {
  const src = rows.map((row) => [...row])
  const isEye = (x, y) => src[y]?.[x] === 'E'

  return src.map((row, y) =>
    row.map((ch, x) => (ch === 'E' && !isEye(x - 1, y) && !isEye(x, y - 1) ? 'W' : ch)).join(''),
  )
}

function applyDetail(rows) {
  return applyEyeHighlight(applyShading(rows))
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const n = Number.parseInt(clean, 16)
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

function mix(hex, target, amount) {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

export function createPalette(accent = '#6D9B54') {
  return {
    '.': 'transparent',
    X: '#1F2923',
    A: accent,
    B: mix(accent, '#FFFFFF', 0.38),
    D: mix(accent, '#000000', 0.28),
    E: '#111111',
    W: '#FFFFFF',
    H: '#E9DDBE',
    P: mix(accent, '#D88378', 0.45),
    F: mix(accent, '#EEF4FF', 0.28),
    C: mix(accent, '#FFD36B', 0.25),

    // weather/accessory colors
    S: '#15191F', // sunglasses
    U: '#4169E1', // umbrella
    V: '#2F4FB0', // umbrella rib/handle
    R: '#D64C4C', // scarf
    N: '#D54A43', // winter hat
    M: '#EAF3F7', // mask
    Q: '#90CAF9', // raindrop
    I: '#D6F2FF', // snow/ice
    Y: '#FFD54F', // sun/sparkle
    Z: '#6F7BC5', // zzz
  }
}

// ------------------------------------------------------------
// 1) 체형 베이스
// ------------------------------------------------------------
export const baseSprites = {
  largeTheropod: [
    '................................................',
    '................................................',
    '........................XXXXXXXX................',
    '........................XXXXXXXX................',
    '....................XXXXAAAAAAAAXXXXXXXX........',
    '....................XXXXAAAAAAAAXXXXXXXX........',
    '..................XXAAAAAAAAAAAAAAEEEEXX........',
    '..................XXAAAAAAAAAAAAAAEEEEXX........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '....................XXAAAAWWWWAAAAAAXX..........',
    '....................XXAAAAWWWWAAAAAAXX..........',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX..............',
    'XXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX..............',
    'XXXXAAAAAAAAAAAAXX..XXAAAAAAAAXX................',
    'XXXXAAAAAAAAAAAAXX..XXAAAAAAAAXX................',
    '....XXXXXXXXXXXX....XXAAAAAAXX..................',
    '....XXXXXXXXXXXX....XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '..................XXXX....XXXX..................',
    '..................XXXX....XXXX..................',
    '................XX..........XX..................',
    '................XX..........XX..................',
    '................XXXX........XXXX................',
    '................XXXX........XXXX................',
  ],

  longSnoutTheropod: [
    '................................................',
    '................................................',
    '..........................XXXXXXXXXXXXXX........',
    '..........................XXXXXXXXXXXXXX........',
    '....................XXXXXXAAAAAAAAAAAAAAXX......',
    '....................XXXXXXAAAAAAAAAAAAAAXX......',
    '..................XXAAAAAAAAAAAAAAEEEEAAAAXX....',
    '..................XXAAAAAAAAAAAAAAEEEEAAAAXX....',
    '..................XXAAAAAAAAAAAAAAAAAAAAXX......',
    '..................XXAAAAAAAAAAAAAAAAAAAAXX......',
    '....................XXAAAAWWWWWWAAAAAAXX........',
    '....................XXAAAAWWWWWWAAAAAAXX........',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX..............',
    'XXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX..............',
    'XXXXAAAAAAAAAAAAXX..XXAAAAAAAAXX................',
    'XXXXAAAAAAAAAAAAXX..XXAAAAAAAAXX................',
    '....XXXXXXXXXXXX....XXAAAAAAXX..................',
    '....XXXXXXXXXXXX....XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '..................XXXX....XXXX..................',
    '..................XXXX....XXXX..................',
    '................XX..........XX..................',
    '................XX..........XX..................',
    '................XXXX........XXXX................',
    '................XXXX........XXXX................',
  ],

  featheredTheropod: [
    '................................................',
    '................................................',
    '......................FFXXXXXXXXFF..............',
    '......................FFXXXXXXXXFF..............',
    '..................FFFFXXAAAAAAAAXXXXXX..........',
    '..................FFFFXXAAAAAAAAXXXXXX..........',
    '................FFXXAAAAAAAAAAAAEEEEXX..........',
    '................FFXXAAAAAAAAAAAAEEEEXX..........',
    '................XXAAAAAAAAAAAAAAAAAAXX..........',
    '................XXAAAAAAAAAAAAAAAAAAXX..........',
    '..................XXAAAAWWWWAAAAAAXX............',
    '..................XXAAAAWWWWAAAAAAXX............',
    '............FFFFXXXXAAAAAAAAAAAAXXFF............',
    '............FFFFXXXXAAAAAAAAAAAAXXFF............',
    '........FFFFXXAAAAAAAAAAAAAAAAAAXXFF............',
    '........FFFFXXAAAAAAAAAAAAAAAAAAXXFF............',
    '....FFFFXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....FFFFXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXXXAAAAAAAAAAAAFFXXAAAAAAAAAAAAXXFF............',
    'XXXXAAAAAAAAAAAAFFXXAAAAAAAAAAAAXXFF............',
    '....XXXXXXXXXXXXFF..XXAAAAAAAAXXFF..............',
    '....XXXXXXXXXXXXFF..XXAAAAAAAAXXFF..............',
    '..................FFXXAAAAAAXXFF................',
    '..................FFXXAAAAAAXXFF................',
    '..................FFXXAAAAAAXXFF................',
    '..................FFXXAAAAAAXXFF................',
    '................FFFFXX....XXXXFF................',
    '................FFFFXX....XXXXFF................',
    '..............FFFF..........XXFF................',
    '..............FFFF..........XXFF................',
    '................XXXX........XXXX................',
    '................XXXX........XXXX................',
  ],

  smallRaptor: [
    '................................................',
    '................................................',
    '........................XXXXXX..................',
    '........................XXXXXX..................',
    '....................XXXXAAAAAAXXXXXX............',
    '....................XXXXAAAAAAXXXXXX............',
    '..................XXAAAAAAAAAAEEEEAAXX..........',
    '..................XXAAAAAAAAAAEEEEAAXX..........',
    '....................XXAAAAAAAAAAAAXX............',
    '....................XXAAAAAAAAAAAAXX............',
    '......................XXAAWWAAAAAAXX............',
    '......................XXAAWWAAAAAAXX............',
    '................XXXXXXAAAAAAAAAAXX..............',
    '................XXXXXXAAAAAAAAAAXX..............',
    '............XXXXAAAAAAAAAAAAAAAAXX..............',
    '............XXXXAAAAAAAAAAAAAAAAXX..............',
    '........XXXXAAAAAAAAAAAAAAAAAAXX................',
    '........XXXXAAAAAAAAAAAAAAAAAAXX................',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAXX................',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAXX................',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAXX................',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAXX................',
    'XXXXAAAAAAAAAAAAXXAAAAAAAAAAXX..................',
    'XXXXAAAAAAAAAAAAXXAAAAAAAAAAXX..................',
    '....XXXXXXXXXXXXXX..XXAAAAAAXX..................',
    '....XXXXXXXXXXXXXX..XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '....................XXAAAAAAXX..................',
    '..................XXXX....XXXX..................',
    '..................XXXX....XXXX..................',
    '................XX..........XX..................',
    '................XX..........XX..................',
    '................XXXX........XXXX................',
    '................XXXX........XXXX................',
  ],

  hadrosaur: [
    '................................................',
    '................................................',
    '..........................XXXXXXXX..............',
    '..........................XXXXXXXX..............',
    '......................XXXXAAAAAAAAXXXXXX........',
    '......................XXXXAAAAAAAAXXXXXX........',
    '....................XXAAAAAAAAAAAAEEEEXX........',
    '....................XXAAAAAAAAAAAAEEEEXX........',
    '....................XXAAAAAAAAAAAAAAAAAAXX......',
    '....................XXAAAAAAAAAAAAAAAAAAXX......',
    '......................XXAAAAAAAAAAAAAAXX........',
    '......................XXAAAAAAAAAAAAAAXX........',
    '..............XXXXXXXXXXAAAAAAAAAAAAXX..........',
    '..............XXXXXXXXXXAAAAAAAAAAAAXX..........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAXX............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '................XXAAAAAAAAAAAAAAXX..............',
    '................XXAAAAAAAAAAAAAAXX..............',
    '..............XXXXAAAAXX..XXAAAAAAXX............',
    '..............XXXXAAAAXX..XXAAAAAAXX............',
    '............XXAAAAAAXX....XXAAAAAAXX............',
    '............XXAAAAAAXX....XXAAAAAAXX............',
    '............XXXX..XX........XX..XXXX............',
    '............XXXX..XX........XX..XXXX............',
  ],

  ceratopsian: [
    '................................................',
    '................................................',
    '......................XXXXXXXXXXXX..............',
    '......................XXXXXXXXXXXX..............',
    '..................XXXXAAAAAAAAAAAAAAXX..........',
    '..................XXXXAAAAAAAAAAAAAAXX..........',
    '................XXAAAAAAAAAAAAAAEEEEAAXX........',
    '................XXAAAAAAAAAAAAAAEEEEAAXX........',
    '..............XXAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..............XXAAAAAAAAAAAAAAAAAAAAAAXX........',
    '................XXAAAAAAAAAAAAAAAAAAXX..........',
    '................XXAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXXXXXXXAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXXXXXXXAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '..............XXAAAAAAAAAAAAAAAAXX..............',
    '..............XXAAAAAAAAAAAAAAAAXX..............',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXXX..XX......XX..XXXX..............',
    '............XXXX..XX......XX..XXXX..............',
  ],

  smallCeratopsian: [
    '................................................',
    '................................................',
    '........................XXXXXXXXXX..............',
    '........................XXXXXXXXXX..............',
    '....................XXXXAAAAAAAAAAXX............',
    '....................XXXXAAAAAAAAAAXX............',
    '..................XXAAAAAAAAAAEEEEAAXX..........',
    '..................XXAAAAAAAAAAEEEEAAXX..........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '............XXXXXXXXXXAAAAAAAAAAAAXX............',
    '............XXXXXXXXXXAAAAAAAAAAAAXX............',
    '........XXXXAAAAAAAAAAAAAAAAAAAAXX..............',
    '........XXXXAAAAAAAAAAAAAAAAAAAAXX..............',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX..............',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX..............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAXX................',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAXX................',
    '..............XXAAAAAAAAAAAAAAXX................',
    '..............XXAAAAAAAAAAAAAAXX................',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXAAAAAAXX..XXAAAAAAXX..............',
    '............XXXX..XX......XX..XXXX..............',
    '............XXXX..XX......XX..XXXX..............',
  ],

  stegosaur: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..........................XXXXXX................',
    '..........................XXXXXX................',
    '....................XXXXXXXXAAAAXX..............',
    '....................XXXXXXXXAAAAXX..............',
    '..............XXXXXXAAAAAAAAAAAAAAXX............',
    '..............XXXXXXAAAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX............',
    '............XXAAAAAAAAAAAAAAAAAAXX..............',
    '............XXAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXAAAAAAXX......XXAAAAAAXX............',
    '..........XXAAAAAAXX......XXAAAAAAXX............',
    '..........XXAAAAAAXX......XXAAAAAAXX............',
    '..........XXAAAAAAXX......XXAAAAAAXX............',
    '..........XXXX..XX..........XX..XXXX............',
    '..........XXXX..XX..........XX..XXXX............',
  ],

  ankylosaur: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '....................XXXXXXXXXXXXXX..............',
    '....................XXXXXXXXXXXXXX..............',
    '..............XXXXXXAAAAAAAAAAAAAAXX............',
    '..............XXXXXXAAAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXAAAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXAAAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXAAAAAAAAAAAAAAAAAAXX................',
    '..........XXAAAAAAAAAAAAAAAAAAXX................',
    '........XXAAAAAAXX......XXAAAAAAXX..............',
    '........XXAAAAAAXX......XXAAAAAAXX..............',
    '........XXAAAAAAXX......XXAAAAAAXX..............',
    '........XXAAAAAAXX......XXAAAAAAXX..............',
    '........XXXX..XX..........XX..XXXX..............',
    '........XXXX..XX..........XX..XXXX..............',
  ],

  sauropodTall: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..............................XXXXXX............',
    '..............................XXXXXX............',
    '............................XXAAEEEEXX..........',
    '............................XXAAEEEEXX..........',
    '............................XXAAAAAAXX..........',
    '............................XXAAAAAAXX..........',
    '..........................XXAAAAAAAAXX..........',
    '..........................XXAAAAAAAAXX..........',
    '........................XXAAAAAAAAAAXX..........',
    '........................XXAAAAAAAAAAXX..........',
    '......................XXAAAAAAAAAAAAXX..........',
    '......................XXAAAAAAAAAAAAXX..........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '............XXXXXXXXXXAAAAAAAAAAAAAAAAXX........',
    '............XXXXXXXXXXAAAAAAAAAAAAAAAAXX........',
    '........XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '........XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX..........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XX......XX......XX......XX........',
    '..............XX......XX......XX......XX........',
    '..............XXXX....XXXX....XXXX....XXXX......',
    '..............XXXX....XXXX....XXXX....XXXX......',
  ],

  sauropodHeavy: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............................XXXXXX..............',
    '............................XXXXXX..............',
    '..........................XXAAEEEEXX............',
    '..........................XXAAEEEEXX............',
    '..........................XXAAAAAAXX............',
    '..........................XXAAAAAAXX............',
    '........................XXAAAAAAAAXX............',
    '........................XXAAAAAAAAXX............',
    '......................XXAAAAAAAAAAXX............',
    '......................XXAAAAAAAAAAXX............',
    '....................XXAAAAAAAAAAAAXX............',
    '....................XXAAAAAAAAAAAAXX............',
    '..............XXXXXXXXAAAAAAAAAAAAAAXX..........',
    '..............XXXXXXXXAAAAAAAAAAAAAAXX..........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '....XXXXXXXXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXXXXXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '............XXAAAAAAAAXX....XXAAAAAAAAXX........',
    '............XXAAAAAAAAXX....XXAAAAAAAAXX........',
    '............XXAAAAAAAAXX....XXAAAAAAAAXX........',
    '............XXAAAAAAAAXX....XXAAAAAAAAXX........',
    '............XX......XX........XX......XX........',
    '............XX......XX........XX......XX........',
    '............XXXX....XXXX......XXXX....XXXX......',
    '............XXXX....XXXX......XXXX....XXXX......',
  ],

  sauropodLongTail: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..............................XXXXXX............',
    '..............................XXXXXX............',
    '............................XXAAEEEEXX..........',
    '............................XXAAEEEEXX..........',
    '............................XXAAAAAAXX..........',
    '............................XXAAAAAAXX..........',
    '..........................XXAAAAAAAAXX..........',
    '..........................XXAAAAAAAAXX..........',
    '........................XXAAAAAAAAAAXX..........',
    '........................XXAAAAAAAAAAXX..........',
    '......................XXAAAAAAAAAAAAXX..........',
    '......................XXAAAAAAAAAAAAXX..........',
    '..............XXXXXXXXXXAAAAAAAAAAAAAAXX........',
    '..............XXXXXXXXXXAAAAAAAAAAAAAAXX........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXXXXXXXX',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXXXXXXXX',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......XX',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......XX',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX..........',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAAAXX..........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XXAAAAAAAAXX..XXAAAAAAAAXX........',
    '..............XX......XX......XX......XX........',
    '..............XX......XX......XX......XX........',
    '..............XXXX....XXXX....XXXX....XXXX......',
    '..............XXXX....XXXX....XXXX....XXXX......',
  ],

  iguanodont: [
    '................................................',
    '................................................',
    '........................XXXXXXXX................',
    '........................XXXXXXXX................',
    '....................XXXXAAAAAAAAXXXXXX..........',
    '....................XXXXAAAAAAAAXXXXXX..........',
    '..................XXAAAAAAAAAAAAEEEEXX..........',
    '..................XXAAAAAAAAAAAAEEEEXX..........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '..................XXAAAAAAAAAAAAAAAAAAXX........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '....................XXAAAAAAAAAAAAAAXX..........',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..............XXXXXXXXAAAAAAAAAAAAXX............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '..........XXXXAAAAAAAAAAAAAAAAAAXX..............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX............',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '....XXXXXXXXXXXXAAAAAAAAAAAAAAAAXX..............',
    '................XXAAAAAAAAAAAAAAXX..............',
    '................XXAAAAAAAAAAAAAAXX..............',
    '..............XXAAAAAAXX..XXAAAAAAXX............',
    '..............XXAAAAAAXX..XXAAAAAAXX............',
    '..............XXAAAAAAXX..XXAAAAAAXX............',
    '..............XXAAAAAAXX..XXAAAAAAXX............',
    '..............XXXX..XX......XX..XXXX............',
    '..............XXXX..XX......XX..XXXX............',
  ],

  therizino: [
    '................................................',
    '................................................',
    '........................FFFFFF..................',
    '........................FFFFFF..................',
    '....................FFFFXXXXXXFFFF..............',
    '....................FFFFXXXXXXFFFF..............',
    '..................FFXXAAAAAAAAXXFFFF............',
    '..................FFXXAAAAAAAAXXFFFF............',
    '..................XXAAAAAAAAEEEEXX..............',
    '..................XXAAAAAAAAEEEEXX..............',
    '....................XXAAAAAAAAAAXX..............',
    '....................XXAAAAAAAAAAXX..............',
    '..............FFFFXXXXAAAAAAAAAAXXFFFF..........',
    '..............FFFFXXXXAAAAAAAAAAXXFFFF..........',
    '............FFXXAAAAAAAAAAAAAAAAAAXXFFFF........',
    '............FFXXAAAAAAAAAAAAAAAAAAXXFFFF........',
    '..........XXAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..........XXAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '........XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '........XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX........',
    '....XXXXAAAAAAAAAAAAAAAAXXAAAAAAAAAAAAXX........',
    '........XXXXXXXXXXXXXX..XXAAAAAAAAAAXX..........',
    '........XXXXXXXXXXXXXX..XXAAAAAAAAAAXX..........',
    '........................XXAAAAAAAAXX............',
    '........................XXAAAAAAAAXX............',
    '....................XXXXXX......XXXXXX..........',
    '....................XXXXXX......XXXXXX..........',
    '..................XX..................XX........',
    '..................XX..................XX........',
    '..................XXXX................XXXX......',
    '..................XXXX................XXXX......',
  ],

  pterosaur: [
    '................................................',
    '................................................',
    '..........................XXXXXXXXXX............',
    '..........................XXXXXXXXXX............',
    '......................XXXXAAAAAAAAAAXXXXXX......',
    '......................XXXXAAAAAAAAAAXXXXXX......',
    '....................XXAAAAAAAAAAAAAAEEEEXX......',
    '....................XXAAAAAAAAAAAAAAEEEEXX......',
    '..........XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAXX......',
    '..........XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAXX......',
    '....XXXXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXXXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXXXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '........XXXXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '........XXXXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..............XXXXAAAAAAAAAAAAAAAAXX............',
    '..............XXXXAAAAAAAAAAAAAAAAXX............',
    '..................XXAAAAAAAAAAAAXX..............',
    '..................XXAAAAAAAAAAAAXX..............',
    '....................XXAAAAAAAAXX................',
    '....................XXAAAAAAAAXX................',
    '......................XXAAAAAAXX................',
    '......................XXAAAAAAXX................',
    '......................XXAAAAAAXX................',
    '......................XXAAAAAAXX................',
    '....................XXXX....XXXX................',
    '....................XXXX....XXXX................',
    '..................XX..........XX................',
    '..................XX..........XX................',
    '..................XXXX........XXXX..............',
    '..................XXXX........XXXX..............',
  ],

  pterosaurTall: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..........................XXXXXXXX..............',
    '..........................XXXXXXXX..............',
    '........................XXAAEEEEXX..............',
    '........................XXAAEEEEXX..............',
    '......................XXAAAAAAAAXXXXXXXX........',
    '......................XXAAAAAAAAXXXXXXXX........',
    '....................XXAAAAAAAAAAAAAAAAAAXX......',
    '....................XXAAAAAAAAAAAAAAAAAAXX......',
    '........XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAXX........',
    '........XXXXXXXXXXXXAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '....XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    'XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '............XXAAAAAAAAAAAAAAAAAAAAXX............',
    '............XXAAAAAAAAAAAAAAAAAAAAXX............',
    '..............XXAAAAAAAAAAAAAAAAXX..............',
    '..............XXAAAAAAAAAAAAAAAAXX..............',
    '................XXAAAAAAAAAAAAXX................',
    '................XXAAAAAAAAAAAAXX................',
    '..................XXAAAAAAAAAAXX................',
    '..................XXAAAAAAAAAAXX................',
    '..................XXAAAAAAAAAAXX................',
    '..................XXAAAAAAAAAAXX................',
    '..................XX......XX..XX................',
    '..................XX......XX..XX................',
    '..................XX......XX..XX................',
    '..................XX......XX..XX................',
    '..................XXXX....XX..XXXX..............',
    '..................XXXX....XX..XXXX..............',
  ],

  marineReptile: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............................XXXXXXXX............',
    '............................XXXXXXXX............',
    '......................XXXXXXAAAAAAAAAAXXXXXXXX..',
    '......................XXXXXXAAAAAAAAAAXXXXXXXX..',
    '..................XXXXAAAAAAAAAAAAAAEEEEEEAAXXXX',
    '..................XXXXAAAAAAAAAAAAAAEEEEEEAAXXXX',
    '..............XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..',
    '..............XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAXX..',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX....',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    'XXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '..XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX......',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '......XXXXAAAAAAAAAAAAAAAAAAAAAAAAAAAAXX........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..........XXXXAAAAAAAAAAAAAAAAAAAAAAXX..........',
    '..............XXXXAAAAAAAAAAAAAAAAXX............',
    '..............XXXXAAAAAAAAAAAAAAAAXX............',
    '..................XXXXAAAAAAAAXXXXXX............',
    '..................XXXXAAAAAAAAXXXXXX............',
    '......................XXXXXXXXXX................',
    '......................XXXXXXXXXX................',
  ],
}

// ------------------------------------------------------------
// 2) 종별 특징 오버레이
// ------------------------------------------------------------
export const overlaySprites = {
  sail: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............PP..PP..PP..PP......................',
    '............PP..PP..PP..PP......................',
    '..........PPPPPPPPPPPPPPPPPP....................',
    '..........PPPPPPPPPPPPPPPPPP....................',
    '........PPPPPPPPPPPPPPPPPP......................',
    '........PPPPPPPPPPPPPPPPPP......................',
    '........PPPPPPPPPPPPPPPP........................',
    '........PPPPPPPPPPPPPPPP........................',
    '..........PPPPPPPPPPPP..........................',
    '..........PPPPPPPPPPPP..........................',
    '............PPPPPPPP............................',
    '............PPPPPPPP............................',
  ],

  smallSail: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................PP..PP..........................',
    '................PP..PP..........................',
    '..............PPPPPPPPPP........................',
    '..............PPPPPPPPPP........................',
    '..............PPPPPPPP..........................',
    '..............PPPPPPPP..........................',
    '................PPPP............................',
    '................PPPP............................',
  ],

  paraCrest: [
    '............................CCCCCCCCCCCC........',
    '............................CCCCCCCCCCCC........',
    '..........................CCCCCCCCCCCC..........',
    '..........................CCCCCCCCCCCC..........',
    '........................CCCCCCCC................',
    '........................CCCCCCCC................',
    '......................CCCCCC....................',
    '......................CCCCCC....................',
  ],

  softCrest: [
    '........................CCCCCC..................',
    '........................CCCCCC..................',
    '......................CCCCCCCCCC................',
    '......................CCCCCCCCCC................',
  ],

  triceratopsHorns: [
    '................HH..........HH..................',
    '................HH..........HH..................',
    '..................HH......HH....................',
    '..................HH......HH....................',
    '......................HH........................',
    '......................HH........................',
  ],

  noseBoss: [
    '................................................',
    '................................................',
    '........................HHHH....................',
    '........................HHHH....................',
    '......................HHHHHHHH..................',
    '......................HHHHHHHH..................',
    '........................HHHH....................',
    '........................HHHH....................',
  ],

  smallFrill: [
    '....................PPPPPPPPPP..................',
    '....................PPPPPPPPPP..................',
    '..................PPPPPPPPPPPPPP................',
    '..................PPPPPPPPPPPPPP................',
    '..................PPPPPPPPPP....................',
    '..................PPPPPPPPPP....................',
  ],

  frill: [
    '..................PPPPPPPPPPPPPP................',
    '..................PPPPPPPPPPPPPP................',
    '................PPPPPPPPPPPPPPPPPP..............',
    '................PPPPPPPPPPPPPPPPPP..............',
    '................PPPPPPPPPPPPPPPP................',
    '................PPPPPPPPPPPPPPPP................',
    '..................PPPPPPPPPPPP..................',
    '..................PPPPPPPPPPPP..................',
  ],

  stegoPlates: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............PP....PP....PP....PP................',
    '............PP....PP....PP....PP................',
    '..........PPPPPP..PPPPPP..PPPPPP................',
    '..........PPPPPP..PPPPPP..PPPPPP................',
    '........PPPPPPPPPPPPPPPPPPPPPPPP................',
    '........PPPPPPPPPPPPPPPPPPPPPPPP................',
    '..........PPPP....PPPP....PPPP..................',
    '..........PPPP....PPPP....PPPP..................',
  ],

  tailSpikes: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '........................................HH..HH..',
    '........................................HH..HH..',
    '..........................................HH....',
    '..........................................HH....',
    '........................................HH..HH..',
    '........................................HH..HH..',
  ],

  armor: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................PP..PP..PP..PP..................',
    '................PP..PP..PP..PP..................',
    '............PP..PP..PP..PP..PP..PP..............',
    '............PP..PP..PP..PP..PP..PP..............',
    '..........PP..PP..PP..PP..PP..PP..PP............',
    '..........PP..PP..PP..PP..PP..PP..PP............',
    '............PP..PP..PP..PP..PP..................',
    '............PP..PP..PP..PP..PP..................',
  ],

  tailClub: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '........................................HHHH....',
    '........................................HHHH....',
    '......................................HHHHHHHH..',
    '......................................HHHHHHHH..',
    '........................................HHHH....',
    '........................................HHHH....',
  ],

  carnoHorns: [
    '....................HH....HH....................',
    '....................HH....HH....................',
    '......................HHHH......................',
    '......................HHHH......................',
  ],

  cryoCrest: [
    '......................CCCCCCCC..................',
    '......................CCCCCCCC..................',
    '....................CCCCCCCCCCCC................',
    '....................CCCCCCCCCCCC................',
    '......................CCCCCCCC..................',
    '......................CCCCCCCC..................',
  ],

  browRidge: [
    '................................................',
    '................................................',
    '........................DDDD....................',
    '........................DDDD....................',
    '......................DD....DD..................',
    '......................DD....DD..................',
  ],

  bigEye: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '........................WWWW....................',
    '........................WWWW....................',
    '........................EEEE....................',
    '........................EEEE....................',
  ],

  sickleClaw: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............................HH..................',
    '............................HH..................',
    '..........................HHHH..................',
    '..........................HHHH..................',
  ],

  oviCrest: [
    '....................CCCCCC......................',
    '....................CCCCCC......................',
    '..................CCCCCCCCCC....................',
    '..................CCCCCCCCCC....................',
    '....................CCCCCC......................',
    '....................CCCCCC......................',
  ],

  wingFeathers: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..........FFFFFFFF..........FFFFFFFF............',
    '..........FFFFFFFF..........FFFFFFFF............',
    '........FFFFFFFFFFFF......FFFFFFFFFFFF..........',
    '........FFFFFFFFFFFF......FFFFFFFFFFFF..........',
    '..........FFFFFFFF..........FFFFFFFF............',
    '..........FFFFFFFF..........FFFFFFFF............',
  ],

  tailFan: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..FFFFFFFF......................................',
    '..FFFFFFFF......................................',
    'FFFFFFFFFF......................................',
    'FFFFFFFFFF......................................',
  ],

  thumbSpike: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..........................HH....................',
    '..........................HH....................',
    '........................HHHH....................',
    '........................HHHH....................',
  ],

  longClaws: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............................HHHHHH..............',
    '............................HHHHHH..............',
    '..........................HHHHHHHH..............',
    '..........................HHHHHHHH..............',
    '............................HHHHHH..............',
    '............................HHHHHH..............',
  ],

  pteraCrest: [
    '..............................CCCCCCCC..........',
    '..............................CCCCCCCC..........',
    '............................CCCCCCCCCCCC........',
    '............................CCCCCCCCCCCC........',
    '..............................CCCCCC............',
    '..............................CCCCCC............',
  ],

  quetzCrest: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..........................CCCCCCCCCC............',
    '..........................CCCCCCCCCC............',
    '........................CCCCCCCCCCCCCC..........',
    '........................CCCCCCCCCCCCCC..........',
    '..........................CCCCCCCC..............',
    '..........................CCCCCCCC..............',
  ],

  flippers: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '............FFFFFFFF............FFFFFFFF........',
    '............FFFFFFFF............FFFFFFFF........',
    '..........FFFFFFFFFFFF........FFFFFFFFFFFF......',
    '..........FFFFFFFFFFFF........FFFFFFFFFFFF......',
    '............FFFFFFFF............FFFFFFFF........',
    '............FFFFFFFF............FFFFFFFF........',
  ],

  seaTail: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..FFFF..........................................',
    '..FFFF..........................................',
    'FFFFFFFF........................................',
    'FFFFFFFF........................................',
    '..FFFF..........................................',
    '..FFFF..........................................',
  ],

  brachioShoulder: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..............DDDDDD............................',
    '..............DDDDDD............................',
    '............DDDDDDDDDD..........................',
    '............DDDDDDDDDD..........................',
  ],

  massiveBody: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '........DDDDDDDDDDDDDDDD........................',
    '........DDDDDDDDDDDDDDDD........................',
    '......DDDDDDDDDDDDDDDDDDDD......................',
    '......DDDDDDDDDDDDDDDDDDDD......................',
  ],

  whipTail: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '........................................DDDDDDDD',
    '........................................DDDDDDDD',
    '..............................................DD',
    '..............................................DD',
  ],

  thickNeck: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..................DDDDDDDDDD....................',
    '..................DDDDDDDDDD....................',
    '................DDDDDDDDDDDDDD..................',
    '................DDDDDDDDDDDDDD..................',
  ],

  featherRuff: [
    '................................................',
    '................................................',
    '..................FFFFFFFFFF....................',
    '..................FFFFFFFFFF....................',
    '................FFFFFFFFFFFFFF..................',
    '................FFFFFFFFFFFFFF..................',
    '..................FFFFFFFFFF....................',
    '..................FFFFFFFFFF....................',
  ],

  thickNeckTall: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '..................DDDDDDDDDD....................',
    '..................DDDDDDDDDD....................',
    '................DDDDDDDDDDDDDD..................',
    '................DDDDDDDDDDDDDD..................',
  ],
}

// ------------------------------------------------------------
// 3) dinos.json id -> 픽셀 프로필
// ------------------------------------------------------------
export const dinoSpriteMap = {
  spinosaurus: {
    base: 'longSnoutTheropod',
    overlays: ['sail'],
    accessoryOffset: { x: 0, y: 0 },
  },
  baryonyx: {
    base: 'longSnoutTheropod',
    overlays: [],
    accessoryOffset: { x: 0, y: 0 },
  },
  suchomimus: {
    base: 'longSnoutTheropod',
    overlays: ['smallSail'],
    accessoryOffset: { x: 0, y: 0 },
  },
  parasaurolophus: {
    base: 'hadrosaur',
    overlays: ['paraCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  tyrannosaurus: {
    base: 'largeTheropod',
    overlays: [],
    accessoryOffset: { x: 0, y: 0 },
  },
  triceratops: {
    base: 'ceratopsian',
    overlays: ['frill', 'triceratopsHorns'],
    accessoryOffset: { x: -2, y: 0 },
  },
  stegosaurus: {
    base: 'stegosaur',
    overlays: ['stegoPlates', 'tailSpikes'],
    accessoryOffset: { x: -2, y: 0 },
  },
  allosaurus: {
    base: 'largeTheropod',
    overlays: ['browRidge'],
    accessoryOffset: { x: 0, y: 0 },
  },
  brachiosaurus: {
    base: 'sauropodTall',
    overlays: ['brachioShoulder'],
    accessoryOffset: { x: -2, y: 0 },
  },
  argentinosaurus: {
    base: 'sauropodHeavy',
    overlays: ['massiveBody'],
    accessoryOffset: { x: -4, y: 0 },
  },
  giganotosaurus: {
    base: 'largeTheropod',
    overlays: ['thickNeck'],
    accessoryOffset: { x: 0, y: 0 },
  },
  carnotaurus: {
    base: 'largeTheropod',
    overlays: ['carnoHorns'],
    accessoryOffset: { x: 0, y: 0 },
  },
  yutyrannus: {
    base: 'featheredTheropod',
    overlays: ['featherRuff'],
    accessoryOffset: { x: -2, y: 0 },
  },
  cryolophosaurus: {
    base: 'largeTheropod',
    overlays: ['cryoCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  nanuqsaurus: {
    base: 'featheredTheropod',
    overlays: ['thickNeck'],
    accessoryOffset: { x: -2, y: 0 },
  },
  pachyrhinosaurus: {
    base: 'ceratopsian',
    overlays: ['frill', 'noseBoss'],
    accessoryOffset: { x: -2, y: 0 },
  },
  troodon: {
    base: 'smallRaptor',
    overlays: ['bigEye'],
    accessoryOffset: { x: -4, y: 0 },
  },
  velociraptor: {
    base: 'smallRaptor',
    overlays: ['sickleClaw', 'featherRuff'],
    accessoryOffset: { x: -4, y: 0 },
  },
  protoceratops: {
    base: 'smallCeratopsian',
    overlays: ['smallFrill'],
    accessoryOffset: { x: -4, y: 0 },
  },
  oviraptor: {
    base: 'smallRaptor',
    overlays: ['oviCrest'],
    accessoryOffset: { x: -4, y: 0 },
  },
  microraptor: {
    base: 'smallRaptor',
    overlays: ['wingFeathers', 'tailFan'],
    accessoryOffset: { x: -4, y: 0 },
  },
  ankylosaurus: {
    base: 'ankylosaur',
    overlays: ['armor', 'tailClub'],
    accessoryOffset: { x: -2, y: 0 },
  },
  iguanodon: {
    base: 'iguanodont',
    overlays: ['thumbSpike'],
    accessoryOffset: { x: -2, y: 0 },
  },
  maiasaura: {
    base: 'hadrosaur',
    overlays: ['softCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  diplodocus: {
    base: 'sauropodLongTail',
    overlays: ['whipTail'],
    accessoryOffset: { x: -2, y: 0 },
  },
  apatosaurus: {
    base: 'sauropodHeavy',
    overlays: ['thickNeckTall'],
    accessoryOffset: { x: -4, y: 0 },
  },
  therizinosaurus: {
    base: 'therizino',
    overlays: ['longClaws', 'featherRuff'],
    accessoryOffset: { x: -6, y: 2 },
  },
  pteranodon: {
    base: 'pterosaur',
    overlays: ['pteraCrest'],
    accessoryOffset: { x: 2, y: 0 },
  },
  quetzalcoatlus: {
    base: 'pterosaurTall',
    overlays: ['quetzCrest'],
    accessoryOffset: { x: -6, y: 0 },
  },
  mosasaurus: {
    base: 'marineReptile',
    overlays: ['flippers', 'seaTail'],
    accessoryOffset: { x: 4, y: 2 },
  },
}

// ------------------------------------------------------------
// 4) 날씨 액세서리/이펙트 레이어
//    기본 위치는 수각류 머리 기준. profile.accessoryOffset으로 보정.
// ------------------------------------------------------------
export const accessorySprites = {
  sunglasses: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '.................................SSSSSS.........',
    '............................SSSSSWWWSSSS........',
    '............................SSSSSSSSSSSS........',
    '................................SSSSSSSS........',
    '.................................SSSSSS.........',
  ],

  mask: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '.......................MMMMMMMMM..MMMMMMM.......',
    '.....................MMMMMMMMMMMMMMMMMMMM.......',
    '.....................MMMMMMMMMMMMM..............',
    '.....................MXXXXXXXXXXXM..............',
    '.......................MMMMMMMMMM...............',
    '.........................MMMMMM.................',
  ],

  winterHat: [
    '..............................WWWWW.............',
    '............................NNNNNNNNN...........',
    '..........................NNNNNNNNNNNNN.........',
    '.........................NNNNNNNNNNNNNNN........',
    '.......................WWWWWWWWWWWWWWWWWW.......',
    '.......................WWWWWWWWWWWWWWWWWW.......',
  ],

  scarf: [
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '...........................RRRRRRRRR............',
    '..........................RRRRRRRRRRR...........',
    '..........................RRRRRRRRRRR...........',
    '...........................RRRRRRRRR............',
    '............................RRRRR...............',
    '............................RRRRR...............',
    '............................RRRRR...............',
    '............................RR.RR...............',
  ],

  sweat: [
    '................................................',
    '................................................',
    '...........................................QQ...',
    '..........................................QQQQ..',
    '..........................................QQQQ..',
    '..........................................QQQQ..',
    '...........................................QQ...',
    '................................................',
    '................................................',
    '............................................Q...',
    '...........................................QQQ..',
    '............................................Q...',
  ],

  umbrella: [
    '........................UUUUUUUUU...............',
    '....................UUUUUUUUUUUUUUUUU...........',
    '................UVUUUUUVUUUUUVUUUUUVUUUUUV......',
    '.............UUUUVUUUUUVUUUUUVUUUUUVUUUUUVUU....',
    '...........VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV..',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '..........................................VV....',
    '.......................................VVVVV....',
    '.......................................VVVVV....',
  ],

  rainDrops: [
    '...................Q............................',
    '...Q...............Q............................',
    '...Q...............Q.........Q..................',
    '...Q.........................Q.....Q............',
    '.............................Q.....Q............',
    '...........Q.......................Q............',
    '...........Q....................................',
    '...........Q................................Q...',
    '............................................Q...',
    '...........................Q................Q...',
    '..................Q........Q....................',
    '..................Q........Q....................',
    '..................Q..................Q..........',
    '.....................................Q..........',
    '.......Q.............................Q..........',
    '.......Q........................................',
    '.......Q.....................................Q..',
    '...............................Q.............Q..',
    '...............................Q.............Q..',
    '...............................Q................',
    '...............Q................................',
    '...............Q................................',
    '......Q........Q................................',
    '......Q................................Q........',
    '......Q................................Q........',
    '.......................................Q.......Q',
    '.......................Q.......................Q',
    '.......................Q.......................Q',
    '.............Q.........Q........................',
    '..Q..........Q..................................',
    '..Q..........Q....................Q.............',
    '..Q...............................Q.............',
    '..................................Q.............',
    '..........Q.....................................',
    '..........Q................................Q....',
    '..........Q................................Q....',
    '.....Q....................Q................Q....',
    '.....Q....................Q.....................',
    '.....Q...............Q....Q.....................',
    '.....................Q..........................',
  ],

  snow: [
    '......................I.........................',
    '....I................III........................',
    '...III................III.......................',
    '....III................I................I.......',
    '.....I.................................III......',
    '.............................I..........III.....',
    '.............I..............III..........I......',
    '............III..............III................',
    '.............III..............I.................',
    '......I.......I.................................',
    '.....III.......................I................',
    '......III.....................III...............',
    '.......I............I..........III..............',
    '...................III..........I...............',
    '....................III.......................I.',
    '.....................I.......................III',
    '........I.....................................II',
    '.......III.....................................I',
    '........III.....................................',
    '.........I.........................I............',
    '..................................III...........',
    '...................................III..........',
    '....................................I...........',
    '.................I..............................',
    '................III.............................',
    '.................III............................',
    '..................I.........................I...',
    '...........................................III..',
    '...........I................................III.',
    '..........III.............I..................I..',
    '...........III...........III..............I.....',
    '............I.............III............III....',
    '...........................I..............III...',
    '..I........................................I....',
    '.III..................................I.........',
    '..III................................III........',
    '...I....................I.............III.......',
    '.......................III.............I........',
    '........................III.....................',
    '.........................I......................',
  ],

  sparkle: [
    '....YY..........................................',
    '....YY..........................................',
    '..YYYYYYY.......................................',
    '..YYYYYYY.......................................',
    '....YY..........................................',
    '....YY..........................................',
    '....YY..........................................',
    '............................................YY..',
    '............................................YY..',
    '..........................................YYYYYY',
    '..........................................YYYYYY',
    '............................................YY..',
    '............................................YY..',
    '............................................YY..',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '.......YY.......................................',
    '......YYYYY.....................................',
    '......YYYYY.....................................',
    '.......YY.......................................',
    '.......YY.......................................',
    '................................................',
    '........................................YY......',
    '.......................................YYYYY....',
    '.......................................YYYYY....',
    '........................................YY......',
    '........................................YY......',
  ],

  zzz: [
    '................................................',
    'ZZZZZZ..........................................',
    '....ZZ..........................................',
    '...ZZ...........................................',
    '..ZZ............................................',
    '.ZZ.............................................',
    'ZZZZZZ..........................................',
    '.......ZZZZZ....................................',
    '..........ZZ....................................',
    '.........ZZ.....................................',
    '........ZZ......................................',
    '.......ZZZZZ....................................',
    '.............ZZZZ...............................',
    '...............ZZ...............................',
    '..............ZZ................................',
    '.............ZZZZ...............................',
  ],
}

function groupFromWmo(code) {
  if ([0, 1].includes(code)) return 'clear'
  if ([2, 3].includes(code)) return 'cloudy'
  if ([45, 48].includes(code)) return 'fog'
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle'
  if ([61, 63, 65, 66, 67].includes(code)) return 'rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([80, 81, 82].includes(code)) return 'shower'
  if ([95, 96, 99].includes(code)) return 'thunder'
  return 'cloudy'
}

export function getWeatherAccessoryKeys(weather = {}) {
  const { weatherCode = 0, temp = 20, wind = 0, isNight = false, airQuality = 'good' } = weather

  const group = groupFromWmo(weatherCode)

  // 뒤에 넣은 것이 위에 그려진다.
  // 빗줄기/눈은 배경이라 우산·모자보다 먼저 깔아야 가려진다.
  const background = []
  const worn = []

  if (airQuality === 'bad' || airQuality === 'veryBad') {
    worn.push('mask')
  }

  if (group === 'rain' || group === 'drizzle' || group === 'shower' || group === 'thunder') {
    background.push('rainDrops')
    worn.push('umbrella')
  } else if (group === 'snow') {
    background.push('snow')
    worn.push('winterHat', 'scarf')
  } else if (group === 'clear') {
    background.push('sparkle')
    // 선글라스는 낮에만
    if (temp >= 27 && !isNight) worn.push('sunglasses')
  }

  if (temp >= 32) worn.push('sweat')
  if (wind >= 25 && !worn.includes('scarf')) worn.push('scarf')

  // 밤에는 졸음 표시를 제일 위에
  return [...new Set([...background, ...worn, ...(isNight ? ['zzz'] : [])])]
}

// 공룡 뒤에 깔리는 날씨 효과 (위치 보정 없이 화면 전체에 그린다)
const BACKGROUND_ACCESSORIES = ['rainDrops', 'snow', 'sparkle']

// 최종 공룡 그리드 생성
export function getDinoGrid(dino, weather = null) {
  if (!dino?.id) return applyDetail(normalizeGrid(baseSprites.largeTheropod))

  const profile = dinoSpriteMap[dino.id] ?? dinoSpriteMap.tyrannosaurus
  const bodyLayers = [baseSprites[profile.base]]

  for (const overlayKey of profile.overlays ?? []) {
    bodyLayers.push(overlaySprites[overlayKey])
  }

  // 명암은 공룡 몸통에만 적용한다.
  // 액세서리까지 합친 뒤에 넣으면 우산 손잡이 같은 게 몸을 가르면서
  // 그 경계마다 엉뚱한 하이라이트가 생긴다.
  const body = applyDetail(mergeLayers(bodyLayers))
  if (!weather) return body

  const { x = 0, y = 0 } = profile.accessoryOffset ?? {}
  const behind = []
  const front = []

  for (const key of getWeatherAccessoryKeys(weather)) {
    const layer = accessorySprites[key]
    if (!layer) continue

    // 날씨 효과는 화면 전체 기준이라 위치 보정이 필요 없고,
    // 공룡 뒤에 깔아야 몸통에 구멍처럼 찍히지 않는다.
    if (BACKGROUND_ACCESSORIES.includes(key)) behind.push(layer)
    else if (key === 'zzz') front.push(layer)
    else front.push(offsetLayer(layer, x, y))
  }

  return mergeLayers([...behind, body, ...front])
}

// 렌더링 편의를 위해 픽셀 객체 배열로 변환
export function gridToPixels(grid, palette) {
  const normalized = normalizeGrid(grid)
  const pixels = []

  normalized.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      if (ch === '.') return
      pixels.push({
        key: `${x}-${y}`,
        x,
        y,
        color: palette[ch] ?? '#FF00FF',
      })
    })
  })

  return pixels
}
