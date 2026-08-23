<script setup>
import { TEMP_STEPS } from '@/data/tempScale'

// 기온 색 범례. 지도와 발자국 타임라인이 같은 눈금을 쓴다.
defineProps({
  align: { type: String, default: 'start' },
})
</script>

<template>
  <ul class="temp-legend" :style="{ justifyContent: align }">
    <li v-for="step in TEMP_STEPS" :key="step.label">
      <i :style="{ background: step.color }"></i>{{ step.label }}
    </li>
  </ul>
</template>

<style scoped>
.temp-legend {
  display: flex;
  margin: 10px 0 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 4px 8px;
  list-style: none;
}

.temp-legend li {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.temp-legend i {
  width: 9px;
  height: 9px;
  border: 2px solid var(--px-edge);
}
</style>
