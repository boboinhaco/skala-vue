<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import ObservatoryList from '@/components/exercise/ObservatoryList.vue'
import SelectedSummary from '@/components/exercise/SelectedSummary.vue'
import DinoMascotCard from '@/components/exercise/DinoMascotCard.vue'
import PixelKoreaMap from '@/components/scene/PixelKoreaMap.vue'
import MeteorAlertCard from '@/components/scene/MeteorAlertCard.vue'
import FootprintTimeline from '@/components/scene/FootprintTimeline.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useCitySelection } from '@/composables/useCitySelection'
import { sceneFor } from '@/data/weatherScenes'

const router = useRouter()
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const { selectCity, selectCityById, openDetail } = useCitySelection()

const searchQuery = ref('')
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherStore.weatherList

  return weatherStore.weatherList.filter((item) => item.name.includes(query))
})

const currentScene = computed(() => sceneFor(weatherStore.sceneCode, weatherStore.sceneIsNight))
const selected = computed(() => weatherStore.selectedWeather)

const PREVIEW_COUNT = 6

const visibleWeatherList = computed(() => {
  const ordered = favoriteStore.sortFavoritesFirst(filteredWeatherList.value)
  const preview = ordered.slice(0, PREVIEW_COUNT)

  const picked = selected.value
  if (picked && ordered.includes(picked) && !preview.includes(picked)) {
    return [picked, ...preview.slice(0, PREVIEW_COUNT - 1)]
  }
  return preview
})

const hiddenCount = computed(() =>
  Math.max(0, filteredWeatherList.value.length - visibleWeatherList.value.length),
)

const observedCount = computed(
  () => weatherStore.weatherList.filter((item) => typeof item.temp === 'number').length,
)

onMounted(() => {
  weatherStore.fetchWeather()
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__cols">
      <aside class="dashboard__side">
        <BaseDashboardCard
          title="전국 관측망"
          :subtitle="`전국 ${weatherStore.weatherList.length}곳 · ${observedCount}곳 수신`"
          class="map-card"
        >
          <PixelKoreaMap
            :cities="weatherStore.weatherList"
            :selected-id="selected?.id"
            @select="selectCityById"
          />

          <SelectedSummary :weather="selected" :scene-label="currentScene.label" />
        </BaseDashboardCard>
      </aside>

      <!-- 오른쪽: 검색 + 관측소 목록 -->
      <div class="dashboard__main">
        <BaseDashboardCard title="지역 검색" subtitle="이름으로 관측소를 걸러냅니다">
          <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
        </BaseDashboardCard>

        <BaseDashboardCard
          title="시도별 관측소"
          :subtitle="
            favoriteStore.count
              ? `즐겨찾기 ${favoriteStore.count}곳이 맨 위에 있습니다`
              : '별을 누르면 즐겨찾기에 올라갑니다'
          "
          class="city-card"
        >
          <ObservatoryList
            :cities="visibleWeatherList"
            :selected-id="selected?.id"
            :loading="weatherStore.isLoading"
            :has-data="weatherStore.hasWeatherData"
            :error-message="weatherStore.errorMessage"
            :hidden-count="hiddenCount"
            @select="selectCity"
            @detail="openDetail"
            @retry="weatherStore.fetchWeather(true)"
            @more="router.push({ name: 'regions' })"
          />
        </BaseDashboardCard>
      </div>
    </div>

    <!-- 경보 + 시간별 예보 -->
    <div class="dashboard__cols dashboard__cols--extra">
      <BaseDashboardCard
        title="운석 경보"
        subtitle="자외선 · 미세먼지 · 오존 · 강수확률"
        class="extra-card"
      >
        <MeteorAlertCard
          :weather="selected"
          :forecast="weatherStore.selectedForecast"
          :air="weatherStore.selectedOpenMeteo"
          :loading="weatherStore.isOpenMeteoLoading"
        />
      </BaseDashboardCard>

      <BaseDashboardCard
        title="발자국 타임라인"
        :subtitle="selected ? `${selected.name} · 앞으로 24시간` : '앞으로 24시간'"
        class="extra-card"
      >
        <FootprintTimeline
          :slots="weatherStore.selectedForecast"
          :loading="weatherStore.isForecastLoading"
          :daily="weatherStore.selectedOpenMeteo"
        />
      </BaseDashboardCard>
    </div>

    <section class="dino-stage">
      <DinoMascotCard :weather="selected" transparent />
    </section>
  </div>
</template>

<style scoped>
.dashboard__cols {
  display: grid;
  align-items: stretch;
  gap: 18px;
  grid-template-columns: 320px minmax(0, 1fr);
}

.dashboard__side {
  min-width: 0;
}

.map-card {
  height: 100%;
  margin-bottom: 0;
}

.map-card :deep(.p-card-body) {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.map-card :deep(.p-card-content) {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}

.city-card {
  margin-bottom: 0;
}

.dashboard__cols--extra {
  margin-top: 18px;
}

.extra-card {
  height: 100%;
  margin-bottom: 0;
}

.extra-card :deep(.p-card-body) {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.extra-card :deep(.p-card-content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.dino-stage {
  margin-top: 6px;
}

@media (max-width: 960px) {
  .dashboard__cols {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-card {
    height: auto;
    margin-bottom: 18px;
  }
}
</style>
