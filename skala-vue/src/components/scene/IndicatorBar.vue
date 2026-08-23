<script setup>
import { THREAT_LEVELS } from '@/data/meteorAlert'

// 경보 지표 한 줄: 이름 · 값 · 5칸 막대.
defineProps({
  reading: { type: Object, required: true },
  // 값이 없을 때 '아직 받는 중'인지 '못 받았는지'를 구분해서 보여준다
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <li class="indicator">
    <div class="indicator__row">
      <span class="indicator__label">
        {{ reading.label }}
        <em v-if="reading.estimated" title="측정값이 아닌 계산 추정치">추정</em>
      </span>
      <span class="indicator__value">
        <template v-if="reading.grade !== null">
          {{ reading.value }}{{ reading.unit }} · <b>{{ reading.word }}</b>
        </template>
        <template v-else-if="loading">불러오는 중...</template>
        <template v-else>자료 없음</template>
      </span>
    </div>

    <div class="indicator__bar" role="img" :aria-label="`${reading.label} ${reading.word}`">
      <span
        v-for="step in 5"
        :key="step"
        :style="
          reading.grade !== null && step <= reading.grade + 1
            ? { background: THREAT_LEVELS[step - 1].color }
            : null
        "
      ></span>
    </div>
  </li>
</template>

<style scoped>
.indicator + .indicator {
  margin-top: 10px;
}

.indicator__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.indicator__label {
  color: var(--px-ink);
  font-size: 11px;
}

.indicator__label em {
  margin-left: 3px;
  padding: 0 3px;
  border: 1px solid var(--px-edge-light);
  color: var(--px-ink-dim);
  font-size: 11px;
  font-style: normal;
}

.indicator__value {
  color: var(--px-ink-dim);
  font-size: 11px;
}

.indicator__value b {
  color: var(--px-ink);
  font-family: var(--px-font-display);
  font-weight: 700;
}

.indicator__bar {
  display: flex;
  margin-top: 4px;
  gap: 3px;
}

.indicator__bar span {
  height: 8px;
  flex: 1;
  border: 2px solid var(--px-edge);
  background: #0b1120;
}
</style>
