<script setup>
import { computed } from 'vue'
import PixelDino from '@/components/PixelDino.vue'
import { matchDino } from '@/data/matchDino'
import { toDinoWeather } from '@/data/openWeatherToWmo'

// 스토어의 도시 날씨 항목 하나를 그대로 받는다
const props = defineProps({
  weather: {
    type: Object,
    default: null,
  },
})

// OpenWeather 응답 -> 공룡 매칭이 이해하는 형태로 변환 (데이터가 없으면 null)
const dinoWeather = computed(() => toDinoWeather(props.weather))

const result = computed(() => (dinoWeather.value ? matchDino(dinoWeather.value) : null))
const todayDino = computed(() => result.value?.best ?? null)
const runnersUp = computed(() => result.value?.runnersUp ?? [])

const AIR_QUALITY_LABEL = {
  good: '좋음',
  bad: '나쁨',
  veryBad: '매우 나쁨',
}

// 어떤 값으로 공룡이 정해졌는지 보여주는 요약 배지
const conditionBadges = computed(() => {
  const w = dinoWeather.value
  if (!w) return []

  return [
    `${Math.round(w.temp)}°C`,
    `습도 ${w.humidity}%`,
    `바람 ${w.wind}km/h`,
    `대기질 ${AIR_QUALITY_LABEL[w.airQuality]}`,
    w.isNight ? '밤' : '낮',
  ]
})
</script>

<template>
  <section class="dino-card">
    <template v-if="todayDino">
      <PixelDino :dino="todayDino" :weather="dinoWeather" :size="220" />

      <div class="dino-card__copy">
        <p class="eyebrow">{{ weather.name }}의 오늘 공룡</p>
        <h3>{{ todayDino.name }}</h3>
        <p class="comment">{{ todayDino.comment }}</p>
        <small class="tip">💡 {{ todayDino.tip }}</small>

        <ul class="badges">
          <li v-for="badge in conditionBadges" :key="badge">{{ badge }}</li>
        </ul>

        <p v-if="runnersUp.length" class="runners-up">
          다음 후보: {{ runnersUp.map((dino) => dino.name).join(', ') }}
        </p>
      </div>
    </template>

    <p v-else class="dino-card__empty">날씨 정보를 불러오면 오늘의 공룡을 골라드립니다.</p>
  </section>
</template>

<style scoped>
.dino-card {
  display: flex;
  padding: 14px;
  border: var(--px-border) solid var(--px-edge);
  align-items: center;
  gap: 16px;
  background: var(--px-panel-soft);
  box-shadow: var(--px-shadow-sm);
}

.dino-card__copy {
  flex: 1;
  min-width: 0;
}

.dino-card__empty {
  padding: 20px 0;
  width: 100%;
  color: var(--px-ink-dim);
  font-size: 11px;
  text-align: center;
}

.eyebrow {
  margin: 0;
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.dino-card__copy h3 {
  margin: 4px 0 8px;
  font-size: 22px;
}

.comment {
  margin: 0 0 8px;
  color: var(--px-ink);
  font-size: 14px;
  line-height: 1.6;
}

.tip {
  display: block;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.badges {
  display: flex;
  margin: 12px 0 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 5px;
  list-style: none;
}

.badges li {
  padding: 2px 7px;
  border: 2px solid var(--px-edge);
  background: #0d1526;
  color: var(--px-cool);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
}

.runners-up {
  margin: 10px 0 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

@media (max-width: 560px) {
  .dino-card {
    flex-direction: column;
    text-align: center;
  }

  .badges {
    justify-content: center;
  }
}
</style>
