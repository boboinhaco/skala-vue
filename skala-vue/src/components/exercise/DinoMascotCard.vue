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
      <div class="dino-card__figure">
        <PixelDino :dino="todayDino" :weather="dinoWeather" :size="transparent ? DINO_SIZE : 220" />
        <!-- 땅에 서 있는 것처럼 보이도록 발밑 그림자 -->
        <span
          v-if="transparent"
          class="dino-card__shadow"
          :style="{ bottom: `${shadowBottom}px` }"
          aria-hidden="true"
        ></span>
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

/* ── 배경 위에 그대로 서는 모드 ───────────────────────────── */
.dino-card--bare {
  padding: 8px 4px 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  align-items: flex-end;
  gap: 28px;
}

.dino-card__figure {
  position: relative;
  flex: 0 0 auto;
  line-height: 0;
}

/* 계단식 픽셀 그림자 */
.dino-card__shadow {
  position: absolute;
  left: 50%;
  width: 150px;
  height: 6px;
  background: rgb(4 7 14 / 34%);
  transform: translateX(-50%);
}

.dino-card__shadow::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 18px;
  width: 114px;
  height: 4px;
  background: rgb(4 7 14 / 22%);
}

/* 배경이 밝든 어둡든 읽히도록 픽셀 게임식 외곽선을 준다 */
.dino-card--bare .dino-card__copy {
  padding-bottom: 10px;
}

/* 잔디처럼 밝은 배경 위에서도 읽히도록 외곽선을 두껍게 준다 */
.dino-card--bare .eyebrow,
.dino-card--bare .tip,
.dino-card--bare .runners-up,
.dino-card--bare .dino-card__empty {
  text-shadow:
    1px 1px 0 #04070e,
    -1px 1px 0 #04070e,
    1px -1px 0 #04070e,
    -1px -1px 0 #04070e,
    0 2px 0 #04070e;
}

.dino-card--bare .comment {
  text-shadow:
    2px 2px 0 #04070e,
    -2px 2px 0 #04070e,
    2px -2px 0 #04070e,
    -2px -2px 0 #04070e,
    0 3px 0 #04070e;
}

.dino-card--bare h3 {
  font-size: 22px;
  text-shadow:
    2px 2px 0 #04070e,
    -2px 2px 0 #04070e,
    2px -2px 0 #04070e,
    -2px -2px 0 #04070e,
    0 3px 0 #04070e;
}

.dino-card--bare .comment {
  color: #fff;
  font-size: 14px;
}

.dino-card--bare .tip,
.dino-card--bare .runners-up {
  color: #e4ecf8;
}

.dino-card--bare .badges li {
  background: rgb(9 14 26 / 78%);
}

@media (max-width: 700px) {
  .dino-card--bare {
    align-items: center;
    gap: 8px;
  }

  .dino-card--bare .dino-card__copy {
    text-align: center;
  }
}
</style>
