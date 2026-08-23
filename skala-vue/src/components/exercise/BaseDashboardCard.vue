<!-- 화면 곳곳에서 쓰는 공통 패널. PrimeVue Card를 픽셀 스타일로 감쌌다. -->
<script setup>
import Card from 'primevue/card'

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <Card class="dash-card">
    <template v-if="title" #title>{{ title }}</template>
    <template v-if="subtitle" #subtitle>{{ subtitle }}</template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>

<style scoped>
.dash-card {
  margin-bottom: 18px;
}
</style>
