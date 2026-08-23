<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { solarElevation } from '@/data/meteorAlert'

// 헤더 배너 안에 깔리는 가로로 긴 픽셀 풍경.
// 날씨와 무관하게 '지금이 낮이냐 밤이냐'만 따라간다.
const W = 240
const H = 24
const HORIZON = 16

// 서울 기준 태양 고도. 0도 위면 낮.
const SEOUL = { lat: 37.5665, lon: 126.978 }
const props = defineProps({
  // 넘기지 않으면 현재 시각을 쓴다
  at: { type: Date, default: null },
})

const now = ref(new Date())
const at = computed(() => props.at ?? now.value)

let timer = null
onMounted(() => {
  // 해가 뜨고 지는 시각을 놓치지 않을 만큼만 다시 계산한다
  timer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const isDay = computed(() => solarElevation(SEOUL.lat, SEOUL.lon, at.value) > 0)

const PALETTE = {
  day: {
    sky: ['#2E9BD6', '#4FB5E6', '#7CCDF2'],
    far: '#3A6A96',
    near: '#25456A',
    orb: '#FFE45C',
    orbGlow: '#FFF6C2',
  },
  night: {
    sky: ['#0B1030', '#141B44', '#1F2A5C'],
    far: '#26315F',
    near: '#161E42',
    orb: '#E4EAFF',
    orbGlow: '#8E9AD6',
  },
}
const palette = computed(() => (isDay.value ? PALETTE.day : PALETTE.night))

// ── 계단형 능선 ──────────────────────────────────────────
function ridge(points, quant, bottom) {
  const heights = []
  for (let x = 0; x <= W; x += 1) {
    let i = 0
    while (i < points.length - 2 && points[i + 1][0] < x) i += 1
    const [x0, y0] = points[i]
    const [x1, y1] = points[i + 1] ?? points[i]
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0)
    heights.push(Math.round((y0 + (y1 - y0) * t) / quant) * quant)
  }

  let d = `M0 ${bottom} L0 ${heights[0]}`
  for (let x = 1; x < heights.length; x += 1) {
    if (heights[x] !== heights[x - 1]) d += ` H${x} V${heights[x]}`
  }
  return `${d} H${W} V${bottom} Z`
}

const FAR_RIDGE = ridge(
  [
    [0, 24],
    [24, 17],
    [44, 22],
    [70, 14],
    [96, 21],
    [124, 16],
    [150, 22],
    [178, 15],
    [204, 21],
    [228, 17],
    [240, 23],
  ],
  2,
  H,
)
const NEAR_RIDGE = ridge(
  [
    [0, 29],
    [40, 25],
    [82, 30],
    [126, 24],
    [168, 29],
    [210, 25],
    [240, 29],
  ],
  2,
  H,
)

// 픽셀 원반 (해/달)
function disc(cx, cy, r) {
  const rows = []
  for (let y = -r; y <= r; y += 1) {
    const half = Math.round(Math.sqrt(Math.max(0, r * r - y * y)))
    if (half > 0) rows.push({ x: cx - half, y: cy + y, w: half * 2 })
  }
  return rows
}
const ORB = disc(158, 7, 3)
const ORB_GLOW = disc(158, 7, 5)

// 밤하늘 별 (자리는 고정)
const rand = (i) => (((Math.sin(i * 91.7) * 43758.5453) % 1) + 1) % 1
const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: Math.round(rand(i) * W),
  y: Math.round(rand(i + 40) * (HORIZON - 4)) + 1,
  s: rand(i + 90) > 0.85 ? 2 : 1,
}))

// 낮에는 구름 몇 조각
const CLOUDS = [
  { x: 34, y: 4, w: 14, h: 2 },
  { x: 30, y: 6, w: 22, h: 2 },
  { x: 104, y: 3, w: 12, h: 2 },
  { x: 100, y: 5, w: 20, h: 2 },
  { x: 196, y: 6, w: 16, h: 2 },
]

const SKY_STOPS = [0, 6, 11, HORIZON]
</script>

<template>
  <svg
    class="header-scene"
    :viewBox="`0 0 ${W} ${H}`"
    preserveAspectRatio="xMidYMax slice"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <rect
      v-for="(color, i) in palette.sky"
      :key="i"
      x="0"
      :y="SKY_STOPS[i]"
      :width="W"
      :height="SKY_STOPS[i + 1] - SKY_STOPS[i]"
      :fill="color"
    />
    <rect x="0" :y="HORIZON" :width="W" :height="H - HORIZON" :fill="palette.near" />

    <g v-if="!isDay">
      <rect
        v-for="(s, i) in STARS"
        :key="`s${i}`"
        :x="s.x"
        :y="s.y"
        :width="s.s"
        :height="s.s"
        fill="#FFFFFF"
        :opacity="0.4 + (i % 4) * 0.15"
      />
    </g>
    <g v-else>
      <rect
        v-for="(c, i) in CLOUDS"
        :key="`c${i}`"
        :x="c.x"
        :y="c.y"
        :width="c.w"
        :height="c.h"
        fill="#FFFFFF"
        opacity="0.85"
      />
    </g>

    <rect
      v-for="(r, i) in ORB_GLOW"
      :key="`g${i}`"
      :x="r.x"
      :y="r.y"
      :width="r.w"
      height="1"
      :fill="palette.orbGlow"
      opacity="0.18"
    />
    <rect
      v-for="(r, i) in ORB"
      :key="`o${i}`"
      :x="r.x"
      :y="r.y"
      :width="r.w"
      height="1"
      :fill="palette.orb"
    />

    <path :d="FAR_RIDGE" :fill="palette.far" />
    <path :d="NEAR_RIDGE" :fill="palette.near" />
  </svg>
</template>

<style scoped src="./HeaderScene.css"></style>
