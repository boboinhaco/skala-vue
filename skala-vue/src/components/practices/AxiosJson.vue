<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import ApiMessage from './axios/ApiMessage.vue'
import PostCreateForm from './axios/PostCreateForm.vue'
import PostItem from './axios/PostItem.vue'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'
let nextLocalId = -1

const items = ref([])
const editingId = ref(null)
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

const handleCreate = async (draft) => {
  const title = draft.trim()
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
  clearMessage()
}

const cancelEdit = () => {
  editingId.value = null
}

const handleUpdate = async (item, draft) => {
  const title = draft.trim()
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

    <PostCreateForm :pending="pendingAction === 'create'" @create="handleCreate" />

    <p class="api-notice">
      JSONPlaceholder는 실습용 API이므로 수정 결과는 현재 화면에만 반영되며 서버에 영구 저장되지
      않습니다.
    </p>

    <ApiMessage :text="successMessage" tone="success" />
    <ApiMessage :text="errorMessage" tone="error" />

    <p v-if="isLoading" class="loading-message">게시물 데이터를 불러오는 중입니다.</p>

    <ul v-else class="post-list">
      <PostItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :editing="editingId === item.id"
        :saving="pendingAction === `update-${item.id}`"
        :deleting="pendingAction === `delete-${item.id}`"
        @edit="startEdit(item)"
        @cancel="cancelEdit"
        @save="handleUpdate(item, $event)"
        @remove="handleDelete(item)"
      />
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

.section-heading {
  display: flex;
  margin-bottom: 14px;
  align-items: center;
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

.api-notice {
  margin: 10px 0 12px;
  color: var(--px-ink-dim);
  font-size: 11px;
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
</style>
