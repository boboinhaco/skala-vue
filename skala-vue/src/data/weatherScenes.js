// 날씨별 픽셀 배경. 공룡이 살던 시대 풍경(화산, 침엽수, 소철, 양치식물)을
// 고정 격자 위에 계단 모양으로 그려서 확대해도 픽셀로 보이게 한다.

export const SCENE_W = 160
export const SCENE_H = 90
const HORIZON = 60

// ------------------------------------------------------------
// 색 계산
// ------------------------------------------------------------
const toRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
})
const toHex = ({ r, g, b }) =>
  '#' +
  [r, g, b]
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

function mix(hex, target, amount) {
  const a = toRgb(hex)
  const b = toRgb(target)
  return toHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

// ------------------------------------------------------------
// 계단형 지형 생성 — 가로/세로 선분만 써서 진짜 픽셀 계단을 만든다
// ------------------------------------------------------------
function heightsFrom(points, quant) {
  const out = []
  for (let x = 0; x <= SCENE_W; x += 1) {
    let i = 0
    while (i < points.length - 2 && points[i + 1][0] < x) i += 1
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1] ?? points[i]
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0)
    out.push(Math.round((y0 + (y1 - y0) * t) / quant) * quant)
  }
  return out
}

function stepPath(heights, bottom, from = 0) {
  let d = `M${from} ${bottom} L${from} ${heights[0]}`
  for (let i = 1; i < heights.length; i += 1) {
    if (heights[i] !== heights[i - 1]) d += ` H${from + i} V${heights[i]}`
  }
  return `${d} H${from + heights.length - 1} V${bottom} Z`
}

const ridge = (points, quant, bottom = SCENE_H) => stepPath(heightsFrom(points, quant), bottom)

export const TERRAIN = {
  far: ridge(
    [
      [0, 48],
      [14, 38],
      [24, 45],
      [36, 30],
      [48, 43],
      [60, 34],
      [72, 45],
      [86, 33],
      [98, 43],
      [112, 37],
      [126, 45],
      [142, 31],
      [152, 41],
      [160, 47],
    ],
    2,
  ),
  mid: ridge(
    [
      [0, 55],
      [20, 50],
      [40, 56],
      [62, 49],
      [86, 55],
      [108, 50],
      [132, 56],
      [160, 52],
    ],
    2,
  ),
  ground: ridge(
    [
      [0, 60],
      [40, 59],
      [80, 61],
      [120, 59],
      [160, 60],
    ],
    1,
  ),
  // 잔디 아래 흙층 — ground 위에 겹쳐 그려 윗면만 밝게 남긴다
  groundDeep: ridge(
    [
      [0, 63],
      [40, 62],
      [80, 64],
      [120, 62],
      [160, 63],
    ],
    1,
  ),
}

// 바닥 잡초와 돌멩이
export const GROUND_DETAIL = [
  { x: 8, y: 66, w: 3, h: 2, rock: true },
  { x: 30, y: 70, w: 2, h: 2, rock: false },
  { x: 52, y: 67, w: 4, h: 2, rock: true },
  { x: 68, y: 74, w: 3, h: 2, rock: false },
  { x: 94, y: 68, w: 2, h: 2, rock: false },
  { x: 118, y: 72, w: 4, h: 2, rock: true },
  { x: 138, y: 67, w: 3, h: 2, rock: false },
  { x: 150, y: 76, w: 2, h: 2, rock: true },
]

// 화산 — 분화구가 파인 원뿔
const VOLCANO_X = 96
const volcanoHeights = (() => {
  const pts = [
    [0, 54],
    [12, 34],
    [20, 23],
    [24, 26],
    [28, 23],
    [36, 34],
    [48, 54],
  ]
  const out = []
  for (let x = 0; x <= 48; x += 1) {
    let i = 0
    while (i < pts.length - 2 && pts[i + 1][0] < x) i += 1
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0)
    out.push(Math.round((y0 + (y1 - y0) * t) / 2) * 2)
  }
  return out
})()
export const VOLCANO = {
  body: stepPath(volcanoHeights, HORIZON, VOLCANO_X),
  crater: { x: VOLCANO_X + 20, y: 23, w: 8, h: 3 },
  // 분화구에서 흘러내리는 용암 줄기
  lava: [
    { x: VOLCANO_X + 22, y: 26, w: 3, h: 5 },
    { x: VOLCANO_X + 23, y: 31, w: 2, h: 6 },
    { x: VOLCANO_X + 24, y: 37, w: 3, h: 7 },
  ],
  // 분연 — 위로 갈수록 넓게 퍼지는 뭉게 모양
  smoke: [
    { x: VOLCANO_X + 22, y: 19, w: 4, h: 2, o: 0.5 },
    { x: VOLCANO_X + 21, y: 17, w: 6, h: 2, o: 0.46 },
    { x: VOLCANO_X + 19, y: 15, w: 8, h: 2, o: 0.42 },
    { x: VOLCANO_X + 20, y: 13, w: 9, h: 2, o: 0.36 },
    { x: VOLCANO_X + 17, y: 11, w: 11, h: 2, o: 0.3 },
    { x: VOLCANO_X + 18, y: 9, w: 12, h: 2, o: 0.24 },
    { x: VOLCANO_X + 15, y: 7, w: 14, h: 2, o: 0.18 },
    { x: VOLCANO_X + 16, y: 5, w: 12, h: 2, o: 0.12 },
  ],
}

