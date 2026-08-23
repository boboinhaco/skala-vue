// 전국 시도를 한 화면에 모아 보여주는 픽셀 지도.
// 배경 화면과 같은 격자 방식으로, 한 칸이 하나의 픽셀이 되도록 그린다.

// 손으로 그린 원본은 24x32. 도시들이 서로 붙지 않도록 2배로 늘려서 쓴다.
// 정확히 2배라 해안선은 그대로 두꺼운 픽셀로 남는다.
const SRC_W = 24
export const MAP_W = 48
export const MAP_H = 64

// 격자 좌표 <-> 위경도 변환 기준. 남한이 화면에 꽉 차도록 잡았다.
const LON_MIN = 125.5
const LON_MAX = 129.9
const LAT_MAX = 38.7
const LAT_MIN = 33.0

// '#' 육지, '.' 바다
const SOURCE = [
  '..............###.......',
  '............######......',
  '.......###########......',
  '.....##############.....',
  '....###############.....',
  '....################....',
  '....################....',
  '...#################....',
  '...##################...',
  '....#################...',
  '..###################...',
  '.####################...',
  '...##################...',
  '...##################...',
  '....#################...',
  '...##################...',
  '...###################..',
  '...###################..',
  '....##################..',
  '...##################...',
  '...##################...',
  '..#################.....',
  '..################......',
  '.###############........',
  '..#############.........',
  '...##########...........',
  '....###.##..............',
  '........................',
  '...#####................',
  '....####................',
  '........................',
  '........................',
]

// 한 칸을 2x2 블록으로
const LAND = SOURCE.flatMap((row) => {
  const doubled = [...row.padEnd(SRC_W, '.')].map((c) => c + c).join('')
  return [doubled, doubled]
})

export const LAND_GRID = LAND

// 지도에서만 쓰는 위치 보정.
// 수도권과 대전권은 실제로 서로 붙어 있어서 마커가 겹친다.
// 지도 라벨을 살짝 밀어 그리는 흔한 방식으로 읽을 수 있게 띄운다.
const NUDGE = {
  incheon: { x: -3, y: 0 },
  gyeonggi: { x: 1, y: 3 },
  sejong: { x: -3, y: -2 },
  jeonnam: { x: -1, y: 2 },
}

// 위경도를 격자 칸으로
export function toCell(lat, lon, cityId) {
  const nudge = NUDGE[cityId] ?? { x: 0, y: 0 }
  return {
    x: Math.round(((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (MAP_W - 1)) + nudge.x,
    y: Math.round(((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (MAP_H - 1)) + nudge.y,
  }
}

export function isLand(x, y) {
  return LAND[y]?.[x] === '#'
}

// 육지 칸을 사각형으로 (가로로 이어진 칸은 하나로 묶어 도형 수를 줄인다)
export function landRects() {
  const rects = []
  LAND.forEach((row, y) => {
    let start = null
    for (let x = 0; x <= MAP_W; x += 1) {
      const land = row[x] === '#'
      if (land && start === null) start = x
      if (!land && start !== null) {
        rects.push({ x: start, y, w: x - start })
        start = null
      }
    }
  })
  return rects
}

// 바다와 맞닿은 칸 = 해안선
export function coastRects() {
  const out = []
  LAND.forEach((row, y) => {
    for (let x = 0; x < MAP_W; x += 1) {
      if (row[x] !== '#') continue
      const edge = !isLand(x - 1, y) || !isLand(x + 1, y) || !isLand(x, y - 1) || !isLand(x, y + 1)
      if (edge) out.push({ x, y })
    }
  })
  return out
}
