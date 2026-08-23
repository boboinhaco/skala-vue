<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'
let nextLocalId = -1

const items = ref([])
const newTitle = ref('')
const editingId = ref(null)
const editTitle = ref('')
const isLoading = ref(false)
const pendingAction = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const clearMessage = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const handleRead = async () => {
  isLoading.value = true
  clearMessage()

  try {
    const response = await axios.get(BASE_URL, {
      params: { _limit: 3 },
    })

    items.value = response.data
    successMessage.value = 'GET 요청으로 게시물 3건을 불러왔습니다.'
  } catch (error) {
    console.error('GET 요청 실패:', error)
    errorMessage.value = '게시물을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleCreate = async () => {
  const title = newTitle.value.trim()
  if (!title) {
    errorMessage.value = '추가할 게시물 제목을 입력해 주세요.'
    return
  }

  pendingAction.value = 'create'
  clearMessage()

  try {
    const response = await axios.post(BASE_URL, {
      title,
      body: '',
      userId: 1,
    })

    items.value.unshift({
      ...response.data,
      id: nextLocalId--,
      serverId: response.data.id,
      isLocal: true,
    })
    newTitle.value = ''
    successMessage.value = 'POST 요청이 성공했습니다.'
  } catch (error) {
    console.error('POST 요청 실패:', error)
    errorMessage.value = '게시물을 추가하지 못했습니다.'
  } finally {
    pendingAction.value = ''
  }
}

const startEdit = (item) => {
  editingId.value = item.id
  editTitle.value = item.title
  clearMessage()
}

const cancelEdit = () => {
  editingId.value = null
  editTitle.value = ''
}

const handleUpdate = async (item) => {
  const title = editTitle.value.trim()
  if (!title) {
    errorMessage.value = '수정할 제목을 입력해 주세요.'
    return
  }

  pendingAction.value = `update-${item.id}`
  clearMessage()

  try {
    let updatedItem = { ...item, title }

    if (!item.isLocal) {
      const response = await axios.put(`${BASE_URL}/${item.id}`, {
        ...item,
        title,
      })
      updatedItem = response.data
    }

    items.value = items.value.map((currentItem) =>
      currentItem.id === item.id ? { ...updatedItem, isLocal: item.isLocal } : currentItem,
    )
    cancelEdit()
    successMessage.value = 'PUT 요청을 반영해 게시물을 수정했습니다.'
  } catch (error) {
    console.error('PUT 요청 실패:', error)
    errorMessage.value = '게시물을 수정하지 못했습니다.'
  } finally {
    pendingAction.value = ''
  }
}

const handleDelete = async (item) => {
  pendingAction.value = `delete-${item.id}`
  clearMessage()

  try {
    if (!item.isLocal) {
      await axios.delete(`${BASE_URL}/${item.id}`)
    }

    items.value = items.value.filter((currentItem) => currentItem.id !== item.id)
    successMessage.value = 'DELETE 요청을 반영해 게시물을 삭제했습니다.'
  } catch (error) {
    console.error('DELETE 요청 실패:', error)
    errorMessage.value = '게시물을 삭제하지 못했습니다.'
  } finally {
    pendingAction.value = ''
  }
}

onMounted(handleRead)
</script>

<template>
  <section class="axios-json-practice">
    <div class="section-heading">
      <div>
        <span class="eyebrow">AXIOS · REST API</span>
        <h2>Axios CRUD 프로토타입 훈련</h2>
      </div>
      <button type="button" class="reload-button" :disabled="isLoading" @click="handleRead">
        {{ isLoading ? '불러오는 중...' : 'GET 새로고침' }}
      </button>
    </div>

    <form class="create-form" @submit.prevent="handleCreate">
      <input v-model="newTitle" type="text" placeholder="새로운 게시물 제목을 입력하세요" />
      <button type="submit" class="create-button" :disabled="pendingAction === 'create'">
        {{ pendingAction === 'create' ? '추가 중...' : 'POST 추가' }}
      </button>
    </form>

    <p class="api-notice">
      JSONPlaceholder는 실습용 API이므로 수정 결과는 현재 화면에만 반영되며 서버에 영구 저장되지
      않습니다.
    </p>

    <p v-if="successMessage" class="message success" aria-live="polite">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="message error" role="alert">
      {{ errorMessage }}
    </p>

    <p v-if="isLoading" class="loading-message">게시물 데이터를 불러오는 중입니다.</p>

    <ul v-else class="post-list">
      <li v-for="item in items" :key="item.id" class="post-item">
        <div v-if="editingId === item.id" class="edit-form">
          <input
            v-model="editTitle"
            type="text"
            aria-label="수정할 게시물 제목"
            @keyup.enter="handleUpdate(item)"
            @keyup.esc="cancelEdit"
          />
          <button
            type="button"
            class="update-button"
            :disabled="pendingAction === `update-${item.id}`"
            @click="handleUpdate(item)"
          >
            PUT 저장
          </button>
          <button type="button" class="cancel-button" @click="cancelEdit">취소</button>
        </div>

        <template v-else>
          <div class="post-content">
            <span>ID: {{ item.serverId ?? item.id }}</span>
            <strong>{{ item.title }}</strong>
          </div>
          <div class="post-actions">
            <button type="button" class="update-button" @click="startEdit(item)">PUT 수정</button>
            <button
              type="button"
              class="delete-button"
              :disabled="pendingAction === `delete-${item.id}`"
              @click="handleDelete(item)"
            >
              DELETE 삭제
            </button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.axios-json-practice {
  margin-top: 20px;
  padding: 16px 18px;
  border: var(--px-border) solid var(--px-edge);
  background: var(--px-panel-soft);
  box-shadow: var(--px-shadow-sm);
  color: var(--px-ink);
}

.section-heading,
.create-form,
.post-item,
.edit-form,
.post-actions {
  display: flex;
  align-items: center;
}

.section-heading {
  margin-bottom: 14px;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

h2 {
  margin: 4px 0 0;
  color: var(--px-ink);
  font-family: var(--px-font-display);
  font-size: 22px;
  font-weight: 700;
}

.reload-button {
  background: var(--px-panel-soft);
}

.create-form {
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

.api-notice {
  margin: 10px 0 12px;
  color: var(--px-ink-dim);
  font-size: 11px;
}

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

.loading-message {
  padding: 22px 0;
  color: var(--px-ink-dim);
  font-size: 11px;
  text-align: center;
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
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
  .section-heading,
  .post-item,
  .edit-form {
    align-items: stretch;
    flex-direction: column;
  }

  .reload-button,
  .post-actions button,
  .edit-form button {
    flex: 1;
  }

  .post-actions {
    width: 100%;
  }
}
</style>
