<script setup>
import { ref } from 'vue'

// POST 요청용 입력 폼. 입력값은 이 컴포넌트가 들고 있다가 제출할 때만 올려보낸다.
defineProps({
  pending: { type: Boolean, default: false },
})

const emit = defineEmits(['create'])

const title = ref('')

const submit = () => {
  emit('create', title.value)
  title.value = ''
}
</script>

<template>
  <form class="create-form" @submit.prevent="submit">
    <input v-model="title" type="text" placeholder="새로운 게시물 제목을 입력하세요" />
    <button type="submit" class="create-button" :disabled="pending">
      {{ pending ? '추가 중...' : 'POST 추가' }}
    </button>
  </form>
</template>

<style scoped>
.create-form {
  display: flex;
  align-items: center;
  gap: 8px;
}

input {
  width: 100%;
  min-width: 0;
}

.create-button {
  flex: 0 0 auto;
  background: var(--px-good);
  color: #05240f;
}
</style>
