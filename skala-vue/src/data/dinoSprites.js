// src/data/dinoSprites.js
// SVG 픽셀 마스코트용 데이터/조합 함수
// '.' = 투명, X = 외곽선, A = dinos.json accent 색, B = 밝은 배색,
// D = 어두운 몸색, E = 눈, W = 흰색/이빨, H = 뿔/뼈,
// P = 골판/장식, F = 깃털, C = 볏/특수부위

export const GRID_W = 24
export const GRID_H = 20

function normalizeGrid(grid) {
  return Array.from({ length: GRID_H }, (_, y) =>
    (grid[y] ?? '').padEnd(GRID_W, '.').slice(0, GRID_W)
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
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
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
    B: mix(accent, '#FFFFFF', 0.55),
    D: mix(accent, '#000000', 0.28),
    E: '#111111',
    W: '#FFFFFF',
    H: '#E9DDBE',
    P: mix(accent, '#D88378', 0.45),
    F: mix(accent, '#EEF4FF', 0.28),
    C: mix(accent, '#FFD36B', 0.25),

    // weather/accessory colors
    S: '#15191F',       // sunglasses
    U: '#4169E1',       // umbrella
    R: '#D64C4C',       // scarf
    N: '#D54A43',       // winter hat
    M: '#EAF3F7',       // mask
    Q: '#90CAF9',       // raindrop
    I: '#D6F2FF',       // snow/ice
    Y: '#FFD54F',       // sun/sparkle
    Z: '#6F7BC5',       // zzz
  }
}

