<!-- src/components/PixelDino.vue -->
<script setup>
import { computed } from 'vue'
import { GRID_W, GRID_H, createPalette, getDinoGrid, gridToPixels } from '../data/dinoSprites'

const props = defineProps({
  dino: {
    type: Object,
    required: true,
  },
  weather: {
    type: Object,
    default: () => ({
      weatherCode: 0,
      temp: 20,
      wind: 0,
      isNight: false,
      airQuality: 'good',
    }),
  },
  size: {
    type: Number,
    default: 240,
  },
  animate: {
    type: Boolean,
    default: true,
  },
})

const palette = computed(() => createPalette(props.dino?.accent ?? '#6D9B54'))
const grid = computed(() => getDinoGrid(props.dino, props.weather))
const pixels = computed(() => gridToPixels(grid.value, palette.value))

const label = computed(() =>
  props.dino?.name ? `${props.dino.name} 날씨 마스코트` : '공룡 날씨 마스코트',
)
</script>

<template>
  <div
    class="pixel-dino"
    :class="{ 'pixel-dino--animate': animate }"
    :style="{ width: `${size}px`, height: `${size * (GRID_H / GRID_W)}px` }"
  >
    <svg
      class="pixel-dino__svg"
      :viewBox="`0 0 ${GRID_W} ${GRID_H}`"
      role="img"
      :aria-label="label"
      shape-rendering="crispEdges"
    >
      <rect
        v-for="pixel in pixels"
        :key="pixel.key"
        :x="pixel.x"
        :y="pixel.y"
        width="1"
        height="1"
        :fill="pixel.color"
      />
    </svg>
  </div>
</template>

<style scoped>
.pixel-dino {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.pixel-dino__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  image-rendering: pixelated;
}

.pixel-dino--animate {
  animation: dino-idle 1.8s steps(2, end) infinite;
  transform-origin: 50% 100%;
}

@keyframes dino-idle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pixel-dino--animate {
    animation: none;
  }
}
</style>
