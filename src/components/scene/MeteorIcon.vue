<script setup>
import { computed } from 'vue'

// 픽셀 운석. 꼬리 색이 위협 단계를 나타낸다.
// R 암석, D 암석 그늘, F 불꽃 바깥, G 불꽃 안쪽
const props = defineProps({
  color: { type: String, default: '#6fd08c' },
  label: { type: String, default: '운석' },
})

const SPRITE = [
  '......................F.',
  '....................FF..',
  '...................FF...',
  '..................FF....',
  '................FFF.....',
  '..............FFGF......',
  '.............FGFF.......',
  '...........FFGF.........',
  '.....RRR..GFGGF.........',
  '...RRRRRRRGGF...........',
  '..RRRRRRRRRF............',
  '..RRRRRRRRD.............',
  '.RRRRRRRRDDD............',
  '.RRRRRRRDDDD............',
  '.RRRRRRDDDDD............',
  '..RRRRDDDDD.............',
  '..RRRDDDDDD.............',
  '...RDDDDDD..............',
  '.....DDD................',
]

const WIDTH = 24
const HEIGHT = SPRITE.length

const pixels = computed(() => {
  const palette = { R: '#5a4c42', D: '#38302a', F: props.color, G: '#fff4cf' }
  const out = []

  SPRITE.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      if (ch !== '.') out.push({ key: `${x}-${y}`, x, y, fill: palette[ch] })
    })
  })
  return out
})
</script>

<template>
  <svg
    class="meteor-icon"
    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
    shape-rendering="crispEdges"
    role="img"
    :aria-label="label"
  >
    <rect v-for="p in pixels" :key="p.key" :x="p.x" :y="p.y" width="1" height="1" :fill="p.fill" />
  </svg>
</template>

<style scoped>
.meteor-icon {
  width: 72px;
  height: 57px;
  flex: 0 0 auto;
  image-rendering: pixelated;
}
</style>
