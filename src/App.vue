<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Toast from 'primevue/toast'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import WeatherBar from '@/components/layout/WeatherBar.vue'
import PixelWeatherScene from '@/components/scene/PixelWeatherScene.vue'
import { useWeatherStore } from '@/stores/weatherStore'

const weatherStore = useWeatherStore()
const route = useRoute()

// 날씨와 무관한 실습 화면에서는 관측 막대를 숨긴다
const showWeatherBar = computed(() => route.name !== 'practice')
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
