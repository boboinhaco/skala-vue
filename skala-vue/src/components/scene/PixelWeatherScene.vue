<script setup>
import { computed } from 'vue'
import { SCENE_W, SCENE_H, sceneFor } from '@/data/weatherScenes'
import SkyLayer from './layers/SkyLayer.vue'
import CelestialLayer from './layers/CelestialLayer.vue'
import TerrainLayer from './layers/TerrainLayer.vue'
import WeatherFxLayer from './layers/WeatherFxLayer.vue'

// 화면 전체를 덮는 배경. 그림은 레이어 컴포넌트들이 그리고,
// 여기서는 어떤 화면을 보여줄지 고르고 전환만 맡는다.
const props = defineProps({
  weatherCode: { type: Number, default: 2 },
  isNight: { type: Boolean, default: false },
})

const scene = computed(() => sceneFor(props.weatherCode, props.isNight))
</script>

<template>
  <div class="pixel-scene" aria-hidden="true">
    <Transition name="scene">
      <div
        :key="scene.key"
        class="pixel-scene__layer"
        :style="{ background: scene.palette.sky[0] }"
      >
        <svg
          class="pixel-scene__svg"
          :viewBox="`0 0 ${SCENE_W} ${SCENE_H}`"
          preserveAspectRatio="xMidYMax meet"
          shape-rendering="crispEdges"
        >
          <SkyLayer :scene="scene" />
          <CelestialLayer :scene="scene" />
          <TerrainLayer :scene="scene" />
          <WeatherFxLayer :scene="scene" />
        </svg>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pixel-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.pixel-scene__layer {
  position: absolute;
  inset: 0;
}

/* 화면 아래쪽에 원래 비율대로 깔고, 남는 위쪽은 하늘색으로 채운다.
   세로로 긴 화면에서 배경이 통째로 확대되는 걸 막는다. */
.pixel-scene__svg {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
}

/* 도시를 바꾸면 새 배경이 위로 겹쳐지며 서서히 나타난다 */
.scene-enter-active,
.scene-leave-active {
  transition: opacity 0.75s ease;
}

.scene-enter-from,
.scene-leave-to {
  opacity: 0;
}
</style>
