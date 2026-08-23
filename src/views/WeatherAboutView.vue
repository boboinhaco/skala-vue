<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import { SCENE_GROUPS } from '@/data/weatherScenes'
import SceneGallery from '@/components/scene/SceneGallery.vue'

const router = useRouter()

// 그룹마다 대표 WMO 코드 하나씩 (미리보기용)
const SAMPLES = [
  { group: 'clear', code: 0, label: '맑음' },
  { group: 'cloudy', code: 3, label: '흐림' },
  { group: 'fog', code: 45, label: '안개' },
  { group: 'drizzle', code: 53, label: '이슬비' },
  { group: 'rain', code: 63, label: '비' },
  { group: 'shower', code: 81, label: '소나기' },
  { group: 'snow', code: 73, label: '눈' },
  { group: 'thunder', code: 95, label: '뇌우' },
]

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="about-page">
    <header class="about-hero">
      <span class="px-eyebrow">ABOUT</span>
      <h1>중생대 날씨 관측소</h1>
      <p class="px-dim">
        실시간 날씨를 받아 배경 화면과 마스코트 공룡을 함께 바꾸는 Vue 3 실습 대시보드입니다.
      </p>
    </header>

    <BaseDashboardCard title="날씨별 화면" subtitle="8가지 하늘 · 낮과 밤 각각">
      <SceneGallery :samples="SAMPLES" />
      <p class="px-dim">총 {{ SCENE_GROUPS.length * 2 }}가지 화면이 준비돼 있습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="쓰인 기술" subtitle="실습 범위">
      <ul class="tech-list">
        <li>Vue 3 <code>script setup</code> · Pinia 스토어 · Vue Router</li>
        <li>OpenWeather 현재날씨 + 대기질 API 연동</li>
        <li>PrimeVue 컴포넌트를 픽셀 테마로 덮어쓴 UI</li>
        <li>SVG 픽셀 배경과 30종 공룡 마스코트 스프라이트</li>
      </ul>

      <Divider />

      <Button label="관측소로 돌아가기" icon="pi pi-home" @click="moveToHome" />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.about-hero {
  margin-bottom: 20px;
  padding: 18px;
  border: var(--px-border) solid var(--px-edge);
  background: var(--px-panel);
  box-shadow:
    inset 0 0 0 2px var(--px-edge-light),
    var(--px-shadow);
}

.about-hero h1 {
  margin: 6px 0 8px;
}

.about-hero p {
  margin: 0;
}

.tech-list {
  margin: 0 0 4px;
  padding-left: 18px;
  color: var(--px-ink);
  font-size: 14px;
}

.tech-list li {
  margin-bottom: 4px;
}

code {
  padding: 1px 5px;
  border: 2px solid var(--px-edge);
  background: #0b1120;
  color: var(--px-cool);
  font-family: var(--px-font);
  font-size: 11px;
}
</style>
