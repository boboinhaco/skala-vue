<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 반응형 데이터는 전부 부모가 보유한다 (자식은 props로 받아 표시만 함)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 26, status: '맑음' },
  { id: 'city_02', name: '부산', temp: 30, status: '폭염' },
  { id: 'city_03', name: '대구', temp: 22, status: '비' },
  { id: 'city_04', name: '광주', temp: 28, status: '맑음' },
])

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(q))
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 : ${searchQuery.value}`)
})

const selectedCityInfo = ref('카드를 클릭하거나 검색해보세요.')
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 ${oldValue} -> ${newValue}`)
})

// SearchBar가 올려보낸 검색어를 부모 상태에 반영
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard 클릭 시 상태 바 문구 갱신
const handleSelectCard = (item) => {
  selectedCityInfo.value = `${item.name}이(가) 선택되었습니다 `
}

// WeatherCard의 상세보기 버튼
const showDetail = (item) => {
  window.alert(`${item.name}의 현재 날씨는 [${item.status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <h3>도시 검색하기</h3>
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>도시별 날씨 정보</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="handleSelectCard"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  color: #2c3e50; /* 다크 모드에서 body 텍스트 색을 상속받아 흐려지는 것 방지 */
  width: 600px;
  margin: 0 auto;
}
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
