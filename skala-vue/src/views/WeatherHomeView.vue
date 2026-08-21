<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

const router = useRouter()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 26, status: '맑음' },
  { id: 'city_02', name: '부산', temp: 30, status: '폭염' },
  { id: 'city_03', name: '대구', temp: 22, status: '비' },
  { id: 'city_04', name: '광주', temp: 28, status: '맑음' },
])

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value}`)
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
    </header>

    <BaseDashboardCard>
      <h2>🔍 도시 검색</h2>
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h2>🗺️ 지역별 날씨 현황</h2>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="handleSelectCard"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-message">
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

@media (max-width: 520px) {
  .page-heading p {
    font-size: 0.9rem;
  }
}
</style>
