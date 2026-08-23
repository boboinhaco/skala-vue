<script setup>
// 즐겨찾기 별 하나. 빈 별 <-> 노란 별만 담당한다.
defineProps({
  active: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    class="fav-star"
    :class="{ 'fav-star--on': active }"
    :aria-pressed="active"
    :aria-label="`${label} 즐겨찾기 ${active ? '해제' : '추가'}`"
    @click.stop="$emit('toggle')"
  >
    <i :class="active ? 'pi pi-star-fill' : 'pi pi-star'" aria-hidden="true"></i>
  </button>
</template>

<style scoped>
.fav-star {
  display: inline-flex;
  padding: 3px;
  border: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--px-ink-dim);
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
}

.fav-star:hover,
.fav-star--on {
  color: var(--px-accent);
}

.fav-star:focus-visible {
  outline: 3px solid var(--px-accent);
  outline-offset: 2px;
}
</style>
