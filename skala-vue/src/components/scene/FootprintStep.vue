<script setup>
// 발자국 한 개 + 그 시각의 기온·강수확률.
defineProps({
  step: { type: Object, required: true },
})

// 수각류 발자국 — 발가락 셋이 발바닥으로 모인다
const PRINT = [
  '.......##.......',
  '.......##.......',
  '.......##.......',
  '.##....##....##.',
  '.##....##....##.',
  '..##...##...##..',
  '..###.####.###..',
  '...##########...',
  '...##########...',
  '...##########...',
  '....########....',
  '....########....',
  '.....######.....',
  '.....######.....',
  '.....#####......',
  '......####......',
]

const WIDTH = 16
const HEIGHT = PRINT.length

const pixels = PRINT.flatMap((row, y) =>
  [...row].map((ch, x) => (ch === '#' ? { key: `${x}-${y}`, x, y } : null)).filter(Boolean),
)
</script>

<template>
  <li class="step" :class="{ 'step--lower': step.lower }">
    <span class="step__drop" :class="{ 'is-on': step.rainy }" aria-hidden="true"></span>

    <svg
      class="step__print"
      :class="{ 'step__print--flip': step.flip }"
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="`${step.time} ${step.temp}도, 강수확률 ${step.pop}퍼센트`"
    >
      <rect
        v-for="p in pixels"
        :key="p.key"
        :x="p.x"
        :y="p.y"
        width="1"
        height="1"
        :fill="step.color"
      />
    </svg>

    <span class="step__temp" :style="{ color: step.color }">{{ step.temp }}°</span>
    <span class="step__time">{{ step.time }}</span>
    <span class="step__pop" :class="{ 'is-on': step.rainy }">{{ step.pop }}%</span>
  </li>
</template>

<style scoped>
.step {
  display: flex;
  min-width: 50px;
  flex: 1;
  align-items: center;
  flex-direction: column;
  gap: 2px;
}

/* 좌우 발을 번갈아 디딘 것처럼 한 칸씩 내린다 */
.step--lower {
  margin-top: 14px;
}

.step__print {
  width: 34px;
  height: 34px;
  image-rendering: pixelated;
}

.step__print--flip {
  transform: scaleX(-1);
}

.step__drop {
  width: 4px;
  height: 8px;
  background: transparent;
}

.step__drop.is-on {
  background: #a9cfe6;
}

.step__temp {
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

.step__time {
  color: var(--px-ink-dim);
  font-size: 11px;
  white-space: nowrap;
}

.step__pop {
  color: #4a5a78;
  font-size: 11px;
}

.step__pop.is-on {
  color: #a9cfe6;
}
</style>