// ------------------------------------------------------------
// 나무 — 침엽수 / 소철 / 양치식물
// ------------------------------------------------------------
function conifer(x, base, h) {
  const parts = []
  const tiers = Math.max(3, Math.round(h / 4))
  for (let i = 0; i < tiers; i += 1) {
    const w = 2 + i * 2
    parts.push({ x: x - w / 2, y: base - h + (i * h) / tiers, w, h: h / tiers + 1, tone: i % 2 })
  }
  parts.push({ x: x - 1, y: base - 2, w: 2, h: 3, trunk: true })
  return parts
}

function cycad(x, base, h) {
  const parts = [{ x: x - 1, y: base - h, w: 3, h, trunk: true }]
  for (const [dx, dy, w] of [
    [-7, 0, 7],
    [3, 0, 7],
    [-6, -3, 5],
    [4, -3, 5],
    [-3, -5, 3],
    [2, -5, 3],
  ]) {
    parts.push({ x: x + dx, y: base - h + dy, w, h: 2, tone: 0 })
  }
  return parts
}

function fern(x, base) {
  return [
    { x: x - 5, y: base - 3, w: 4, h: 2, tone: 1 },
    { x: x + 2, y: base - 3, w: 4, h: 2, tone: 1 },
    { x: x - 3, y: base - 5, w: 3, h: 2, tone: 0 },
    { x: x + 1, y: base - 5, w: 3, h: 2, tone: 0 },
    { x: x - 1, y: base - 6, w: 2, h: 6, trunk: true },
  ]
}

export const TREES = [
  ...conifer(12, 62, 16),
  ...conifer(24, 63, 22),
  ...cycad(38, 63, 8),
  ...conifer(50, 62, 14),
  ...fern(62, 64),
  ...conifer(74, 63, 19),
  ...cycad(88, 62, 7),
  ...fern(100, 63),
  ...conifer(148, 63, 17),
  ...conifer(158, 62, 13),
]

// ------------------------------------------------------------
// 구름 / 별 / 날씨 입자
// ------------------------------------------------------------
function cloud(x, y, s) {
  return [
    { x: x + 3 * s, y, w: 7 * s, h: 2 * s },
    { x: x + s, y: y + 2 * s, w: 12 * s, h: 2 * s },
    { x, y: y + 4 * s, w: 16 * s, h: 2 * s },
  ]
}
export const CLOUDS = {
  few: [...cloud(18, 10, 1), ...cloud(112, 16, 1)],
  many: [...cloud(6, 8, 1), ...cloud(44, 14, 1), ...cloud(86, 6, 2), ...cloud(126, 18, 1)],
}

// 고정 난수 — 다시 그려도 같은 자리에 오도록
const rand = (i) => (((Math.sin(i * 127.1) * 43758.5453) % 1) + 1) % 1

export const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: Math.round(rand(i) * SCENE_W),
  y: Math.round(rand(i + 90) * 44),
  s: rand(i + 200) > 0.82 ? 2 : 1,
}))

export const RAIN = Array.from({ length: 90 }, (_, i) => ({
  x: Math.round(rand(i + 11) * SCENE_W),
  y: Math.round(rand(i + 57) * SCENE_H),
  h: 3 + Math.round(rand(i + 300) * 3),
}))

export const SNOW = Array.from({ length: 70 }, (_, i) => ({
  x: Math.round(rand(i + 23) * SCENE_W),
  y: Math.round(rand(i + 71) * SCENE_H),
  s: rand(i + 400) > 0.6 ? 2 : 1,
}))

