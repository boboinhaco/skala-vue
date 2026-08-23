<script setup>
import { computed } from 'vue'
import { SCENE_W, STARS } from '@/data/weatherScenes'

// 하늘 — 색 띠 4개와 그 사이 체크무늬, 그리고 밤하늘의 별.
const props = defineProps({
  scene: { type: Object, required: true },
})

// 띠 경계 y좌표 (마지막 값이 지평선)
const SKY_STOPS = [0, 15, 31, 47, 60]

const bands = computed(() =>
  props.scene.palette.sky.map((color, i) => ({
    color,
    y: SKY_STOPS[i],
    h: SKY_STOPS[i + 1] - SKY_STOPS[i],
  })),
)

// 띠와 띠 사이를 체크무늬로 섞어 옛날 게임 그라데이션을 흉내낸다
const dithers = computed(() =>
  props.scene.palette.sky.slice(0, 3).map((from, i) => ({
    id: `dither-${props.scene.key}-${i}`,
    from,
    to: props.scene.palette.sky[i + 1],
    y: SKY_STOPS[i + 1] - 2,
  })),
)
</script>

<template>
  <g>
    <defs>
      <pattern
        v-for="d in dithers"
        :id="d.id"
        :key="d.id"
        width="2"
        height="2"
        patternUnits="userSpaceOnUse"
      >
        <rect width="2" height="2" :fill="d.from" />
        <rect width="1" height="1" :fill="d.to" />
        <rect x="1" y="1" width="1" height="1" :fill="d.to" />
      </pattern>
    </defs>

    <rect
      v-for="band in bands"
      :key="band.y"
      x="0"
      :y="band.y"
      :width="SCENE_W"
      :height="band.h"
      :fill="band.color"
    />
    <rect
      v-for="d in dithers"
      :key="`s-${d.id}`"
      x="0"
      :y="d.y"
      :width="SCENE_W"
      height="2"
      :fill="`url(#${d.id})`"
    />

    <g v-if="scene.isNight" class="twinkle">
      <rect
        v-for="(s, i) in STARS"
        :key="i"
        :x="s.x"
        :y="s.y"
        :width="s.s"
        :height="s.s"
        fill="#FFFFFF"
        :opacity="0.35 + (i % 5) * 0.15"
      />
    </g>
  </g>
</template>

<style scoped>
.twinkle {
  animation: twinkle 4s steps(2, end) infinite alternate;
}

@keyframes twinkle {
  to {
    opacity: 0.65;
  }
}

@media (prefers-reduced-motion: reduce) {
  .twinkle {
    animation: none;
  }
}
</style>
