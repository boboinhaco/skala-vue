<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import UnitToggle from '@/components/exercise/UnitToggle.vue'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherStore.weatherList

  return weatherStore.weatherList.filter((item) => item.name.includes(query))
})

const lastUpdatedLabel = computed(() => {
  if (!weatherStore.lastUpdated) return '업데이트 대기 중'
  return `마지막 업데이트: ${weatherStore.lastUpdated.toLocaleTimeString('ko-KR')}`
})

onMounted(() => {
  weatherStore.fetchWeather()
})

const selectedCityInfo = ref('카드를 클릭하거나 검색해보세요.')
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] ${oldValue} → ${newValue}`)
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const handleSelectCard = (item) => {
  selectedCityInfo.value = `${item.name}이(가) 선택되었습니다.`
}

const showDetail = (item) => {
  router.push({
    name: 'weather-detail',
    params: { cityId: item.id },
  })
}
</script>

<template>
  <main class="dashboard-wrapper">
    <header class="page-heading">
      <span class="eyebrow">LIVE WEATHER</span>
      <h1>오늘의 도시별 날씨</h1>
      <p>도시를 검색하고 카드를 눌러 상세한 기상 정보를 확인하세요.</p>

      <div class="dashboard-controls">
        <UnitToggle />
        <button
          type="button"
          class="refresh-button"
          :disabled="weatherStore.isLoading"
          @click="weatherStore.fetchWeather(true)"
        >
          {{ weatherStore.isLoading ? '업데이트 중...' : '날씨 새로고침' }}
        </button>
      </div>
      <small class="updated-at">{{ lastUpdatedLabel }}</small>
    </header>

    <BaseDashboardCard>
      <h2>🔍 도시 검색</h2>
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h2>🗺️ 지역별 날씨 현황</h2>

      <p v-if="weatherStore.isLoading && !weatherStore.hasWeatherData" class="loading-message">
        실시간 날씨 정보를 불러오는 중입니다.
      </p>

      <div v-if="weatherStore.errorMessage" class="error-banner">
        <span>{{ weatherStore.errorMessage }}</span>
        <button
          type="button"
          :disabled="weatherStore.isLoading"
          @click="weatherStore.fetchWeather(true)"
        >
          다시 시도
        </button>
      </div>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="handleSelectCard"
        @click-detail="showDetail"
      />

      <p v-if="!weatherStore.isLoading && filteredWeatherList.length === 0" class="empty-message">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </main>
</template>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  color: #2c3e50;
}

.page-heading {
  margin-bottom: 26px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 6px;
  color: #249dd8;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.page-heading h1 {
  margin: 0;
  color: #20364b;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
}

.page-heading p {
  margin: 8px 0 0;
  color: #6f8395;
}

.dashboard-controls {
  display: flex;
  margin-top: 18px;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dashboard-controls :deep(.unit-toggle) {
  margin-top: 0;
}

.refresh-button,
.error-banner button {
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  background: #2c3e50;
  color: #fff;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: 700;
}

.refresh-button:disabled,
.error-banner button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.updated-at {
  display: block;
  margin-top: 8px;
  color: #8ba0b2;
  font-size: 0.76rem;
}

h2 {
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
  color: #34495e;
  font-size: 1.1rem;
  font-weight: 700;
}

.status-bar {
  padding: 12px 16px;
  border: 1px solid #cde9d2;
  border-radius: 10px;
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 700;
  text-align: center;
}

.empty-message {
  padding: 20px 0;
  color: #7f8c8d;
  text-align: center;
}

.loading-message {
  padding: 22px 0;
  color: #52758c;
  text-align: center;
}

.error-banner {
  display: flex;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid #f1c5c5;
  border-radius: 9px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff6f6;
  color: #b33a3a;
  font-size: 0.86rem;
}

.error-banner button {
  flex: 0 0 auto;
  padding: 7px 10px;
  background: #c94a4a;
}

@media (max-width: 520px) {
  .page-heading p {
    font-size: 0.9rem;
  }

  .dashboard-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }
}
</style>
