<script setup>
import Tag from 'primevue/tag'
import PixelWeatherChip from '@/components/scene/PixelWeatherChip.vue'
import { toWmoCode } from '@/data/openWeatherToWmo'

// 상세 화면 맨 위: 그 지역 하늘 미리보기 + 이름 + 현재 날씨.
defineProps({
  weather: { type: Object, required: true },
  sceneLabel: { type: String, default: '' },
})
</script>

<template>
  <header class="detail-hero">
    <div class="detail-hero__chip">
      <PixelWeatherChip
        :weather-code="toWmoCode(weather.conditionId)"
        :is-night="weather.isNight"
      />
    </div>

    <div>
      <span class="px-eyebrow">{{ weather.location }}</span>
      <h1>{{ weather.name }}</h1>
      <p class="detail-hero__status">
        <Tag :value="sceneLabel" severity="info" />
        <span class="px-dim">{{ weather.status }}</span>
      </p>
    </div>
  </header>
</template>

<style scoped>
.detail-hero {
  display: flex;
  margin-bottom: 18px;
  padding: 16px;
  border: var(--px-border) solid var(--px-edge);
  align-items: center;
  gap: 16px;
  background: var(--px-panel);
  box-shadow:
    inset 0 0 0 2px var(--px-edge-light),
    var(--px-shadow);
}

.detail-hero__chip {
  flex: 0 0 auto;
  width: 120px;
  height: 84px;
  border: 2px solid var(--px-edge);
  overflow: hidden;
}

.detail-hero h1 {
  margin: 4px 0 8px;
}

.detail-hero__status {
  display: flex;
  margin: 0;
  align-items: center;
  gap: 8px;
}

@media (max-width: 520px) {
  .detail-hero {
    flex-direction: column;
    text-align: center;
  }

  .detail-hero__status {
    justify-content: center;
  }
}
</style>
