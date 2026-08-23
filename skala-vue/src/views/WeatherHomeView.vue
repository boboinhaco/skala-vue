<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import DinoMascotCard from '@/components/exercise/DinoMascotCard.vue'
import PixelKoreaMap from '@/components/scene/PixelKoreaMap.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useTemperature } from '@/composables/useTemperature'
import { useCitySelection } from '@/composables/useCitySelection'
import { sceneFor } from '@/data/weatherScenes'

const router = useRouter()
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const { configStore, formatTemperature } = useTemperature()
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
          :subtitle="`17개 시도 · ${observedCount}곳 수신`"
          class="map-card"
        >
          <PixelKoreaMap
            :cities="weatherStore.weatherList"
            :selected-id="selected?.id"
            @select="selectCityById"
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
              v-for="item in visibleWeatherList"
              :key="item.id"
              :item="item"
              :selected="selected?.id === item.id"
              @select-card="selectCity"
              @click-detail="openDetail"
            />
          </div>

          <div v-if="hiddenCount > 0" class="more-row">
            <Button
              :label="`더보기 (${hiddenCount}곳)`"
              icon="pi pi-arrow-right"
              icon-pos="right"
              severity="secondary"
              @click="router.push({ name: 'regions' })"
            />
          </div>

          <p v-if="!weatherStore.isLoading && filteredWeatherList.length === 0" class="empty">
            검색 결과와 일치하는 지역이 없습니다.
          </p>
        </BaseDashboardCard>
      </div>
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

.city-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
}

.more-row {
  display: flex;
  margin-top: 12px;
  justify-content: center;
}

/* 공룡은 카드 밖으로 나와 배경 위에 선다 */
.dino-stage {
  margin-top: 6px;
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
  .dashboard__cols {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-card {
    height: auto;
    margin-bottom: 18px;
  }
}
</style>
