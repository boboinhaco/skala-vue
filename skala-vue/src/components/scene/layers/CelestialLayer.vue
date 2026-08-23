<script setup>
import { SUN, MOON } from '@/data/weatherScenes'

// 해와 달. 흐리거나 비 오는 날씨에서는 아예 그리지 않는다(scene.showSun).
defineProps({
  scene: { type: Object, required: true },
})
</script>

<template>
  <g v-if="scene.showSun">
    <template v-if="!scene.isNight">
      <rect
        v-for="(r, i) in SUN.glow"
        :key="`g${i}`"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        height="1"
        :fill="scene.palette.sunGlow"
        opacity="0.35"
      />
      <rect
        v-for="(r, i) in SUN.body"
        :key="`s${i}`"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        height="1"
        :fill="scene.palette.sun"
      />
    </template>

    <template v-else>
      <rect
        v-for="(r, i) in MOON.body"
        :key="`m${i}`"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        height="1"
        :fill="scene.palette.sun"
      />
      <rect
        v-for="(c, i) in MOON.craters"
        :key="`c${i}`"
        :x="c.x"
        :y="c.y"
        :width="c.w"
        :height="c.h"
        :fill="scene.palette.sunGlow"
      />
    </template>
  </g>
</template>