// ------------------------------------------------------------
// 1) 체형 베이스
// ------------------------------------------------------------
export const baseSprites = {
  largeTheropod: [
    '........................',
    '............XXXX........',
    '..........XXAAAAXXXX.....',
    '.........XAAAAAAAEEX.....',
    '.........XAAAAAAAAAX.....',
    '..........XAAWWAAAX......',
    '.......XXXXAAAAAAX........',
    '.....XXAAAAAAAAAX.........',
    '...XXAAAAAAAAAAAAX........',
    '..XAAAAAAAAAAAAAAX........',
    '.XAAAAAAAAAAAAAAAX........',
    'XAAAAAAAAXAAAAAAX.........',
    'XXAAAAAAX.XAAAAX..........',
    '..XXXXXX..XAAAX...........',
    '..........XAAAX...........',
    '.........XX..XX...........',
    '........X.....X...........',
    '........XX....XX..........',
    '........................',
    '........................',
  ],

  longSnoutTheropod: [
    '........................',
    '.............XXXXXXX....',
    '..........XXXAAAAAAAX...',
    '.........XAAAAAAAEEAAX...',
    '.........XAAAAAAAAAAX....',
    '..........XAAWWWAAAX.....',
    '.......XXXXAAAAAAX........',
    '.....XXAAAAAAAAAX.........',
    '...XXAAAAAAAAAAAAX........',
    '..XAAAAAAAAAAAAAAX........',
    '.XAAAAAAAAAAAAAAAX........',
    'XAAAAAAAAXAAAAAAX.........',
    'XXAAAAAAX.XAAAAX..........',
    '..XXXXXX..XAAAX...........',
    '..........XAAAX...........',
    '.........XX..XX...........',
    '........X.....X...........',
    '........XX....XX..........',
    '........................',
    '........................',
  ],

  featheredTheropod: [
    '........................',
    '...........FXXXXF........',
    '.........FFXAAAAXXX......',
    '........FXAAAAAAEEX......',
    '........XAAAAAAAAAX......',
    '.........XAAWWAAAX.......',
    '......FFXXAAAAAAXF........',
    '....FFXAAAAAAAAAXF........',
    '..FFXAAAAAAAAAAAAX........',
    '.XAAAAAAAAAAAAAAAX........',
    'XAAAAAAAAAAAAAAAAX........',
    'XXAAAAAAFXAAAAAAXF........',
    '..XXXXXXF.XAAAAXF.........',
    '.........FXAAAXF..........',
    '.........FXAAAXF..........',
    '........FFX..XXF..........',
    '.......FF.....XF..........',
    '........XX....XX..........',
    '........................',
    '........................',
  ],

  smallRaptor: [
    '........................',
    '............XXX.........',
    '..........XXAAAXXX......',
    '.........XAAAAAEEAX......',
    '..........XAAAAAAX.......',
    '...........XAWAAAX.......',
    '........XXXAAAAAX.........',
    '......XXAAAAAAAAX.........',
    '....XXAAAAAAAAAX..........',
    '..XXAAAAAAAAAAAX..........',
    '.XAAAAAAAAAAAAAX..........',
    'XXAAAAAAXAAAAAX...........',
    '..XXXXXXX.XAAAX...........',
    '..........XAAAX...........',
    '.........XX..XX...........',
    '........X.....X...........',
    '........XX....XX..........',
    '........................',
    '........................',
    '........................',
  ],

  hadrosaur: [
    '........................',
    '.............XXXX.......',
    '...........XXAAAAXXX....',
    '..........XAAAAAAEEX....',
    '..........XAAAAAAAAAX...',
    '...........XAAAAAAAX....',
    '.......XXXXXAAAAAAX.....',
    '.....XXAAAAAAAAAAX......',
    '...XXAAAAAAAAAAAAAX.....',
    '..XAAAAAAAAAAAAAAAAX....',
    '.XAAAAAAAAAAAAAAAAAX....',
    'XXAAAAAAAAAAAAAAAAX.....',
    '..XXXXXXAAAAAAAAX.......',
    '........XAAAAAAAX.......',
    '.......XXAAX.XAAAX......',
    '......XAAAX..XAAAX......',
    '......XX.X....X.XX.......',
    '........................',
    '........................',
    '........................',
  ],

  ceratopsian: [
    '........................',
    '...........XXXXXX.......',
    '.........XXAAAAAAAX.....',
    '........XAAAAAAAEEAX....',
    '.......XAAAAAAAAAAAX....',
    '........XAAAAAAAAAX.....',
    '.....XXXXAAAAAAAAAX.....',
    '...XXAAAAAAAAAAAAAX.....',
    '..XAAAAAAAAAAAAAAAAX....',
    '.XAAAAAAAAAAAAAAAAAX....',
    'XAAAAAAAAAAAAAAAAAAX....',
    'XXAAAAAAAAAAAAAAAAX.....',
    '..XXXXXXAAAAAAAAX.......',
    '.......XAAAAAAAAX.......',
    '......XAAAX.XAAAX.......',
    '......XAAAX.XAAAX.......',
    '......XX.X...X.XX........',
    '........................',
    '........................',
    '........................',
  ],

  smallCeratopsian: [
    '........................',
    '............XXXXX.......',
    '..........XXAAAAAX......',
    '.........XAAAAAEEAX......',
    '.........XAAAAAAAAAX.....',
    '..........XAAAAAAAX......',
    '......XXXXXAAAAAAX.......',
    '....XXAAAAAAAAAAX........',
    '..XXAAAAAAAAAAAAX........',
    '.XAAAAAAAAAAAAAAAX.......',
    'XXAAAAAAAAAAAAAAAX.......',
    '..XXXXXXAAAAAAAX.........',
    '.......XAAAAAAAX.........',
    '......XAAAX.XAAAX........',
    '......XX.X...X.XX.........',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],

  stegosaur: [
    '........................',
    '........................',
    '.............XXX........',
    '..........XXXXAAX.......',
    '.......XXXAAAAAAAX......',
    '.....XXAAAAAAAAAAAX.....',
    '...XXAAAAAAAAAAAAAAX....',
    '..XAAAAAAAAAAAAAAAAX....',
    '.XAAAAAAAAAAAAAAAAAX....',
    'XAAAAAAAAAAAAAAAAAAX....',
    'XXAAAAAAAAAAAAAAAAX.....',
    '..XXXXXAAAAAAAAAAX......',
    '......XAAAAAAAAAX.......',
    '.....XAAAX...XAAAX......',
    '.....XAAAX...XAAAX......',
    '.....XX.X.....X.XX.......',
    '........................',
    '........................',
    '........................',
    '........................',
  ],

  ankylosaur: [
    '........................',
    '........................',
    '..........XXXXXXX.......',
    '.......XXXAAAAAAAX......',
    '.....XXAAAAAAAAAAAX.....',
    '...XXAAAAAAAAAAAAAAX....',
    '..XAAAAAAAAAAAAAAAAX....',
    '.XAAAAAAAAAAAAAAAAAX....',
    'XAAAAAAAAAAAAAAAAAAX....',
    'XXAAAAAAAAAAAAAAAAX.....',
    '..XXXXAAAAAAAAAAAAX.....',
    '.....XAAAAAAAAAAX.......',
    '.....XAAAAAAAAAX........',
    '....XAAAX...XAAAX.......',
    '....XAAAX...XAAAX.......',
    '....XX.X.....X.XX........',
    '........................',
    '........................',
    '........................',
    '........................',
  ],

  sauropodTall: [
    '...............XXX......',
    '..............XAEEX.....',
    '..............XAAAX.....',
    '.............XAAAAX.....',
    '............XAAAAAX.....',
    '...........XAAAAAAX.....',
    '..........XAAAAAAAX.....',
    '......XXXXXAAAAAAAAX....',
    '....XXAAAAAAAAAAAAAAX...',
    '..XXAAAAAAAAAAAAAAAAX...',
    '.XAAAAAAAAAAAAAAAAAAX...',
    'XAAAAAAAAAAAAAAAAAAAX...',
    'XXAAAAAAAAAAAAAAAAAX....',
    '..XXXXXXAAAAAAAAAAX.....',
    '.......XAAAAX.XAAAAX....',
    '.......XAAAAX.XAAAAX....',
    '.......X...X...X...X....',
    '.......XX..XX..XX..XX...',
    '........................',
    '........................',
  ],

  sauropodHeavy: [
    '..............XXX.......',
    '.............XAEEX......',
    '.............XAAAX......',
    '............XAAAAX......',
    '...........XAAAAAX......',
    '..........XAAAAAAX......',
    '.......XXXXAAAAAAAX.....',
    '.....XXAAAAAAAAAAAAX....',
    '...XXAAAAAAAAAAAAAAAAX..',
    '..XAAAAAAAAAAAAAAAAAAX..',
    '.XAAAAAAAAAAAAAAAAAAAX..',
    'XAAAAAAAAAAAAAAAAAAAAX..',
    'XXAAAAAAAAAAAAAAAAAAX...',
    '..XXXXXAAAAAAAAAAAAX....',
    '......XAAAAX..XAAAAX....',
    '......XAAAAX..XAAAAX....',
    '......X...X....X...X....',
    '......XX..XX...XX..XX...',
    '........................',
    '........................',
  ],

  sauropodLongTail: [
    '...............XXX......',
    '..............XAEEX.....',
    '..............XAAAX.....',
    '.............XAAAAX.....',
    '............XAAAAAX.....',
    '...........XAAAAAAX.....',
    '.......XXXXXAAAAAAAX.....',
    '.....XXAAAAAAAAAAAAX.....',
    '...XXAAAAAAAAAAAAAAAX....',
    '..XAAAAAAAAAAAAAAAAAX....',
    '.XAAAAAAAAAAAAAAAAAAX....',
    'XAAAAAAAAAAAAAAAAAAAXXXX.',
    'XXAAAAAAAAAAAAAAAAAX...XX',
    '..XXXXXXAAAAAAAAAAX......',
    '.......XAAAAX.XAAAAX.....',
    '.......XAAAAX.XAAAAX.....',
    '.......X...X...X...X.....',
    '.......XX..XX..XX..XX....',
    '........................',
    '........................',
  ],

  iguanodont: [
    '........................',
    '............XXXX........',
    '..........XXAAAAXXX.....',
    '.........XAAAAAAEEX.....',
    '.........XAAAAAAAAAX.....',
    '..........XAAAAAAAX......',
    '.......XXXXAAAAAAX.......',
    '.....XXAAAAAAAAAX........',
    '...XXAAAAAAAAAAAAX.......',
    '..XAAAAAAAAAAAAAAX.......',
    '.XAAAAAAAAAAAAAAAAX......',
    'XXAAAAAAAAAAAAAAAX.......',
    '..XXXXXXAAAAAAAAX........',
    '........XAAAAAAAX........',
    '.......XAAAX.XAAAX.......',
    '.......XAAAX.XAAAX.......',
    '.......XX.X...X.XX........',
    '........................',
    '........................',
    '........................',
  ],

  therizino: [
    '........................',
    '............FFF.........',
    '..........FFXXXFF.......',
    '.........FXAAAAXFF......',
    '.........XAAAAEEX.......',
    '..........XAAAAAX........',
    '.......FFXXAAAAAXFF......',
    '......FXAAAAAAAAAXFF.....',
    '.....XAAAAAAAAAAAAAX.....',
    '....XAAAAAAAAAAAAAAX.....',
    '...XAAAAAAAAAAAAAAAX.....',
    '..XXAAAAAAAAXAAAAAAX.....',
    '....XXXXXXX.XAAAAAX......',
    '............XAAAAX.......',
    '..........XXX...XXX......',
    '.........X.........X.....',
    '.........XX........XX....',
    '........................',
    '........................',
    '........................',
  ],

  pterosaur: [
    '........................',
    '.............XXXXX......',
    '...........XXAAAAAXXX...',
    '..........XAAAAAAAEEX...',
    '.....XXXXXXAAAAAAAAAX...',
    '..XXXAAAAAAAAAAAAAAX....',
    'XXAAAAAAAAAAAAAAAAAX....',
    '.XXXAAAAAAAAAAAAAAAX....',
    '....XXXAAAAAAAAAAAX.....',
    '.......XXAAAAAAAAX......',
    '.........XAAAAAAX.......',
    '..........XAAAAX........',
    '...........XAAAX........',
    '...........XAAAX........',
    '..........XX..XX........',
    '.........X.....X.........',
    '.........XX....XX........',
    '........................',
    '........................',
    '........................',
  ],

  pterosaurTall: [
    '.............XXXX.......',
    '............XAEEX.......',
    '...........XAAAAXXXX.....',
    '..........XAAAAAAAAAX....',
    '....XXXXXXAAAAAAAAAX.....',
    '..XXAAAAAAAAAAAAAAAX.....',
    'XXAAAAAAAAAAAAAAAAAX.....',
    '.XXAAAAAAAAAAAAAAAAX.....',
    '...XXAAAAAAAAAAAAAX......',
    '......XAAAAAAAAAAX.......',
    '.......XAAAAAAAAX........',
    '........XAAAAAAX.........',
    '.........XAAAAAX.........',
    '.........XAAAAAX.........',
    '.........X...X.X.........',
    '.........X...X.X.........',
    '.........XX..X.XX........',
    '........................',
    '........................',
    '........................',
  ],

  marineReptile: [
    '........................',
    '........................',
    '..............XXXX......',
    '...........XXXAAAAAXXXX.',
    '.........XXAAAAAAAEEEAXX',
    '.......XXAAAAAAAAAAAAAX.',
    '.....XXAAAAAAAAAAAAAAX..',
    '...XXAAAAAAAAAAAAAAAAX..',
    '.XXAAAAAAAAAAAAAAAAAX...',
    'XAAAAAAAAAAAAAAAAAAAX...',
    '.XXAAAAAAAAAAAAAAAAAX...',
    '...XXAAAAAAAAAAAAAAX....',
    '.....XXAAAAAAAAAAAX.....',
    '.......XXAAAAAAAAX......',
    '.........XXAAAAXXX......',
    '...........XXXXX.........',
    '........................',
    '........................',
    '........................',
    '........................',
  ],
}

