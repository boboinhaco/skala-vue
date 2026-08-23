<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import UnitToggle from '@/components/exercise/UnitToggle.vue'
import DinoMascotCard from '@/components/exercise/DinoMascotCard.vue'
import PixelKoreaMap from '@/components/scene/PixelKoreaMap.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useTemperature } from '@/composables/useTemperature'
import { sceneFor } from '@/data/weatherScenes'

const router = useRouter()
const weatherStore = useWeatherStore()
const toast = useToast()
const { configStore, formatTemperature } = useTemperature()

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherStore.weatherList

  return weatherStore.weatherList.filter((item) => item.name.includes(query))
})

const lastUpdatedLabel = computed(() => {
  if (!weatherStore.lastUpdated) return '업데이트 대기 중'
  return `마지막 관측 ${weatherStore.lastUpdated.toLocaleTimeString('ko-KR')}`
})

const currentScene = computed(() => sceneFor(weatherStore.sceneCode, weatherStore.sceneIsNight))
const selected = computed(() => weatherStore.selectedWeather)
const observedCount = computed(
  () => weatherStore.weatherList.filter((item) => typeof item.temp === 'number').length,
)

onMounted(() => {
  weatherStore.fetchWeather()
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// 카드를 고르면 배경 화면이 그 도시 날씨로 바뀐다
const handleSelectCard = (item) => {
  weatherStore.selectCity(item.id)

  toast.add({
    severity: 'success',
    summary: `${item.name} 관측소`,
    detail: `배경이 '${currentScene.value.label}' 화면으로 바뀌었습니다.`,
    life: 2600,
  })
}

// 지도 마커는 도시 id만 넘겨준다
const handleSelectId = (cityId) => {
  const item = weatherStore.weatherList.find((city) => city.id === cityId)
  if (item) handleSelectCard(item)
}

const showDetail = (item) => {
  router.push({ name: 'weather-detail', params: { cityId: item.id } })
}
</script>

<template>
  <div class="dashboard">
    <!-- 왼쪽: 전국 지도 -->
    <aside class="dashboard__side">
      <BaseDashboardCard
        title="전국 관측망"
        :subtitle="`17개 시도 · ${observedCount}곳 수신`"
        class="map-card"
      >
        <PixelKoreaMap
          :cities="weatherStore.weatherList"
          :selected-id="selected?.id"
          @select="handleSelectId"
        />

        <div v-if="selected" class="side-now">
          <p class="px-eyebrow">지금 보는 곳</p>
          <h3>{{ selected.name }}</h3>
          <p class="side-now__scene">{{ currentScene.label }} · {{ selected.status }}</p>
          <ul class="side-now__stats">
            <li>
              기온
              <strong>{{ formatTemperature(selected.temp) }}{{ configStore.unitSymbol }}</strong>
            </li>
            <li>
              습도 <strong>{{ selected.humidity }}%</strong>
            </li>
          </ul>
        </div>
      </BaseDashboardCard>
    </aside>

    <!-- 오른쪽: 기존 패널들 -->
    <div class="dashboard__main">
      <header class="hero">
        <span class="px-eyebrow">MESOZOIC WEATHER STATION</span>
        <h1>오늘의 전국 날씨</h1>
        <p class="hero__lead">
          왼쪽 지도나 아래 카드를 누르면 배경이 그 지역의 하늘로 바뀝니다. 지금은
          <strong>{{ currentScene.label }}</strong> 화면입니다.
        </p>

        <div class="hero__controls">
          <UnitToggle />
          <Button
            :label="weatherStore.isLoading ? '관측 중...' : '다시 관측'"
            icon="pi pi-refresh"
            :disabled="weatherStore.isLoading"
            @click="weatherStore.fetchWeather(true)"
          />
          <span class="px-dim">{{ lastUpdatedLabel }}</span>
        </div>
      </header>

      <BaseDashboardCard title="지역 검색" subtitle="이름으로 관측소를 걸러냅니다">
        <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
      </BaseDashboardCard>

      <BaseDashboardCard title="시도별 관측소" subtitle="카드를 누르면 배경이 바뀝니다">
        <div v-if="weatherStore.isLoading && !weatherStore.hasWeatherData" class="loading">
          <ProgressSpinner style="width: 44px; height: 44px" :stroke-width="8" />
          <p class="px-dim">실시간 날씨를 불러오는 중입니다.</p>
        </div>

        <Message
          v-if="weatherStore.errorMessage"
          severity="error"
          :closable="false"
          class="error-message"
        >
          <div class="error-message__row">
            <span>{{ weatherStore.errorMessage }}</span>
            <Button
              label="다시 시도"
              size="small"
              :disabled="weatherStore.isLoading"
              @click="weatherStore.fetchWeather(true)"
            />
          </div>
        </Message>

        <div class="city-grid">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :item="item"
            :selected="selected?.id === item.id"
            @select-card="handleSelectCard"
            @click-detail="showDetail"
          />
        </div>

        <p v-if="!weatherStore.isLoading && filteredWeatherList.length === 0" class="empty">
          검색 결과와 일치하는 지역이 없습니다.
        </p>
      </BaseDashboardCard>

      <BaseDashboardCard title="오늘의 공룡" subtitle="고른 지역 날씨에 맞는 마스코트">
        <DinoMascotCard :weather="selected" />
        <Divider />
        <p class="px-dim">
          기온 · 습도 · 풍속 · 대기질을 점수로 매겨 30종 중 가장 잘 맞는 공룡을 고릅니다.
        </p>
      </BaseDashboardCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  align-items: start;
  gap: 18px;
  grid-template-columns: 320px minmax(0, 1fr);
}

/* 지도는 스크롤해도 계속 보이게 */
.dashboard__side {
  position: sticky;
  top: 96px;
}

.map-card {
  margin-bottom: 0;
}

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

/* 17개 시도라 두 줄로 벌려 담는다 */
.city-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
}

.hero {
  margin-bottom: 18px;
  padding: 18px;
  border: var(--px-border) solid var(--px-edge);
  background: var(--px-panel);
  box-shadow:
    inset 0 0 0 2px var(--px-edge-light),
    var(--px-shadow);
}

.hero h1 {
  margin: 6px 0 0;
}

.hero__lead {
  margin: 8px 0 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.hero__lead strong {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-weight: 700;
}

.hero__controls {
  display: flex;
  margin-top: 16px;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.loading {
  display: flex;
  padding: 18px 0;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.loading p {
  margin: 0;
}

.error-message {
  margin-bottom: 12px;
}

.error-message__row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.empty {
  padding: 18px 0;
  color: var(--px-ink-dim);
  font-size: 11px;
  text-align: center;
}

@media (max-width: 960px) {
  .dashboard {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard__side {
    position: static;
  }
}

@media (max-width: 560px) {
  .hero__controls {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
