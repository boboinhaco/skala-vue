<script setup>
import { useTemperature } from '@/composables/useTemperature'

// 기온 + 단위 기호를 한 곳에서 만든다.
// 카드·요약·헤더 칩·상세 화면이 전부 같은 표기를 쓰도록.
defineProps({
  temp: { type: Number, default: null },
  // 큰 숫자 옆에 단위만 작게 붙이고 싶을 때
  smallUnit: { type: Boolean, default: false },
})

const { configStore, formatTemperature } = useTemperature()
</script>

<template>
  <span class="temp">
    {{ formatTemperature(temp)
    }}<i class="temp__unit" :class="{ 'temp__unit--small': smallUnit }">{{
      configStore.unitSymbol
    }}</i>
  </span>
</template>

<style scoped>
.temp__unit {
  font-style: normal;
}

.temp__unit--small {
  font-size: 0.5em;
}
</style>
