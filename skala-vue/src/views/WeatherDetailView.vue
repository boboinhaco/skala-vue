<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import PixelWeatherChip from '@/components/scene/PixelWeatherChip.vue'
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
      <header class="detail-hero">
        <div class="detail-hero__chip">
          <PixelWeatherChip
            :weather-code="toWmoCode(selectedWeather.conditionId)"
            :is-night="selectedWeather.isNight"
          />
        </div>
        <div>
          <span class="px-eyebrow">{{ selectedWeather.location }}</span>
          <h1>{{ selectedWeather.name }}</h1>
          <p class="detail-hero__status">
            <Tag :value="scene.label" severity="info" />
            <span class="px-dim">{{ selectedWeather.status }}</span>
          </p>
        </div>
      </header>

      <BaseDashboardCard title="관측값" subtitle="OpenWeather 실시간 데이터">
        <ul class="stat-grid">
          <li v-for="s in stats" :key="s.label">
            <span class="px-dim">{{ s.label }}</span>
            <strong>{{ s.value }}</strong>
          </li>
        </ul>
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

<style scoped>
.detail-hero {
  display: flex;
  margin-bottom: 18px;
  padding: 16px;
  border: var(--px-border) solid var(--px-edge);
  align-items: center;
  gap: 16px;
  background: var(--px-panel);
  box-shadow:
    inset 0 0 0 2px var(--px-edge-light),
    var(--px-shadow);
}

.detail-hero__chip {
  flex: 0 0 auto;
  width: 120px;
  height: 84px;
  border: 2px solid var(--px-edge);
  overflow: hidden;
}

.detail-hero h1 {
  margin: 4px 0 8px;
}

.detail-hero__status {
  display: flex;
  margin: 0;
  align-items: center;
  gap: 8px;
}

.stat-grid {
  display: grid;
  margin: 0;
  padding: 0;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  list-style: none;
}

.stat-grid li {
  display: flex;
  padding: 8px 10px;
  border: 2px solid var(--px-edge);
  flex-direction: column;
  background: #0d1526;
}

.stat-grid strong {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 520px) {
  .detail-hero {
    flex-direction: column;
    text-align: center;
  }

  .detail-hero__status {
    justify-content: center;
  }
}
</style>
