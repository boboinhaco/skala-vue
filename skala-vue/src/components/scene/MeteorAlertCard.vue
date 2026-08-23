<script setup>
import { computed } from 'vue'
import { buildMeteorAlert } from '@/data/meteorAlert'
import MeteorIcon from './MeteorIcon.vue'
import IndicatorBar from './IndicatorBar.vue'

// 지표를 묶어 위협 단계를 보여준다. 그림과 막대는 하위 컴포넌트가 맡는다.
const props = defineProps({
  weather: { type: Object, default: null },
  forecast: { type: Array, default: () => [] },
})

const alert = computed(() => buildMeteorAlert({ weather: props.weather, forecast: props.forecast }))
</script>

<template>
  <div v-if="alert" class="meteor">
    <div class="meteor__head">
      <MeteorIcon :color="alert.color" :label="`위협 ${alert.level}단계 ${alert.name}`" />

      <div class="meteor__level">
        <p class="px-eyebrow">위협 {{ alert.level }}단계</p>
        <h4 :style="{ color: alert.color }">{{ alert.name }}</h4>
        <p class="meteor__note">{{ alert.note }}</p>
      </div>
    </div>

    <ul class="meteor__list">
      <IndicatorBar v-for="reading in alert.readings" :key="reading.key" :reading="reading" />
    </ul>

    <p v-if="alert.driver" class="meteor__driver">
      단계를 올린 건 <b>{{ alert.driver.label }}</b>
    </p>
  </div>

  <p v-else class="meteor__empty">날씨를 불러오면 위협도를 계산합니다.</p>
</template>

<style scoped>
.meteor__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.meteor__level h4 {
  margin: 2px 0 4px;
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

.meteor__note {
  margin: 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.meteor__list {
  margin: 14px 0 0;
  padding: 12px 0 0;
  border-top: 2px solid var(--px-edge-light);
  list-style: none;
}

.meteor__driver {
  margin: 12px 0 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.meteor__driver b {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-weight: 700;
}

.meteor__empty {
  margin: 0;
  padding: 18px 0;
  color: var(--px-ink-dim);
  font-size: 11px;
  text-align: center;
}
</style>
