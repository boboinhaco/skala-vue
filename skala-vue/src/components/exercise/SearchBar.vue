<script setup>
// 부모로부터 검색어를 전달받아 표시만 한다 (읽기 전용)
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

// 검색어가 바뀌면 부모에게 새 값을 실어 올려보낸다
const emit = defineEmits(['update-query'])
const handleInput = (e) => {
  emit('update-query', e.target.value)
}
</script>

<template>
  <div class="search-bar">
    <input type="text" :value="searchQuery" @input="handleInput" placeholder="검색할 도시 이름 입력" />
    <p>검색 중인 도시: <strong>{{ searchQuery }}</strong></p>
  </div>
</template>

<style scoped>
.search-bar input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
}
.search-bar p {
  margin-top: 8px;
}
</style>
