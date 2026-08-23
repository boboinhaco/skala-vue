<script setup>
import { computed } from 'vue'
import SelectButton from 'primevue/selectbutton'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const OPTIONS = [
  { label: '°C 섭씨', value: 'celsius' },
  { label: '°F 화씨', value: 'fahrenheit' },
]

// SelectButton은 v-model을 쓰므로 스토어 액션에 연결해준다
const unit = computed({
  get: () => configStore.unit,
  set: (value) => {
    if (value && value !== configStore.unit) configStore.toggleUnit()
  },
})
</script>

<template>
  <SelectButton
    v-model="unit"
    :options="OPTIONS"
    option-label="label"
    option-value="value"
    :allow-empty="false"
    aria-labelledby="온도 단위"
  />
</template>
