<script setup>
import { computed } from 'vue'
import { tempColor } from '@/data/tempScale'
import { toWmoCode } from '@/data/openWeatherToWmo'
import { sceneGroupFromWmo } from '@/data/weatherScenes'
import FootprintStep from './FootprintStep.vue'
import TempLegend from './TempLegend.vue'

// 예보를 발자국 줄로 바꾼다. 발자국 하나하나는 FootprintStep 이 그린다.
const props = defineProps({
  // weatherStore.selectedForecast (3시간 간격)
  slots: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
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
      <ol class="trail__list">
        <FootprintStep v-for="step in steps" :key="step.key" :step="step" />
      </ol>
      <TempLegend align="center" />
    </template>
  </div>
</template>

<style scoped>
.trail__empty {
  margin: 0;
  padding: 26px 0;
  text-align: center;
}

.trail__list {
  display: flex;
  margin: 0;
  padding: 6px 2px 2px;
  align-items: flex-start;
  gap: 4px;
  list-style: none;
  overflow-x: auto;
}
</style>
