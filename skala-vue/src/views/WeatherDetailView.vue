<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Message from 'primevue/message'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import DetailHero from '@/components/exercise/DetailHero.vue'
import StatGrid from '@/components/exercise/StatGrid.vue'
import DinoMascotCard from '@/components/exercise/DinoMascotCard.vue'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherStore } from '@/stores/weatherStore'
import { toWmoCode, msToKmh, aqiToAirQuality } from '@/data/openWeatherToWmo'
import { sceneFor } from '@/data/weatherScenes'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const { configStore, formatTemperature } = useTemperature()

const selectedWeather = computed(() => weatherStore.getWeatherById(route.params.cityId))
const hasData = computed(() => typeof selectedWeather.value?.temp === 'number')
const scene = computed(() =>
  sceneFor(toWmoCode(selectedWeather.value?.conditionId), selectedWeather.value?.isNight),
)

const AIR_LABEL = { good: '좋음', bad: '나쁨', veryBad: '매우 나쁨' }

const stats = computed(() => {
  const w = selectedWeather.value
  if (!hasData.value) return []

  return [
    { label: '기온', value: `${formatTemperature(w.temp)}${configStore.unitSymbol}` },
    { label: '습도', value: `${w.humidity}%` },
    { label: '풍속', value: `${msToKmh(w.windSpeed)}km/h` },
    { label: '대기질', value: AIR_LABEL[aqiToAirQuality(w.aqi)] },
    { label: '시간대', value: w.isNight ? '밤' : '낮' },
    { label: 'WMO 코드', value: String(toWmoCode(w.conditionId)) },
  ]
})

weatherStore.fetchWeather()

// 상세 화면에 들어오면 배경도 그 도시로 맞춘다
watch(
  () => route.params.cityId,
  (cityId) => {
    if (cityId) weatherStore.selectCity(cityId)
  },
  { immediate: true },
)

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="detail-page">
    <template v-if="hasData">
      <DetailHero :weather="selectedWeather" :scene-label="scene.label" />

      <BaseDashboardCard title="관측값" subtitle="OpenWeather 실시간 데이터">
        <StatGrid :stats="stats" />
      </BaseDashboardCard>

      <BaseDashboardCard title="이 날씨의 공룡">
        <DinoMascotCard :weather="selectedWeather" />
      </BaseDashboardCard>
    </template>

    <BaseDashboardCard v-else-if="weatherStore.isLoading" title="불러오는 중">
      <p class="px-dim">실시간 날씨를 받아오고 있습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard v-else-if="weatherStore.errorMessage" title="불러오지 못했습니다">
      <Message severity="error" :closable="false">{{ weatherStore.errorMessage }}</Message>
      <Button
        label="다시 시도"
        icon="pi pi-refresh"
        :disabled="weatherStore.isLoading"
        @click="weatherStore.fetchWeather(true)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard v-else title="도시를 찾을 수 없습니다">
      <p class="px-dim">주소에 포함된 도시 ID를 다시 확인해 주세요.</p>
    </BaseDashboardCard>

    <Button
      label="관측소로 돌아가기"
      icon="pi pi-arrow-left"
      severity="secondary"
      @click="moveToHome"
    />
  </div>
</template>

<style scoped></style>
