<script setup>
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import ObservatoryList from '@/components/exercise/ObservatoryList.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useCitySelection } from '@/composables/useCitySelection'

const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const { selectCity, openDetail } = useCitySelection()

const searchQuery = ref('')
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const matched = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherStore.weatherList

  return weatherStore.weatherList.filter((item) => item.name.includes(query))
})

const favorites = computed(() => matched.value.filter((item) => favoriteStore.isFavorite(item.id)))
const others = computed(() => matched.value.filter((item) => !favoriteStore.isFavorite(item.id)))

const selectedId = computed(() => weatherStore.selectedWeather?.id)

onMounted(() => {
  weatherStore.fetchWeather()
})
</script>

<template>
  <div class="regions">
    <BaseDashboardCard title="지역 검색" subtitle="이름으로 관측소를 걸러냅니다">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard
      v-if="favorites.length"
      title="즐겨찾기"
      :subtitle="`${favorites.length}곳`"
      class="group"
    >
      <ObservatoryList
        :cities="favorites"
        :selected-id="selectedId"
        @select="selectCity"
        @detail="openDetail"
      />
    </BaseDashboardCard>

    <BaseDashboardCard
      :title="favorites.length ? '그 밖의 지역' : '전체 지역'"
      :subtitle="`${others.length}곳 · 별을 누르면 즐겨찾기에 올라갑니다`"
      class="group"
    >
      <ObservatoryList
        :cities="others"
        :selected-id="selectedId"
        :loading="weatherStore.isLoading"
        :has-data="weatherStore.hasWeatherData"
        :error-message="weatherStore.errorMessage"
        :empty-text="
          matched.length
            ? '모든 지역이 즐겨찾기에 있습니다.'
            : '검색 결과와 일치하는 지역이 없습니다.'
        "
        @select="selectCity"
        @detail="openDetail"
        @retry="weatherStore.fetchWeather(true)"
      />
    </BaseDashboardCard>

    <div class="back-row">
      <Button
        label="관측소로 돌아가기"
        icon="pi pi-arrow-left"
        severity="secondary"
        @click="$router.push({ name: 'weather-home' })"
      />
    </div>
  </div>
</template>

<style scoped>
.group {
  margin-bottom: 18px;
}

.back-row {
  display: flex;
  justify-content: center;
}
</style>
