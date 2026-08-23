<script setup>
import { computed } from 'vue'
import PixelDino from '@/components/PixelDino.vue'
import { matchDino } from '@/data/matchDino'
import { toDinoWeather } from '@/data/openWeatherToWmo'
import { getDinoGrid, GRID_W, GRID_H } from '@/data/dinoSprites'

// 스토어의 도시 날씨 항목 하나를 그대로 받는다
const props = defineProps({
  weather: {
    type: Object,
    default: null,
  },
  // 카드 껍데기를 벗고 배경 위에 바로 서 있는 모습으로
  transparent: {
    type: Boolean,
    default: false,
  },
})

// OpenWeather 응답 -> 공룡 매칭이 이해하는 형태로 변환 (데이터가 없으면 null)
const dinoWeather = computed(() => toDinoWeather(props.weather))

const result = computed(() => (dinoWeather.value ? matchDino(dinoWeather.value) : null))
const todayDino = computed(() => result.value?.best ?? null)
const runnersUp = computed(() => result.value?.runnersUp ?? [])

// 발밑 그림자를 정확한 자리에 두려면 스프라이트마다 다른 '발 높이'를 알아야 한다.
// 체형에 따라 아래쪽 빈 줄 수가 달라서 고정값으로는 그림자가 뜬다.
const DINO_SIZE = 300
const dinoHeight = DINO_SIZE * (GRID_H / GRID_W)

const shadowBottom = computed(() => {
  if (!todayDino.value) return 0
  // 날씨 효과(빗줄기 등)는 화면 전체를 채우므로 몸통만으로 계산한다
  const grid = getDinoGrid(todayDino.value, null)
  let last = GRID_H - 1
  while (last > 0 && !/[^.]/.test(grid[last])) last -= 1
  return ((GRID_H - 1 - last) / GRID_H) * dinoHeight
})

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
  <section class="dino-card" :class="{ 'dino-card--bare': transparent }">
    <template v-if="todayDino">
      <!-- 공룡이 걸어다니는 자리.
           이동(walk)과 방향 전환(turn)을 따로 둬야 PixelDino 자체의
           몸짓(덜덜 떨기 등)과 transform 이 부딪히지 않는다. -->
      <div class="dino-card__field">
        <div class="dino-card__walk">
          <div class="dino-card__turn">
            <PixelDino
              :dino="todayDino"
              :weather="dinoWeather"
              :size="transparent ? DINO_SIZE : 220"
            />
            <!-- 땅에 서 있는 것처럼 보이도록 발밑 그림자 -->
            <span
              v-if="transparent"
              class="dino-card__shadow"
              :style="{ bottom: `${shadowBottom}px` }"
              aria-hidden="true"
            ></span>
          </div>
        </div>
      </div>

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

<style scoped src="./DinoMascotCard.css"></style>
