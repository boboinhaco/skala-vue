<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <span class="px-eyebrow">ERROR 404</span>
    <h1>길을 잃었습니다</h1>
    <p class="px-dim">
      요청하신 주소는 중생대 어디에도 없습니다. 관측소로 돌아가 다시 시도해 주세요.
    </p>
    <Button
      label="관측소로 돌아가기"
      icon="pi pi-home"
      @click="router.push({ name: 'weather-home' })"
    />
  </div>
</template>

<style scoped>
.not-found {
  padding: 40px 24px;
  border: var(--px-border) solid var(--px-edge);
  background: var(--px-panel);
  box-shadow:
    inset 0 0 0 2px var(--px-edge-light),
    var(--px-shadow);
  text-align: center;
}

.not-found h1 {
  margin: 8px 0 10px;
}

.not-found p {
  margin: 0 auto 20px;
  max-width: 380px;
}
</style>
