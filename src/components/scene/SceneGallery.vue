<script setup>
import PixelWeatherChip from './PixelWeatherChip.vue'

// 날씨별 배경을 낮/밤 한 쌍씩 늘어놓는 갤러리.
defineProps({
  samples: { type: Array, default: () => [] },
})
</script>

<template>
  <ul class="scene-gallery">
    <li v-for="sample in samples" :key="sample.group">
      <div class="scene-gallery__day">
        <PixelWeatherChip :weather-code="sample.code" />
      </div>
      <div class="scene-gallery__night">
        <PixelWeatherChip :weather-code="sample.code" is-night />
      </div>
      <span>{{ sample.label }}</span>
    </li>
  </ul>
</template>

<style scoped>
.scene-gallery {
  display: grid;
  margin: 0 0 12px;
  padding: 0;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  list-style: none;
}

.scene-gallery li {
  display: grid;
  gap: 3px;
  grid-template-areas: 'day night' 'label label';
}

.scene-gallery__day,
.scene-gallery__night {
  height: 46px;
  border: 2px solid var(--px-edge);
  overflow: hidden;
}

.scene-gallery__day {
  grid-area: day;
}

.scene-gallery__night {
  grid-area: night;
}

.scene-gallery span {
  color: var(--px-ink-dim);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
  grid-area: label;
}
</style>
