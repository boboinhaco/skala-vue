<script setup>
import { computed } from 'vue'
import { tempColor } from '@/data/tempScale'
import { toWmoCode } from '@/data/openWeatherToWmo'
import { sceneGroupFromWmo } from '@/data/weatherScenes'
import FootprintStep from './FootprintStep.vue'
import TempLegend from './TempLegend.vue'
import TemperatureReading from '@/components/common/TemperatureReading.vue'

// 예보를 발자국 줄로 바꾼다. 발자국 하나하나는 FootprintStep 이 그린다.
const props = defineProps({
  // weatherStore.selectedForecast (3시간 간격)
  slots: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  // Open-Meteo 로 받은 오늘의 최고/최저 기온
  daily: { type: Object, default: null },
})

// 비가 올 만한 시간대에는 발자국 위에 빗방울을 하나 띄운다
const RAIN_HINT = 30

const steps = computed(() =>
  props.slots.map((slot, index) => ({
    key: slot.at.getTime(),
    // 좌우 발을 번갈아 디딘 것처럼 위아래로 어긋나게 찍는다
    lower: index % 2 === 1,
    flip: index % 2 === 1,
    time: slot.at.toLocaleTimeString('ko-KR', { hour: 'numeric', hour12: true }),
    temp: Math.round(slot.temp),
    color: tempColor(slot.temp),
    pop: slot.pop,
    rainy: slot.pop >= RAIN_HINT,
    group: sceneGroupFromWmo(toWmoCode(slot.conditionId)),
    isNight: slot.isNight,
  })),
)
</script>

<template>
  <div class="trail">
    <p v-if="loading && !steps.length" class="trail__empty px-dim">예보를 불러오는 중입니다.</p>
    <p v-else-if="!steps.length" class="trail__empty px-dim">
      지역을 고르면 앞으로 24시간 예보를 발자국으로 보여줍니다.
    </p>

    <template v-else>
      <p v-if="typeof daily?.tempMax === 'number'" class="trail__range">
        오늘 최고 <strong class="trail__hot"><TemperatureReading :temp="daily.tempMax" /></strong> ·
        최저 <strong class="trail__cold"><TemperatureReading :temp="daily.tempMin" /></strong>
        <span class="trail__source">기상 예보 · Open-Meteo</span>
      </p>

      <ol class="trail__list">
        <FootprintStep v-for="step in steps" :key="step.key" :step="step" />
      </ol>
      <TempLegend align="center" />
    </template>
  </div>
</template>

<style scoped>
/* 카드가 세로로 늘어나면 남는 공간은 발자국 줄이 가져간다.
   최고/최저 줄은 제목 바로 아래에 붙어 있게 된다. */
.trail {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.trail__range {
  display: flex;
  margin: 0;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.trail__range strong {
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

.trail__hot {
  color: #ef6b6b;
}

.trail__cold {
  color: #74c4ee;
}

.trail__source {
  margin-left: auto;
  color: #5f6f8f;
  font-size: 11px;
}

.trail__empty {
  margin: 0;
  padding: 26px 0;
  text-align: center;
}

.trail__list {
  display: flex;
  flex: 1;
  margin: 0;
  padding: 6px 2px 2px;
  align-items: center;
  gap: 4px;
  list-style: none;
  overflow-x: auto;
}
</style>
