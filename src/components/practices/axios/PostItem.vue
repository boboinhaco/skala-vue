<script setup>
import { ref, watch } from 'vue'

// 게시물 한 줄. 보기 모드와 수정 모드를 스스로 갈아끼운다.
// 수정 중인 제목(draft)은 여기서 들고 있고, 저장할 때만 부모에게 넘긴다.
const props = defineProps({
  item: { type: Object, required: true },
  editing: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'cancel', 'save', 'remove'])

const draft = ref(props.item.title)

// 수정 모드로 들어갈 때마다 현재 제목에서 다시 시작한다
watch(
  () => props.editing,
  (on) => {
    if (on) draft.value = props.item.title
  },
)
</script>

<template>
  <li class="post-item">
    <div v-if="editing" class="edit-form">
      <input
        v-model="draft"
        type="text"
        aria-label="수정할 게시물 제목"
        @keyup.enter="emit('save', draft)"
        @keyup.esc="emit('cancel')"
      />
      <button type="button" class="update-button" :disabled="saving" @click="emit('save', draft)">
        {{ saving ? '저장 중...' : 'PUT 저장' }}
      </button>
      <button type="button" class="cancel-button" @click="emit('cancel')">취소</button>
    </div>

    <template v-else>
      <div class="post-content">
        <span>ID: {{ item.serverId ?? item.id }}</span>
        <strong>{{ item.title }}</strong>
      </div>
      <div class="post-actions">
        <button type="button" class="update-button" @click="emit('edit')">PUT 수정</button>
        <button type="button" class="delete-button" :disabled="deleting" @click="emit('remove')">
          DELETE 삭제
        </button>
      </div>
    </template>
  </li>
</template>

<style scoped>
.post-item,
.edit-form,
.post-actions {
  display: flex;
  align-items: center;
}

.post-item {
  min-height: 62px;
  padding: 10px 0;
  border-top: 2px solid var(--px-edge-light);
  justify-content: space-between;
  gap: 16px;
}

.post-content {
  min-width: 0;
}

.post-content span,
.post-content strong {
  display: block;
}

.post-content span {
  color: var(--px-ink-dim);
  font-size: 11px;
}

.post-content strong {
  overflow: hidden;
  color: var(--px-ink);
  font-size: 14px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-actions,
.edit-form {
  flex: 0 0 auto;
  gap: 6px;
}

.edit-form {
  width: 100%;
}

.edit-form input {
  width: 100%;
  min-width: 0;
}

.update-button {
  background: var(--px-accent);
  color: var(--px-accent-ink);
}

.delete-button {
  background: var(--px-bad);
  color: #2b0d0d;
}

.cancel-button {
  background: #55617d;
  color: #0d1220;
}

@media (max-width: 600px) {
  .post-item,
  .edit-form {
    align-items: stretch;
    flex-direction: column;
  }

  .post-actions button,
  .edit-form button {
    flex: 1;
  }

  .post-actions {
    width: 100%;
  }
}
</style>
