<script setup>
// 요청 결과 알림. 성공은 조용히 읽히고(polite), 실패는 즉시 읽히도록(alert) 구분한다.
defineProps({
  text: { type: String, default: '' },
  tone: { type: String, default: 'success' },
})
</script>

<template>
  <p
    v-if="text"
    class="message"
    :class="tone"
    :role="tone === 'error' ? 'alert' : undefined"
    :aria-live="tone === 'error' ? undefined : 'polite'"
  >
    {{ text }}
  </p>
</template>

<style scoped>
.message {
  margin: 10px 0;
  padding: 8px 10px;
  border: 2px solid var(--px-edge);
  font-size: 11px;
}

.message.success {
  background: #0e2018;
  color: #b6e6c6;
}

.message.error {
  background: #2a1118;
  color: #ffc7c7;
}
</style>