export const FOG_BANDS = [
  { y: 40, h: 4, o: 0.3 },
  { y: 48, h: 5, o: 0.42 },
  { y: 56, h: 6, o: 0.55 },
  { y: 66, h: 8, o: 0.4 },
]

export const LIGHTNING = 'M74 6 L64 34 L72 34 L62 58 L84 28 L75 28 L86 6 Z'

// ------------------------------------------------------------
// 날씨별 팔레트
// ------------------------------------------------------------
const base = {
  clear: {
    sky: ['#3FB8E8', '#63CDF2', '#8FDFF8', '#BFEFFB'],
    sun: '#FFE45C',
    sunGlow: '#FFF6C2',
    far: '#7FA5C4',
    mid: '#5C8C57',
    ground: '#6FA85C',
    groundTop: '#8FC96E',
    tree: ['#2A5533', '#3C7343'],
    trunk: '#4A3327',
    volcano: '#6B5A50',
    volcanoDark: '#54463E',
    lava: '#FF6B2C',
    smoke: '#B9AFA6',
    cloud: '#FFFFFF',
    particle: '#CDE9F7',
    haze: null,
  },
  cloudy: {
    sky: ['#8CA5B8', '#A3B9C8', '#BACCD7', '#D2DEE5'],
    sun: '#E8EDF0',
    sunGlow: '#F2F6F8',
    far: '#7E92A2',
    mid: '#5A7E58',
    ground: '#6C9760',
    groundTop: '#88B571',
    tree: ['#2A4E33', '#375F3D'],
    trunk: '#453026',
    volcano: '#655750',
    volcanoDark: '#4F433D',
    lava: '#E85F28',
    smoke: '#A99F97',
    cloud: '#EEF3F6',
    particle: '#C7D8E3',
    haze: null,
  },
  fog: {
    sky: ['#B3BEC2', '#C4CDD0', '#D3DADC', '#E2E7E8'],
    sun: '#DCE3E4',
    sunGlow: '#EDF1F1',
    far: '#9EAAB0',
    mid: '#7A8F79',
    ground: '#88A67F',
    groundTop: '#9DBC90',
    tree: ['#4A5E4C', '#586E58'],
    trunk: '#5A4A40',
    volcano: '#8B8079',
    volcanoDark: '#756B65',
    lava: '#C9705A',
    smoke: '#C3BDB8',
    cloud: '#E7ECED',
    particle: '#DDE4E5',
    haze: '#DCE3E5',
  },
  drizzle: {
    sky: ['#6E8394', '#8195A4', '#94A7B4', '#AABAC4'],
    sun: '#C6D2DA',
    sunGlow: '#DDE5EA',
    far: '#6A7C8B',
    mid: '#4E6E4F',
    ground: '#5C8455',
    groundTop: '#729D66',
    tree: ['#24422C', '#305236'],
    trunk: '#3C2A21',
    volcano: '#575049',
    volcanoDark: '#443E39',
    lava: '#D2542A',
    smoke: '#8F8880',
    cloud: '#C9D5DD',
    particle: '#BBD7E8',
    haze: null,
  },
  rain: {
    sky: ['#414F5E', '#54636F', '#66757F', '#7C8A93'],
    sun: '#9EAAB4',
    sunGlow: '#B8C2CA',
    far: '#4C5A67',
    mid: '#3B5740',
    ground: '#476B45',
    groundTop: '#598155',
    tree: ['#1B3321', '#26422A'],
    trunk: '#2F211A',
    volcano: '#453F3A',
    volcanoDark: '#36312D',
    lava: '#E2571F',
    smoke: '#7A736C',
    cloud: '#98A6B0',
    particle: '#A9CFE6',
    haze: null,
  },
  shower: {
    sky: ['#4E6072', '#63768A', '#7A8C9C', '#98A9B5'],
    sun: '#D9C88F',
    sunGlow: '#EFE3B4',
    far: '#586A7A',
    mid: '#43614A',
    ground: '#517550',
    groundTop: '#658E60',
    tree: ['#1E3824', '#2A492F'],
    trunk: '#33241C',
    volcano: '#4A443E',
    volcanoDark: '#3A3531',
    lava: '#EA5D22',
    smoke: '#837C74',
    cloud: '#A6B4BE',
    particle: '#B4D8EC',
    haze: null,
  },
  snow: {
    sky: ['#9FB2C6', '#B4C4D4', '#C8D5E0', '#DEE7EE'],
    sun: '#EDF3F8',
    sunGlow: '#F7FAFC',
    far: '#8D9FB2',
    mid: '#7C93A0',
    ground: '#DCE8F0',
    groundTop: '#F2F8FC',
    tree: ['#33513E', '#41654B'],
    trunk: '#463227',
    volcano: '#6E6660',
    volcanoDark: '#565049',
    lava: '#E4632B',
    smoke: '#B4ADA6',
    cloud: '#F0F5F9',
    particle: '#FFFFFF',
    haze: null,
  },
  thunder: {
    sky: ['#232A3A', '#31394C', '#41495C', '#565E70'],
    sun: '#8E93A4',
    sunGlow: '#A8ACBA',
    far: '#2F374A',
    mid: '#2A4033',
    ground: '#345038',
    groundTop: '#436344',
    tree: ['#14251A', '#1D3322'],
    trunk: '#241A14',
    volcano: '#332F2C',
    volcanoDark: '#272423',
    lava: '#FF6A22',
    smoke: '#5F5A55',
    cloud: '#6E7887',
    particle: '#96BEDA',
    haze: null,
  },
}