// ------------------------------------------------------------
// 2) 종별 특징 오버레이
// ------------------------------------------------------------
export const overlaySprites = {
  sail: [
    '........................',
    '........................',
    '......P.P.P.P...........',
    '.....PPPPPPPPP..........',
    '....PPPPPPPPP...........',
    '....PPPPPPPP............',
    '.....PPPPPP.............',
    '......PPPP..............',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
  ],

  smallSail: [
    '........................',
    '........................',
    '........P.P.............',
    '.......PPPPP............',
    '.......PPPP.............',
    '........PP..............',
    '........................',
  ],

  paraCrest: [
    '..............CCCCCC....',
    '.............CCCCCC.....',
    '............CCCC........',
    '...........CCC..........',
  ],

  softCrest: [
    '............CCC.........',
    '...........CCCCC........',
  ],

  triceratopsHorns: [
    '........H.....H.........',
    '.........H...H..........',
    '...........H............',
  ],

  noseBoss: [
    '........................',
    '............HH..........',
    '...........HHHH.........',
    '............HH..........',
  ],

  smallFrill: [
    '..........PPPPP.........',
    '.........PPPPPPP........',
    '.........PPPPP..........',
  ],

  frill: [
    '.........PPPPPPP........',
    '........PPPPPPPPP.......',
    '........PPPPPPPP........',
    '.........PPPPPP.........',
  ],

  stegoPlates: [
    '........................',
    '........................',
    '......P..P..P..P........',
    '.....PPP.PPP.PPP........',
    '....PPPPPPPPPPPP........',
    '.....PP..PP..PP.........',
  ],

  tailSpikes: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '....................H.H.',
    '.....................H..',
    '....................H.H.',
  ],

  armor: [
    '........................',
    '........................',
    '........P.P.P.P.........',
    '......P.P.P.P.P.P.......',
    '.....P.P.P.P.P.P.P......',
    '......P.P.P.P.P.........',
  ],

  tailClub: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '....................HH..',
    '...................HHHH.',
    '....................HH..',
  ],

  carnoHorns: [
    '..........H..H..........',
    '...........HH...........',
  ],

  cryoCrest: [
    '...........CCCC.........',
    '..........CCCCCC........',
    '...........CCCC.........',
  ],

  browRidge: [
    '........................',
    '............DD..........',
    '...........D..D.........',
  ],

  bigEye: [
    '........................',
    '........................',
    '............WW..........',
    '............EE..........',
  ],

  sickleClaw: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '..............H.........',
    '.............HH.........',
  ],

  oviCrest: [
    '..........CCC...........',
    '.........CCCCC..........',
    '..........CCC...........',
  ],

  wingFeathers: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.....FFFF.....FFFF......',
    '....FFFFFF...FFFFFF.....',
    '.....FFFF.....FFFF......',
  ],

  tailFan: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.FFFF...................',
    'FFFFF...................',
  ],

  thumbSpike: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.............H..........',
    '............HH..........',
  ],

  longClaws: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '..............HHH.......',
    '.............HHHH.......',
    '..............HHH.......',
  ],

  pteraCrest: [
    '...............CCCC.....',
    '..............CCCCCC....',
    '...............CCC......',
  ],

  quetzCrest: [
    '.............CCCCC......',
    '............CCCCCCC.....',
    '.............CCCC.......',
  ],

  flippers: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '......FFFF......FFFF....',
    '.....FFFFFF....FFFFFF...',
    '......FFFF......FFFF....',
  ],

  seaTail: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.FF.....................',
    'FFFF....................',
    '.FF.....................',
  ],

  brachioShoulder: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '.......DDD..............',
    '......DDDDD.............',
  ],

  massiveBody: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '....DDDDDDDD............',
    '...DDDDDDDDDD...........',
  ],

  whipTail: [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '....................DDDD',
    '.......................D',
  ],

  thickNeck: [
    '........................',
    '........................',
    '........................',
    '........................',
    '.........DDDDD..........',
    '........DDDDDDD.........',
  ],

  featherRuff: [
    '........................',
    '.........FFFFF..........',
    '........FFFFFFF.........',
    '.........FFFFF..........',
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
    accessoryOffset: { x: -1, y: 0 },
  },
  stegosaurus: {
    base: 'stegosaur',
    overlays: ['stegoPlates', 'tailSpikes'],
    accessoryOffset: { x: -1, y: 1 },
  },
  allosaurus: {
    base: 'largeTheropod',
    overlays: ['browRidge'],
    accessoryOffset: { x: 0, y: 0 },
  },
  brachiosaurus: {
    base: 'sauropodTall',
    overlays: ['brachioShoulder'],
    accessoryOffset: { x: 2, y: -1 },
  },
  argentinosaurus: {
    base: 'sauropodHeavy',
    overlays: ['massiveBody'],
    accessoryOffset: { x: 2, y: -1 },
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
    accessoryOffset: { x: 0, y: 0 },
  },
  cryolophosaurus: {
    base: 'largeTheropod',
    overlays: ['cryoCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  nanuqsaurus: {
    base: 'featheredTheropod',
    overlays: ['thickNeck'],
    accessoryOffset: { x: 0, y: 0 },
  },
  pachyrhinosaurus: {
    base: 'ceratopsian',
    overlays: ['frill', 'noseBoss'],
    accessoryOffset: { x: -1, y: 0 },
  },
  troodon: {
    base: 'smallRaptor',
    overlays: ['bigEye'],
    accessoryOffset: { x: 0, y: 0 },
  },
  velociraptor: {
    base: 'smallRaptor',
    overlays: ['sickleClaw', 'featherRuff'],
    accessoryOffset: { x: 0, y: 0 },
  },
  protoceratops: {
    base: 'smallCeratopsian',
    overlays: ['smallFrill'],
    accessoryOffset: { x: -1, y: 1 },
  },
  oviraptor: {
    base: 'smallRaptor',
    overlays: ['oviCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  microraptor: {
    base: 'smallRaptor',
    overlays: ['wingFeathers', 'tailFan'],
    accessoryOffset: { x: 0, y: 0 },
  },
  ankylosaurus: {
    base: 'ankylosaur',
    overlays: ['armor', 'tailClub'],
    accessoryOffset: { x: -1, y: 1 },
  },
  iguanodon: {
    base: 'iguanodont',
    overlays: ['thumbSpike'],
    accessoryOffset: { x: 0, y: 0 },
  },
  maiasaura: {
    base: 'hadrosaur',
    overlays: ['softCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  diplodocus: {
    base: 'sauropodLongTail',
    overlays: ['whipTail'],
    accessoryOffset: { x: 2, y: -1 },
  },
  apatosaurus: {
    base: 'sauropodHeavy',
    overlays: ['thickNeck'],
    accessoryOffset: { x: 2, y: -1 },
  },
  therizinosaurus: {
    base: 'therizino',
    overlays: ['longClaws', 'featherRuff'],
    accessoryOffset: { x: 0, y: 0 },
  },
  pteranodon: {
    base: 'pterosaur',
    overlays: ['pteraCrest'],
    accessoryOffset: { x: 0, y: 0 },
  },
  quetzalcoatlus: {
    base: 'pterosaurTall',
    overlays: ['quetzCrest'],
    accessoryOffset: { x: 0, y: -1 },
  },
  mosasaurus: {
    base: 'marineReptile',
    overlays: ['flippers', 'seaTail'],
    accessoryOffset: { x: 0, y: 1 },
  },
}

// ------------------------------------------------------------
// 4) 날씨 액세서리/이펙트 레이어
//    기본 위치는 수각류 머리 기준. profile.accessoryOffset으로 보정.
// ------------------------------------------------------------
export const accessorySprites = {
  sunglasses: [
    '........................',
    '........................',
    '...........SS.SS........',
    '...........SSSSS........',
  ],

  umbrella: [
    '......UUUUUUUUU.........',
    '....UUUUUUUUUUUUU.......',
    '...UUUUUUUUUUUUUUU......',
    '..........U.............',
    '..........U.............',
    '..........U.............',
    '..........UU............',
  ],

  scarf: [
    '........................',
    '........................',
    '........................',
    '........................',
    '.........RRRR...........',
    '........RRRRRR..........',
    '.........RRR............',
    '.........RR.............',
    '.........RRR............',
  ],

  winterHat: [
    '..........NNN...........',
    '.........NNNNN..........',
    '........NNNNNNN.........',
    '........NNNNNNN.........',
    '.........NNNNN..........',
  ],

  mask: [
    '........................',
    '........................',
    '........................',
    '............MMMM........',
    '...........MMMMMM.......',
    '............MMMM........',
  ],

  sweat: [
    '................Q.......',
    '...............QQ.......',
    '................Q.......',
  ],

  rainDrops: [
    '...Q.....Q.......Q......',
    '....Q.........Q.........',
    '.Q.........Q............',
    '......Q............Q....',
    '...........Q............',
    '..Q.............Q.......',
  ],

  snow: [
    '..I.....I.......I.......',
    '.....I.......I..........',
    'I.........I.........I...',
    '......I.........I.......',
    '...I.........I..........',
    '.........I.........I....',
  ],

  sparkle: [
    '...Y....................',
    '..YYY...................',
    '...Y...............Y....',
    '..................YYY...',
    '...................Y....',
  ],

  zzz: [
    '....................ZZ..',
    '...................ZZ...',
    '..................ZZ....',
    '...................ZZ...',
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
  const {
    weatherCode = 0,
    temp = 20,
    wind = 0,
    isNight = false,
    airQuality = 'good',
  } = weather

  if (isNight) return ['zzz']

  const group = groupFromWmo(weatherCode)
  const keys = []

  if (airQuality === 'bad' || airQuality === 'veryBad') {
    keys.push('mask')
  }

  if (group === 'rain' || group === 'drizzle' || group === 'shower' || group === 'thunder') {
    keys.push('umbrella', 'rainDrops')
  } else if (group === 'snow') {
    keys.push('winterHat', 'scarf', 'snow')
  } else if (group === 'clear' && temp >= 27) {
    keys.push('sunglasses', 'sparkle')
  } else if (group === 'clear') {
    keys.push('sparkle')
  }

  if (temp >= 32) keys.push('sweat')
  if (wind >= 25 && !keys.includes('scarf')) keys.push('scarf')

  return [...new Set(keys)]
}

// 최종 공룡 그리드 생성
export function getDinoGrid(dino, weather = null) {
  if (!dino?.id) return normalizeGrid(baseSprites.largeTheropod)

  const profile = dinoSpriteMap[dino.id] ?? dinoSpriteMap.tyrannosaurus
  const layers = [baseSprites[profile.base]]

  for (const overlayKey of profile.overlays ?? []) {
    layers.push(overlaySprites[overlayKey])
  }

  if (weather) {
    const { x = 0, y = 0 } = profile.accessoryOffset ?? {}
    const accessories = getWeatherAccessoryKeys(weather)

    for (const key of accessories) {
      const layer = accessorySprites[key]
      if (!layer) continue

      // 빗방울/눈/반짝이/Zzz는 화면 전체 기준이라 offset 없음
      const globalEffect = ['rainDrops', 'snow', 'sparkle', 'zzz'].includes(key)
      layers.push(globalEffect ? layer : offsetLayer(layer, x, y))
    }
  }

  return mergeLayers(layers)
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
