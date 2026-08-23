<script setup>
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import WeatherCard from './WeatherCard.vue'

// 관측소 카드 목록. 불러오는 중 / 실패 / 비어 있음 상태를 함께 다룬다.
defineProps({
  cities: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
  loading: { type: Boolean, default: false },
  hasData: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  hiddenCount: { type: Number, default: 0 },
  emptyText: { type: String, default: '검색 결과와 일치하는 지역이 없습니다.' },
  moreLabel: { type: String, default: '더보기' },
})

defineEmits(['select', 'detail', 'retry', 'more'])
</script>

<template>
  <div class="observatory">
    <div v-if="loading && !hasData" class="observatory__loading">
      <ProgressSpinner style="width: 44px; height: 44px" :stroke-width="8" />
      <p class="px-dim">실시간 날씨를 불러오는 중입니다.</p>
    </div>

    <Message v-if="errorMessage" severity="error" :closable="false" class="observatory__error">
      <div class="observatory__error-row">
        <span>{{ errorMessage }}</span>
        <Button label="다시 시도" size="small" :disabled="loading" @click="$emit('retry')" />
      </div>
    </Message>

    <div v-if="cities.length" class="observatory__grid">
      <WeatherCard
        v-for="item in cities"
        :key="item.id"
        :item="item"
        :selected="selectedId === item.id"
        @select-card="$emit('select', $event)"
        @click-detail="$emit('detail', $event)"
      />
    </div>

    <div v-if="hiddenCount > 0" class="observatory__more">
      <Button
        :label="`${moreLabel} (${hiddenCount}곳)`"
        icon="pi pi-arrow-right"
        icon-pos="right"
        severity="secondary"
        @click="$emit('more')"
      />
    </div>

    <p v-if="!loading && !cities.length" class="observatory__empty">{{ emptyText }}</p>
  </div>
</template>

<style scoped>
.observatory__loading {
  display: flex;
  padding: 18px 0;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.observatory__loading p {
  margin: 0;
}

.observatory__error {
  margin-bottom: 12px;
}

.observatory__error-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.observatory__grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
}

.observatory__more {
  display: flex;
  margin-top: 12px;
  justify-content: center;
}

.observatory__empty {
  padding: 18px 0;
  color: var(--px-ink-dim);
  font-size: 11px;
  text-align: center;
}
</style>
