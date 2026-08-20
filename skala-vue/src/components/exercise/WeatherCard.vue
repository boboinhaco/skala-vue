<script setup>
// 선택된 도시 객체 하나를 전달받아 표시한다
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 전달한다
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', item)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 온도: {{ item.temp }}°C</p>

    <span v-if="item.temp >= 30" class="badge sohot"> 슈퍼핫🥵 너무 더움 (30도 이상)</span>
    <span v-else-if="item.temp >= 25 && item.temp < 30" class="badge hot">
      더움🫠 (25도 이상 30도 미만)</span
    >
    <span v-else class="badge cool"> 선선함🙂‍↔️ (25도 미만)</span>

    <button class="btn-detail" @click.stop="emit('click-detail', item)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
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
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
