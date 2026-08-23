<script setup>
import { computed, onMounted } from 'vue'
import Button from 'primevue/button'
import UnitToggle from '@/components/exercise/UnitToggle.vue'
import WeatherNowChip from './WeatherNowChip.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { sceneFor } from '@/data/weatherScenes'

// 원래 본문 히어로였던 부분. 헤더 안으로 들어오면서 관측 막대가 됐다.
const weatherStore = useWeatherStore()

// 관측 막대는 모든 화면의 헤더에 있으므로 여기서 직접 확보한다.
// (소개 화면처럼 자체적으로 날씨를 부르지 않는 화면에서도 값이 채워지도록)
onMounted(() => {
  weatherStore.fetchWeather()
})

const scene = computed(() => sceneFor(weatherStore.sceneCode, weatherStore.sceneIsNight))

const lastUpdatedLabel = computed(() => {
  if (!weatherStore.lastUpdated) return '업데이트 대기 중'

  const time = weatherStore.lastUpdated.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `마지막 관측 ${time}`
})
</script>

<template>
  <div class="weather-bar">
    <div class="weather-bar__title">
      <span class="px-eyebrow">MESOZOIC WEATHER STATION</span>
      <h1>오늘의 전국 날씨</h1>
      <p class="weather-bar__lead">지도나 카드를 누르면 배경이 그 지역 하늘로 바뀝니다.</p>
    </div>

    <div class="weather-bar__side">
      <WeatherNowChip :weather="weatherStore.selectedWeather" :scene-label="scene.label" />

      <div class="weather-bar__controls">
        <UnitToggle />
        <Button
          :label="weatherStore.isLoading ? '관측 중...' : '다시 관측'"
          icon="pi pi-refresh"
          :disabled="weatherStore.isLoading"
          @click="weatherStore.fetchWeather(true)"
        />
      </div>

      <small class="weather-bar__updated">{{ lastUpdatedLabel }}</small>
    </div>
  </div>
</template>

<style scoped src="./WeatherBar.css"></style>
