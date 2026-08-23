<script setup>
import { computed } from 'vue'
import { SCENE_W, TERRAIN, RAIN, SNOW, sceneFor } from '@/data/weatherScenes'

// 큰 배경과 같은 지형 데이터를 잘라 쓴 작은 미리보기.
// 도시 카드마다 그 도시의 배경이 어떤 화면인지 바로 보여준다.
const props = defineProps({
  weatherCode: { type: Number, default: 2 },
  isNight: { type: Boolean, default: false },
})

const scene = computed(() => sceneFor(props.weatherCode, props.isNight))

// 원본 좌표계에서 산과 땅이 보이는 구간만 잘라낸다
const VIEW = { x: 24, y: 26, w: 56, h: 38 }
const SKY_STOPS = [0, 15, 31, 47, 64]
const skyBands = computed(() =>
  scene.value.palette.sky.map((color, i) => ({
    color,
    y: SKY_STOPS[i],
    h: SKY_STOPS[i + 1] - SKY_STOPS[i],
  })),
)

const drops = computed(() => RAIN.filter((r) => r.x > VIEW.x && r.x < VIEW.x + VIEW.w).slice(0, 14))
const flakes = computed(() =>
  SNOW.filter((s) => s.x > VIEW.x && s.x < VIEW.x + VIEW.w).slice(0, 12),
)
const isRain = computed(() => ['rain', 'drizzle', 'thunder'].includes(scene.value.effect))
</script>

<template>
  <svg
    class="chip"
    :viewBox="`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`"
    preserveAspectRatio="xMidYMid slice"
    shape-rendering="crispEdges"
    role="img"
    :aria-label="scene.label"
  >
    <rect
      v-for="band in skyBands"
      :key="band.y"
      x="0"
      :y="band.y"
      :width="SCENE_W"
      :height="band.h"
      :fill="band.color"
    />

    <circle
      v-if="scene.showSun"
      :cx="VIEW.x + 9"
      :cy="VIEW.y + 8"
      r="4"
      :fill="scene.palette.sun"
    />

    <path :d="TERRAIN.far" :fill="scene.palette.far" />
    <path :d="TERRAIN.mid" :fill="scene.palette.mid" />
    <path :d="TERRAIN.ground" :fill="scene.palette.groundTop" />
    <path :d="TERRAIN.groundDeep" :fill="scene.palette.ground" />

    <g v-if="isRain">
      <rect
        v-for="(r, i) in drops"
        :key="`r${i}`"
        :x="r.x"
        :y="r.y % VIEW.h > 0 ? VIEW.y + (r.y % VIEW.h) : VIEW.y"
        width="1"
        :height="r.h"
        :fill="scene.palette.particle"
        opacity="0.75"
      />
    </g>
    <g v-else-if="scene.effect === 'snow'">
      <rect
        v-for="(s, i) in flakes"
        :key="`s${i}`"
        :x="s.x"
        :y="VIEW.y + (s.y % VIEW.h)"
        :width="s.s"
        :height="s.s"
        :fill="scene.palette.particle"
      />
    </g>
    <g v-else-if="scene.effect === 'fog'">
      <rect
        v-for="n in 3"
        :key="`f${n}`"
        :x="VIEW.x"
        :y="VIEW.y + 8 + n * 7"
        :width="VIEW.w"
        height="3"
        :fill="scene.palette.haze"
        opacity="0.5"
      />
    </g>
  </svg>
</template>

<style scoped>
.chip {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
</style>
