<script setup>
// 지도 위 관측소 한 곳. 고른 곳에는 테두리가 둘러진다.
defineProps({
  marker: { type: Object, required: true },
})

defineEmits(['select', 'hover'])
</script>

<template>
  <g
    class="marker"
    :class="{ 'marker--on': marker.selected }"
    role="button"
    tabindex="0"
    :aria-label="`${marker.name} ${typeof marker.temp === 'number' ? Math.round(marker.temp) + '도' : '데이터 없음'}`"
    :aria-pressed="marker.selected"
    @click="$emit('select', marker.id)"
    @keydown.enter.prevent="$emit('select', marker.id)"
    @keydown.space.prevent="$emit('select', marker.id)"
    @mouseenter="$emit('hover', marker.id)"
    @mouseleave="$emit('hover', null)"
    @focus="$emit('hover', marker.id)"
    @blur="$emit('hover', null)"
  >
    <rect
      v-if="marker.selected"
      :x="marker.x - 2"
      :y="marker.y - 2"
      width="6"
      height="6"
      class="marker__ring"
    />
    <rect :x="marker.x - 1" :y="marker.y - 1" width="4" height="4" class="marker__edge" />
    <rect :x="marker.x" :y="marker.y" width="2" height="2" :fill="marker.color" />
  </g>
</template>

<style scoped>
.marker {
  cursor: pointer;
  outline: 0;
}

.marker__edge {
  fill: var(--px-edge);
}

/* stroke 는 경계에 걸쳐 그려져 픽셀 격자에서 반 칸 밀린다.
   큰 사각형을 뒤에 깔고 마커로 가운데를 덮어 정확히 한 칸 테두리를 만든다. */
.marker__ring {
  fill: var(--px-accent);
}

.marker:hover .marker__edge,
.marker:focus-visible .marker__edge {
  fill: var(--px-accent);
}

.marker--on .marker__ring {
  animation: ring 1.2s steps(2, end) infinite;
}

@keyframes ring {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker--on .marker__ring {
    animation: none;
  }
}
</style>
