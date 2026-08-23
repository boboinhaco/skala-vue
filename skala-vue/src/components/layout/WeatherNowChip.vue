<script setup>
import TemperatureReading from '@/components/common/TemperatureReading.vue'

// 지금 보고 있는 지역 · 날씨 · 기온을 한 덩어리로 보여주는 칩.
defineProps({
  weather: { type: Object, default: null },
  sceneLabel: { type: String, default: '' },
})
</script>

<template>
  <p class="now-chip">
    <span class="now-chip__dot" aria-hidden="true"></span>
    <span class="now-chip__city">{{ weather?.name ?? '전국' }}</span>
    <span class="now-chip__scene">{{ sceneLabel }}</span>
    <strong v-if="typeof weather?.temp === 'number'">
      <TemperatureReading :temp="weather.temp" />
    </strong>
  </p>
</template>

<style scoped src="./WeatherNowChip.css"></style>
