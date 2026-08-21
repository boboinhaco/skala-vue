<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherStore } from '@/stores/weatherStore'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const { configStore, formatTemperature } = useTemperature()

const selectedWeather = computed(() => {
  return weatherStore.getWeatherById(route.params.cityId)
})

weatherStore.fetchWeather()

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <main class="detail-page">
    <section
      v-if="weatherStore.isLoading && selectedWeather && selectedWeather.temp == null"
      class="weather-detail-card detail-message"
    >
      <h2>실시간 날씨를 불러오는 중입니다.</h2>
      <p>잠시만 기다려 주세요.</p>
    </section>

    <template v-else-if="selectedWeather && typeof selectedWeather.temp === 'number'">
      <h2>📊 지역별 상세 기상 관측 정보</h2>

      <section class="weather-detail-card">
        <h3>{{ selectedWeather.name }}</h3>
        <p>📍 지정 지역: {{ selectedWeather.location }}</p>
        <p>
          실시간 기온: {{ formatTemperature(selectedWeather.temp) }}{{ configStore.unitSymbol }}
        </p>
        <p>기상 현황: {{ selectedWeather.status }}</p>
        <p>대기 습도: {{ selectedWeather.humidity }}%</p>
        <p>현재 풍속: {{ selectedWeather.windSpeed }}m/s</p>
      </section>
    </template>

    <section v-else-if="weatherStore.errorMessage" class="weather-detail-card missing-city">
      <h2>날씨 정보를 불러오지 못했습니다.</h2>
      <p>{{ weatherStore.errorMessage }}</p>
      <button
        type="button"
        class="retry-button"
        :disabled="weatherStore.isLoading"
        @click="weatherStore.fetchWeather(true)"
      >
        다시 시도
      </button>
    </section>

    <section v-else class="weather-detail-card missing-city">
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>주소에 포함된 도시 ID를 다시 확인해 주세요.</p>
    </section>

    <button type="button" class="back-button" @click="moveToHome">
      ← 메인 대시보드로 돌아가기
    </button>
  </main>
</template>

<style scoped>
.detail-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  color: #2c3e50;
}

h2 {
  margin: 0 0 22px;
  color: #20364b;
  font-size: clamp(1.7rem, 4vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.weather-detail-card {
  padding: 22px;
  border: 1px solid #e1e9ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(44 62 80 / 6%);
}

.weather-detail-card h3 {
  margin: 0 0 14px;
  font-size: 1.2rem;
  font-weight: 700;
}

.weather-detail-card p {
  margin: 5px 0;
}

.missing-city {
  text-align: center;
}

.detail-message {
  text-align: center;
}

.detail-message h2,
.missing-city h2 {
  margin-bottom: 8px;
  font-size: 1.25rem;
}

.retry-button {
  margin-top: 14px;
  padding: 8px 14px;
  border: 0;
  border-radius: 8px;
  background: #249dd8;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

.retry-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.back-button {
  margin-top: 16px;
  padding: 9px 14px;
  border: 0;
  border-radius: 8px;
  background: #2c3e50;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

.back-button:hover {
  background: #1d2c3a;
}
</style>
