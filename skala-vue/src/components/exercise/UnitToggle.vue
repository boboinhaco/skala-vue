<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const currentUnitName = computed(() => {
  return configStore.unit === 'celsius' ? '섭씨' : '화씨'
})

const nextUnitName = computed(() => {
  return configStore.unit === 'celsius' ? '화씨' : '섭씨'
})
</script>

<template>
  <div class="unit-toggle">
    <span class="current-unit"
      >현재 단위: {{ currentUnitName }} ({{ configStore.unitSymbol }})</span
    >
    <button type="button" @click="configStore.toggleUnit">{{ nextUnitName }}로 변경</button>
  </div>
</template>

<style scoped>
.unit-toggle {
  display: flex;
  width: fit-content;
  margin-top: 18px;
  padding: 6px;
  border: 1px solid #d9e5ed;
  border-radius: 10px;
  align-items: center;
  gap: 10px;
  background: rgb(255 255 255 / 85%);
  box-shadow: 0 4px 14px rgb(44 62 80 / 5%);
}

.current-unit {
  padding-left: 8px;
  color: #536a7e;
  font-size: 0.86rem;
  font-weight: 700;
}

button {
  padding: 7px 12px;
  border: 0;
  border-radius: 7px;
  background: #249dd8;
  color: #fff;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: 700;
  transition: background 0.2s ease;
}

button:hover {
  background: #1678a8;
}

@media (max-width: 420px) {
  .unit-toggle {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
