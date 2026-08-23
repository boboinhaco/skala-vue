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
  margin-top: 24px;
  padding: 22px;
  border: 1px solid #dfe7ed;
  border-radius: 12px;
  background: #fff;
  color: #2c3e50;
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
  margin-bottom: 16px;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  color: #249dd8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h2 {
  margin: 4px 0 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 800;
}

button,
input {
  font: inherit;
}

button {
  border: 0;
  border-radius: 7px;
  color: #fff;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
}

button:disabled {
  cursor: wait;
  opacity: 0.55;
}

.reload-button {
  padding: 8px 11px;
  background: #607d8b;
}

.create-form {
  gap: 8px;
}

input {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #cfdae2;
  border-radius: 7px;
  outline: none;
  color: #2c3e50;
}

input:focus {
  border-color: #249dd8;
  box-shadow: 0 0 0 3px rgb(36 157 216 / 12%);
}

.create-button {
  flex: 0 0 auto;
  padding: 10px 14px;
  background: #27ae60;
}

.api-notice {
  margin: 10px 0 14px;
  color: #7d8f9e;
  font-size: 0.78rem;
}

.message {
  margin: 10px 0;
  padding: 8px 10px;
  border-radius: 7px;
  font-size: 0.82rem;
}

.message.success {
  background: #edf8f0;
  color: #287a3c;
}

.message.error {
  background: #fff1f1;
  color: #b23b3b;
}

.loading-message {
  padding: 24px 0;
  color: #718594;
  text-align: center;
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-item {
  min-height: 68px;
  padding: 12px 0;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf1f4;
}

.post-content {
  min-width: 0;
}

.post-content span,
.post-content strong {
  display: block;
}

.post-content span {
  color: #97a5b0;
  font-size: 0.72rem;
}

.post-content strong {
  overflow: hidden;
  color: #34495e;
  font-size: 0.9rem;
  font-weight: 700;
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

.update-button,
.delete-button,
.cancel-button {
  padding: 7px 10px;
}

.update-button {
  background: #f39c12;
}

.delete-button {
  background: #e74c3c;
}

.cancel-button {
  background: #8796a1;
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
