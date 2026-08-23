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

// 여기서는 앞쪽 몇 곳만 보여준다. 즐겨찾기가 항상 맨 위로 올라오고,
// 나머지는 '전체 지역' 화면에서 본다.
const PREVIEW_COUNT = 6

const visibleWeatherList = computed(() => {
  const ordered = favoriteStore.sortFavoritesFirst(filteredWeatherList.value)
  const preview = ordered.slice(0, PREVIEW_COUNT)

  // 지도에서 고른 곳이 잘려 나가면 맨 앞에 끼워 넣는다
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
      <!-- 왼쪽: 전국 지도 (오른쪽 열 높이에 맞춰 늘어난다) -->
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
        subtitle="자외선 · 미세먼지 · 강수확률"
        class="extra-card"
      >
        <MeteorAlertCard :weather="selected" :forecast="weatherStore.selectedForecast" />
      </BaseDashboardCard>

      <BaseDashboardCard
        title="발자국 타임라인"
        :subtitle="selected ? `${selected.name} · 앞으로 24시간` : '앞으로 24시간'"
        class="extra-card"
      >
        <FootprintTimeline
          :slots="weatherStore.selectedForecast"
          :loading="weatherStore.isForecastLoading"
        />
      </BaseDashboardCard>
    </div>

    <!-- 좌우를 가로지르는 공룡 무대. 배경이 그대로 비쳐 보인다 -->
    <section class="dino-stage">
      <DinoMascotCard :weather="selected" transparent />
    </section>
  </div>
</template>

<style scoped>
/* 좌우 두 열은 같은 높이로. grid가 알아서 늘려주고,
   높이는 내용이 더 많은 오른쪽(지역 검색 + 시도별 관측소)이 정한다. */
.dashboard__cols {
  display: grid;
  align-items: stretch;
  gap: 18px;
  grid-template-columns: 320px minmax(0, 1fr);
}

.dashboard__side {
  min-width: 0;
}

/* 지도 카드가 오른쪽 열 높이를 그대로 따라가고,
   남는 공간은 지도가 커지면서 채운다 */
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

/* 둘째 줄도 두 카드 높이를 맞춘다 (내용이 많은 운석 경보가 기준) */
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

/* 남는 세로 공간에서는 내용을 가운데에 둔다 */
.extra-card :deep(.p-card-content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

/* 공룡은 카드 밖으로 나와 배경 위에 선다 */
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
