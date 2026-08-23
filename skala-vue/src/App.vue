<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import PixelWeatherScene from '@/components/scene/PixelWeatherScene.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { sceneFor } from '@/data/weatherScenes'
import { computed } from 'vue'

const weatherStore = useWeatherStore()

// 고른 도시의 날씨가 그대로 배경이 된다
const scene = computed(() => sceneFor(weatherStore.sceneCode, weatherStore.sceneIsNight))
</script>

<template>
  <PixelWeatherScene :weather-code="weatherStore.sceneCode" :is-night="weatherStore.sceneIsNight" />

  <div class="app-shell">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" :to="{ name: 'weather-home' }">
          <span class="brand-mark" aria-hidden="true">🦕</span>
          <span class="brand-text">
            <strong>SKALA WEATHER</strong>
            <small>중생대 날씨 관측소</small>
          </span>
        </RouterLink>

        <nav class="main-nav" aria-label="주요 메뉴">
          <RouterLink :to="{ name: 'weather-home' }">관측소</RouterLink>
          <RouterLink :to="{ name: 'weather-about' }">소개</RouterLink>
          <RouterLink :to="{ name: 'practice' }">실습</RouterLink>
        </nav>
      </div>

      <div class="scene-strip">
        <span class="scene-strip__dot" aria-hidden="true"></span>
        지금 배경: {{ scene.label }}
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>

  <Toast position="bottom-right" />
</template>

<style scoped>
.app-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 3px solid var(--px-edge);
  background: rgb(9 13 26 / 92%);
  backdrop-filter: blur(2px);
}

.header-inner {
  display: flex;
  width: min(100% - 32px, 1140px);
  min-height: 68px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--px-ink);
  text-decoration: none;
}

.brand-mark {
  font-size: 26px;
  line-height: 1;
}

.brand-text strong,
.brand-text small {
  display: block;
}

.brand-text strong {
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-text small {
  color: var(--px-ink-dim);
  font-size: 11px;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.main-nav a {
  padding: 7px 12px;
  border: 2px solid var(--px-edge);
  background: var(--px-panel-soft);
  color: var(--px-ink-dim);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
}

.main-nav a:hover {
  background: #2b3960;
  color: var(--px-ink);
}

.main-nav a.router-link-exact-active {
  background: var(--px-accent);
  color: var(--px-accent-ink);
}

/* 지금 어떤 날씨 배경인지 알려주는 띠 */
.scene-strip {
  display: flex;
  padding: 5px 0;
  width: min(100% - 32px, 1140px);
  margin: 0 auto;
  align-items: center;
  gap: 7px;
  border-top: 2px solid var(--px-edge-light);
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
}

.scene-strip__dot {
  width: 6px;
  height: 6px;
  background: var(--px-accent);
  animation: blink 1.6s steps(2, end) infinite;
}

@keyframes blink {
  50% {
    opacity: 0.2;
  }
}

.app-content {
  width: min(100% - 32px, 1140px);
  margin: 0 auto;
  padding: 28px 0 64px;
}

@media (prefers-reduced-motion: reduce) {
  .scene-strip__dot {
    animation: none;
  }
}

@media (max-width: 680px) {
  .header-inner {
    padding: 12px 0;
    flex-direction: column;
    gap: 10px;
  }

  .main-nav {
    width: 100%;
  }

  .main-nav a {
    flex: 1;
    text-align: center;
  }
}
</style>
