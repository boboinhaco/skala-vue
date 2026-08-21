import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0) //원본 데이터(state)
  const doubleCount = computed(() => count.value * 2) //읽기 전용 값 (state를 이용해 계산한)
  //state 변경 함수
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment } //외부공개
})
