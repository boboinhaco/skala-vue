<script setup>
import { useTemperature } from '@/composables/useTemperature'

// 선택된 도시 객체 하나를 전달받아 표시한다
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 전달한다
const emit = defineEmits(['select-card', 'click-detail'])

const { configStore, formatTemperature } = useTemperature()
</script>

<template>
  <div class="weather-card" @click="emit('select-card', item)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p v-if="typeof item.temp === 'number'">
      현재 온도: {{ formatTemperature(item.temp) }}{{ configStore.unitSymbol }}
    </p>
    <p v-else>현재 온도: --</p>

    <template v-if="typeof item.temp === 'number'">
      <span v-if="item.temp >= 30" class="badge sohot">
        슈퍼핫🥵 너무 더움 ({{ formatTemperature(30) }}{{ configStore.unitSymbol }} 이상)
      </span>
      <span v-else-if="item.temp >= 25" class="badge hot">
        더움🫠 ({{ formatTemperature(25) }}{{ configStore.unitSymbol }} 이상
        {{ formatTemperature(30) }}{{ configStore.unitSymbol }} 미만)
      </span>
      <span v-else class="badge cool">
        선선함🙂‍↔️ ({{ formatTemperature(25) }}{{ configStore.unitSymbol }} 미만)
      </span>
    </template>
    <span v-else class="badge unavailable">실시간 데이터 없음</span>

    <button
      class="btn-detail"
      :disabled="typeof item.temp !== 'number'"
      @click.stop="emit('click-detail', item)"
    >
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  margin-bottom: 12px;
  padding: 16px 128px 16px 16px;
  background: #fff;
  border: 1px solid #dfe8ef;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}
.weather-card:hover {
  border-color: #9ed3eb;
  box-shadow: 0 6px 18px rgb(44 62 80 / 8%);
  transform: translateY(-1px);
}
.weather-card h4 {
  margin: 0 0 4px;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 800;
}
.weather-card p {
  margin: 0 0 10px;
  color: #6f8395;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.sohot {
  background-color: #ff7675;
}
.hot {
  background-color: #ebad55;
}
.cool {
  background-color: #74b9ff;
}
.unavailable {
  background-color: #95a5a6;
}
.btn-detail {
  position: absolute;
  top: 50%;
  right: 16px;
  padding: 8px 12px;
  border: 0;
  border-radius: 7px;
  background: #eaf6fc;
  color: #1678a8;
  cursor: pointer;
  font-weight: 700;
  transform: translateY(-50%);
}
.btn-detail:hover {
  background: #249dd8;
  color: #fff;
}
.btn-detail:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 520px) {
  .weather-card {
    padding-right: 16px;
  }

  .btn-detail {
    position: static;
    width: 100%;
    margin-top: 12px;
    transform: none;
  }
}
</style>
