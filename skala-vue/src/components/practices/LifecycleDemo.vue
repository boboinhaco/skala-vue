<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null // 실시간 타이머 메모리 주소를 담을 변수

// 생성 (Creation) 단계 = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')

// 부착 (Mounting) 단계
onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  // 실무 활용 시뮬레이션: 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 갱신 (Updating) 단계 - count가 바뀌어 화면이 리렌더링될 때마다 매번 실행된다.
onUpdated(() => {
  console.log(`3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`)
})

// 소멸 (Unmounting) 단계 - v-if="false"로 이 컴포넌트가 파괴되어 사라질 때 실행된다.
onUnmounted(() => {
  // 주의: 여기서 타이머를 안 꺼주면 컴포넌트가 사라져도 백그라운드에서 영원히 돕니다! (메모리 누수)
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div class="lifecycle-monitor">
    <p>실시간 타이머 카운트: {{ count }}</p>
    <button @click="count++">수동으로 숫자 올리기</button>
  </div>
</template>