// 밤 팔레트는 낮 색을 깊은 남색 쪽으로 눌러서 만든다
const NIGHT = '#0A0E28'
function nightify(p) {
  const d = (hex, amount) => mix(hex, NIGHT, amount)
  return {
    ...p,
    sky: ['#080B22', '#101538', '#1B2350', '#2E3767'],
    sun: '#E4EAFF',
    sunGlow: '#B9C4F0',
    far: d(p.far, 0.66),
    mid: d(p.mid, 0.7),
    ground: d(p.ground, 0.72),
    groundTop: d(p.groundTop, 0.66),
    tree: [d(p.tree[0], 0.6), d(p.tree[1], 0.62)],
    trunk: d(p.trunk, 0.6),
    volcano: d(p.volcano, 0.6),
    volcanoDark: d(p.volcanoDark, 0.62),
    lava: p.lava,
    smoke: d(p.smoke, 0.66),
    cloud: d(p.cloud, 0.62),
    particle: d(p.particle, 0.28),
    haze: p.haze ? d(p.haze, 0.6) : null,
  }
}

// 그룹별로 어떤 요소를 켤지
const LAYOUT = {
  clear: { clouds: 'few', effect: null, sun: true, label: '맑음' },
  cloudy: { clouds: 'many', effect: null, sun: true, label: '흐림' },
  fog: { clouds: 'many', effect: 'fog', sun: false, label: '안개' },
  drizzle: { clouds: 'many', effect: 'drizzle', sun: false, label: '이슬비' },
  rain: { clouds: 'many', effect: 'rain', sun: false, label: '비' },
  // 소나기는 구름 사이로 해가 잠깐 보이는 하늘
  shower: { clouds: 'many', effect: 'rain', sun: true, label: '소나기' },
  snow: { clouds: 'many', effect: 'snow', sun: false, label: '눈' },
  thunder: { clouds: 'many', effect: 'thunder', sun: false, label: '뇌우' },
}

export const SCENE_GROUPS = Object.keys(LAYOUT)

// WMO 코드를 배경 그룹으로 (dinoSprites의 분류와 같은 기준)
export function sceneGroupFromWmo(code) {
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

// 화면 하나를 통째로 돌려준다
export function sceneFor(weatherCode, isNight = false) {
  const group = sceneGroupFromWmo(weatherCode)
  const layout = LAYOUT[group]

  return {
    key: `${group}-${isNight ? 'night' : 'day'}`,
    group,
    isNight,
    label: `${layout.label}${isNight ? ' · 밤' : ''}`,
    palette: isNight ? nightify(base[group]) : base[group],
    clouds: CLOUDS[layout.clouds],
    effect: layout.effect,
    showSun: layout.sun,
  }
}

// ------------------------------------------------------------
// 해와 달 — 원을 계단으로 쌓아 픽셀 원반을 만든다
// ------------------------------------------------------------
function disc(cx, cy, r) {
  const rows = []
  for (let y = -r; y <= r; y += 1) {
    const half = Math.round(Math.sqrt(Math.max(0, r * r - y * y)))
    if (half > 0) rows.push({ x: cx - half, y: cy + y, w: half * 2, h: 1 })
  }
  return rows
}

export const SUN = { body: disc(30, 18, 7), glow: disc(30, 18, 10) }
export const MOON = {
  body: disc(36, 16, 6),
  // 달 표면 크레이터
  craters: [
    { x: 33, y: 13, w: 3, h: 2 },
    { x: 38, y: 17, w: 2, h: 2 },
    { x: 34, y: 19, w: 2, h: 1 },
  ],
}
