<script setup>
import TemperatureReading from '@/components/common/TemperatureReading.vue'

// 지도 아래 붙는 '지금 보는 곳' 요약.
defineProps({
  weather: { type: Object, default: null },
  sceneLabel: { type: String, default: '' },
})
</script>

<template>
  <div v-if="weather" class="side-now">
    <p class="px-eyebrow">지금 보는 곳</p>
    <h3>{{ weather.name }}</h3>
    <p class="side-now__scene">{{ sceneLabel }} · {{ weather.status }}</p>

    <ul class="side-now__stats">
      <li>
        기온
        <strong><TemperatureReading :temp="weather.temp" /></strong>
      </li>
      <li>
        습도 <strong>{{ weather.humidity }}%</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.side-now {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 2px solid var(--px-edge-light);
}

.side-now h3 {
  margin: 2px 0 4px;
}

.side-now__scene {
  margin: 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.side-now__stats {
  display: flex;
  margin: 10px 0 0;
  padding: 0;
  gap: 14px;
  color: var(--px-ink-dim);
  font-size: 11px;
  list-style: none;
}

.side-now__stats strong {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-weight: 700;
}
</style>
