// src/data/dinoSprites.js
// 공룡 마스코트 스프라이트 메타 + 날씨 액세서리 도트맵
//
// 몸체는 public/dinos/*.png 를 그대로 쓰고,
// 우산·모자 같은 날씨 소품만 SVG 도트로 그려 위에 겹친다.
// 좌표는 전부 96x72 기준이라 scale 을 바꿔도 그대로 통한다.
//
// PNG 파일 자체는 192x144(@2x)다. 원화가 96x72 축소본이라 확대하면 잡티가
// 블록으로 드러나서, 48색으로 정리하고 EPX 로 2배 키운 것을 쓴다.
// 좌표계는 96x72 그대로 두고 CSS 로만 줄여 그리므로 아래 값은 손댈 필요 없다.
// 배율 1·2·3 모두 레티나(2x)에서 정수배(1x·2x·3x)로 떨어진다.

export const SPRITE = { w: 96, h: 72 }

// foot      : 발끝 아래 투명 여백 (바닥 정렬 보정)
// top       : 우산이 매달릴 머리 최상단
// hat       : 모자가 앉을 자리 (밑면 중앙 기준)
// eye       : 눈 중심 (선글라스)
// snout     : 주둥이 중심 (마스크)
// neck      : 목 (목도리)
// headScale : 머리 크기 비율 — 액세서리 크기를 종마다 맞춘다
export const DINO_SPRITES = {
  tyrannosaurus: {
    file: 'trex.png',
    foot: 4,
    headScale: 1.45,
    top: [25, 4],
    hat: [25, 5],
    eye: [31, 10],
    snout: [14, 20],
    neck: [42, 24],
  },
  spinosaurus: {
    file: 'spino.png',
    foot: 8,
    headScale: 1.15,
    top: [28, 19],
    hat: [28, 20],
    eye: [31, 24],
    snout: [13, 29],
    neck: [38, 30],
  },
  brachiosaurus: {
    file: 'brachio.png',
    foot: 4,
    headScale: 0.7,
    top: [19, 4],
    hat: [19, 5],
    eye: [21, 9],
    snout: [12, 12],
    neck: [24, 20],
  },
  triceratops: {
    file: 'triceratops.png',
    foot: 5,
    headScale: 1.25,
    top: [32, 8],
    hat: [32, 9],
    eye: [30, 35],
    snout: [14, 45],
    neck: [46, 37],
  },
  stegosaurus: {
    file: 'stegosaurus.png',
    foot: 4,
    headScale: 0.75,
    top: [16, 37],
    hat: [16, 38],
    eye: [17, 41],
    snout: [9, 44],
    neck: [25, 42],
  },
  ankylosaurus: {
    file: 'ankylosaurus.png',
    foot: 10,
    headScale: 0.85,
    top: [15, 33],
    hat: [15, 34],
    eye: [16, 39],
    snout: [9, 45],
    neck: [24, 42],
  },
  parasaurolophus: {
    file: 'parasaurolophus.png',
    foot: 4,
    headScale: 0.85,
    top: [20, 16],
    hat: [17, 17],
    eye: [22, 22],
    snout: [13, 25],
    neck: [28, 28],
  },
  velociraptor: {
    file: 'velociraptor.png',
    foot: 5,
    headScale: 0.85,
    top: [16, 12],
    hat: [18, 14],
    eye: [18, 18],
    snout: [10, 22],
    neck: [24, 22],
  },
  pachycephalosaurus: {
    file: 'pachycephalosaurus.png',
    foot: 4,
    headScale: 1.0,
    top: [18, 3],
    hat: [18, 4],
    eye: [19, 24],
    snout: [11, 29],
    neck: [30, 28],
  },
}

// 도감에 없는 id 가 들어와도 화면이 비지 않도록
export const FALLBACK_SPRITE_ID = 'tyrannosaurus'

export function getSpriteMeta(dinoId) {
  return DINO_SPRITES[dinoId] ?? DINO_SPRITES[FALLBACK_SPRITE_ID]
}

