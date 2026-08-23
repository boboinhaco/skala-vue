<!-- 사용 예시 -->
<script setup>
import { computed } from 'vue'
import PixelDino from './components/PixelDino.vue'
import { matchDino } from './data/matchDino'

// 네 실제 날씨 API 결과로 바꿔주면 됨
const weather = {
  temp: 28,
  humidity: 82,
  weatherCode: 61,
  wind: 6,
  isNight: false,
  airQuality: 'good',
}

const result = computed(() => matchDino(weather))
const todayDino = computed(() => result.value.best)
</script>

<template>
  <section class="dino-card">
    <PixelDino
      v-if="todayDino"
      :dino="todayDino"
      :weather="weather"
      :size="280"
    />

    <div v-if="todayDino" class="dino-card__copy">
      <p class="eyebrow">오늘의 공룡</p>
      <h2>{{ todayDino.name }}</h2>
      <p>{{ todayDino.comment }}</p>
      <small>{{ todayDino.tip }}</small>
    </div>
  </section>
</template>

<style scoped>
.dino-card {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 40px rgba(30, 50, 70, 0.12);
}

.dino-card__copy h2 {
  margin: 4px 0 10px;
}

.eyebrow {
  margin: 0;
  font-weight: 800;
  opacity: 0.55;
}
</style>
