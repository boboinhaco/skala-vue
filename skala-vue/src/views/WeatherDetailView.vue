<script setup>
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const weatherMockData = [
  {
    id: 'city_01',
    name: '서울',
    location: '대한민국 서울특별시',
    temp: 26,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.5,
  },
  {
    id: 'city_02',
    name: '부산',
    location: '대한민국 부산광역시',
    temp: 30,
    status: '폭염',
    humidity: 62,
    windSpeed: 3.8,
  },
  {
    id: 'city_03',
    name: '대구',
    location: '대한민국 대구광역시',
    temp: 22,
    status: '비',
    humidity: 78,
    windSpeed: 2.9,
  },
  {
    id: 'city_04',
    name: '광주',
    location: '대한민국 광주광역시',
    temp: 28,
    status: '맑음',
    humidity: 58,
    windSpeed: 1.9,
  },
]

const selectedWeather = ref(null)

const selectWeather = (cityId) => {
  selectedWeather.value = weatherMockData.find((item) => item.id === cityId) ?? null
}

onMounted(() => {
  selectWeather(route.params.cityId)
})

onBeforeRouteUpdate((to) => {
  selectWeather(to.params.cityId)
})

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <main class="detail-page">
    <template v-if="selectedWeather">
      <h2>📊 지역별 상세 기상 관측 정보</h2>

      <section class="weather-detail-card">
        <h3>{{ selectedWeather.name }}</h3>
        <p>📍 지정 지역: {{ selectedWeather.location }}</p>
        <p>실시간 기온: {{ selectedWeather.temp }}°C</p>
        <p>기상 현황: {{ selectedWeather.status }}</p>
        <p>대기 습도: {{ selectedWeather.humidity }}%</p>
        <p>현재 풍속: {{ selectedWeather.windSpeed }}m/s</p>
      </section>
    </template>

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