// 액세서리 도트맵 — '.'은 투명, 나머지는 PALETTE 키
const UMBRELLA = [
  '...........RRRR...........',
  '........RRRRRRRRRR........',
  '.....RRRRRRRRRRRRRRRR.....',
  '..RRRRRRRRRRRRRRRRRRRRRR..',
  'RRRRRRRRRRRRRRRRRRRRRRRRRR',
  'rrrrrrrrrrrrrrrrrrrrrrrrrr',
  '............BB............',
  '............BB............',
  '............BB............',
  '............BB............',
  '............BB............',
  '............BB............',
  '............BB............',
  '............BB............',
  '.........BBBBB............',
  '.........BB...............',
]
const HAT = [
  '....WW......',
  '....WW......',
  '..RRRRRRRR..',
  '..RRRRRRRR..',
  '..RRRRRRRR..',
  '.rrrrrrrrrr.',
  'WWWWWWWWWWWW',
  'wwwwwwwwwwww',
]
const GLASSES = ['kkkkkkkkkk', 'kkk.kk.kkk', 'kkk.kk.kkk', '.k......k.']
const MASK = ['kSSSSSSSSk', 'kSSSSSSSSk', '.SSSSSSSS.', '.SSSSSSSS.', '..ssssss..']
const SCARF = [
  'cccccccccc',
  'cccccccccc',
  '.dddddddd.',
  '.ccc......',
  '.ccc......',
  '.ddd......',
  '.ccc......',
]

export const PALETTE = {
  R: '#D9534F',
  r: '#A83B38', // 우산·모자 빨강
  B: '#7A5C3E', // 우산 손잡이
  W: '#F2F2F0',
  w: '#CFCFCC', // 모자 흰 부분
  S: '#E3EDF7',
  s: '#B9CEE2', // 마스크
  c: '#E86A5C',
  d: '#B94F44', // 목도리
  k: '#1B1B1F', // 선글라스
}

// anchor: 부착 지점 키 / offset: 도트맵 안에서의 부착점 / scaled: 머리 비율 적용 여부
export const ACCESSORIES = {
  umbrella: { map: UMBRELLA, anchor: 'top', offset: [12, 16], scaled: false },
  hat: { map: HAT, anchor: 'hat', offset: [6, 8], scaled: true },
  glasses: { map: GLASSES, anchor: 'eye', offset: [5, 2], scaled: true },
  mask: { map: MASK, anchor: 'snout', offset: [5, 2], scaled: true },
  scarf: { map: SCARF, anchor: 'neck', offset: [5, 1], scaled: true },
}

// 액세서리를 부르는 날씨 조건. DinoMascot 과 소개 화면이 같은 표를 본다.
const RAIN_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]
const SNOW_CODES = [71, 73, 75, 77, 85, 86]
const CLEAR_CODES = [0, 1]

// 오늘 날씨에 착용할 액세서리 이름을 고른다
export function pickAccessories(weather = {}) {
  const { weatherCode = 0, temp = 20, pm25 = 0, isNight = false } = weather ?? {}
  const isRain = RAIN_CODES.includes(weatherCode)
  const isSnow = SNOW_CODES.includes(weatherCode)
  const list = []

  if (isRain) list.push('umbrella')
  if (isSnow || temp <= 4) list.push('hat', 'scarf')
  else if (temp <= 10) list.push('scarf')
  if (pm25 >= 35) list.push('mask')
  if (!isNight && !isRain && temp >= 26 && CLEAR_CODES.includes(weatherCode)) list.push('glasses')

  return [...new Set(list)]
}

// 날씨에 따라 바뀌는 몸짓 (CSS 클래스 is-* 로 이어진다)
export function pickGesture(weather = {}) {
  const { weatherCode = 0, temp = 20, wind = 0, isNight = false } = weather ?? {}

  if (isNight) return 'sleep'
  if (temp <= 4) return 'shiver'
  if (temp >= 32) return 'pant'
  if ([61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) return 'crouch'
  if (wind >= 30) return 'lean'
  return 'idle'
}

// 도트맵을 가로로 이어붙인 사각형 목록으로 변환한다
export function toRects(map) {
  const out = []

  map.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      if (ch !== '.') {
        let x2 = x
        while (x2 + 1 < row.length && row[x2 + 1] === ch) x2 += 1
        out.push({ x, y, w: x2 - x + 1, fill: PALETTE[ch] })
        x = x2
      }
      x += 1
    }
  })

  return out
}

// 액세서리 하나를 원본 픽셀 좌표계 위에 배치한다.
// 반환 좌표는 스프라이트 왼쪽 위(0,0) 기준이라 음수가 나올 수 있다 —
// 우산처럼 머리 위로 삐져나오는 소품이 그렇다.
export function layoutAccessory(name, meta) {
  const acc = ACCESSORIES[name]
  const hs = acc.scaled ? meta.headScale : 1
  const [anchorX, anchorY] = meta[acc.anchor]
  const w = acc.map[0].length
  const h = acc.map.length

  return {
    name,
    rects: toRects(acc.map),
    viewBox: `0 0 ${w} ${h}`,
    x: anchorX - acc.offset[0] * hs,
    y: anchorY - acc.offset[1] * hs,
    w: w * hs,
    h: h * hs,
  }
}
