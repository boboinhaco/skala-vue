<script setup>
import { SCENE_W, TERRAIN, VOLCANO, TREES, GROUND_DETAIL } from '@/data/weatherScenes'

// 중생대 풍경 — 구름, 먼 산, 화산, 언덕, 땅, 나무.
// 지형은 전부 가로/세로 선분만으로 그려서 확대해도 픽셀 계단이 남는다.
defineProps({
  scene: { type: Object, required: true },
})
</script>

<template>
  <g>
    <!-- 구름 (천천히 흐른다) -->
    <g class="drift">
      <template v-for="pass in [0, SCENE_W]" :key="pass">
        <rect
          v-for="(c, i) in scene.clouds"
          :key="`${pass}-${i}`"
          :x="c.x + pass"
          :y="c.y"
          :width="c.w"
          :height="c.h"
          :fill="scene.palette.cloud"
          opacity="0.92"
        />
      </template>
    </g>

    <!-- 먼 산 -->
    <path :d="TERRAIN.far" :fill="scene.palette.far" />

    <!-- 화산 -->
    <path :d="VOLCANO.body" :fill="scene.palette.volcano" />
    <rect
      :x="VOLCANO.crater.x"
      :y="VOLCANO.crater.y"
      :width="VOLCANO.crater.w"
      :height="VOLCANO.crater.h"
      :fill="scene.palette.lava"
    />
    <rect
      v-for="(l, i) in VOLCANO.lava"
      :key="`l${i}`"
      :x="l.x"
      :y="l.y"
      :width="l.w"
      :height="l.h"
      :fill="scene.palette.lava"
      opacity="0.85"
    />
    <g class="smoke">
      <rect
        v-for="(sm, i) in VOLCANO.smoke"
        :key="`sm${i}`"
        :x="sm.x"
        :y="sm.y"
        :width="sm.w"
        :height="sm.h"
        :fill="scene.palette.smoke"
        :opacity="sm.o"
      />
    </g>

    <!-- 언덕과 땅 -->
    <path :d="TERRAIN.mid" :fill="scene.palette.mid" />
    <path :d="TERRAIN.ground" :fill="scene.palette.groundTop" />
    <path :d="TERRAIN.groundDeep" :fill="scene.palette.ground" />
    <rect
      v-for="(g, i) in GROUND_DETAIL"
      :key="`gd${i}`"
      :x="g.x"
      :y="g.y"
      :width="g.w"
      :height="g.h"
      :fill="g.rock ? scene.palette.far : scene.palette.tree[0]"
      opacity="0.7"
    />

    <!-- 나무 -->
    <rect
      v-for="(t, i) in TREES"
      :key="`t${i}`"
      :x="t.x"
      :y="t.y"
      :width="t.w"
      :height="t.h"
      :fill="t.trunk ? scene.palette.trunk : scene.palette.tree[t.tone]"
    />
  </g>
</template>

<style scoped>
.drift {
  animation: drift 90s linear infinite;
}

@keyframes drift {
  to {
    transform: translateX(-160px);
  }
}

.smoke {
  animation: puff 9s ease-in-out infinite alternate;
  transform-origin: 116px 30px;
}

@keyframes puff {
  to {
    transform: translate(-3px, -3px) scale(1.12);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drift,
  .smoke {
    animation: none;
  }
}
</style>
