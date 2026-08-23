<script setup>
// 이름/값 쌍을 격자로 늘어놓는다. 관측값 표시에 쓴다.
defineProps({
  stats: { type: Array, default: () => [] },
})
</script>

<template>
  <ul class="stat-grid">
    <li v-for="stat in stats" :key="stat.label">
      <span class="px-dim">{{ stat.label }}</span>
      <strong>{{ stat.value }}</strong>
    </li>
  </ul>
</template>

<style scoped>
.stat-grid {
  display: grid;
  margin: 0;
  padding: 0;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  list-style: none;
}

.stat-grid li {
  display: flex;
  padding: 8px 10px;
  border: 2px solid var(--px-edge);
  flex-direction: column;
  background: #0d1526;
}

.stat-grid strong {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}
</style>
