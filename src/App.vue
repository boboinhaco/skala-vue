<script setup>
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Toast from 'primevue/toast'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import WeatherBar from '@/components/layout/WeatherBar.vue'
import PixelWeatherScene from '@/components/scene/PixelWeatherScene.vue'
import { useWeatherStore } from '@/stores/weatherStore'

const weatherStore = useWeatherStore()
const route = useRoute()

// 날씨 자체가 주제가 아닌 화면에서는 관측 막대를 숨긴다
const BARE_ROUTES = ['practice', 'weather-about']
const showWeatherBar = computed(() => !BARE_ROUTES.includes(route.name))

// 배경은 모든 화면에 깔리므로 날씨는 여기서 확보한다.
// (관측 막대가 숨겨진 화면에서도 배경이 실제 날씨를 따라가야 한다)
onMounted(() => {
  weatherStore.fetchWeather()
})
</script>

<template>
  <!-- 고른 도시의 날씨가 그대로 화면 배경이 된다 -->
  <PixelWeatherScene :weather-code="weatherStore.sceneCode" :is-night="weatherStore.sceneIsNight" />

  <div class="app-shell">
    <SiteHeader />
    <WeatherBar v-if="showWeatherBar" />

    <main class="app-content">
      <RouterView />
    </main>
  </div>

  <Toast position="bottom-right" />
</template>

<style scoped src="./App.css"></style>
