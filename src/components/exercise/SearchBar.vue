<script setup>
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

// 부모로부터 검색어를 전달받아 표시만 한다 (읽기 전용)
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

// 검색어가 바뀌면 부모에게 새 값을 실어 올려보낸다
const emit = defineEmits(['update-query'])
const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        fluid
        @input="handleInput"
      />
    </IconField>

    <p class="px-dim">
      검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar p {
  margin: 8px 0 0;
}

.search-bar strong {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-weight: 700;
}
</style>
