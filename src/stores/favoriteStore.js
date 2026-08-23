import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-weather:favorites'

// SSR/테스트 환경에는 localStorage가 없으므로 있을 때만 쓴다
const storage = typeof localStorage === 'undefined' ? null : localStorage

function load() {
  if (!storage) return []

  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    // 저장값이 깨졌으면 조용히 비우고 시작한다
    return []
  }
}

export const useFavoriteStore = defineStore('favorite', () => {
  const ids = ref(load())

  const count = computed(() => ids.value.length)
  const isFavorite = computed(() => (cityId) => ids.value.includes(cityId))

  const toggle = (cityId) => {
    ids.value = ids.value.includes(cityId)
      ? ids.value.filter((id) => id !== cityId)
      : [...ids.value, cityId]
  }

  // 즐겨찾기 순서가 유지되도록 목록 앞쪽으로 끌어올린다
  const sortFavoritesFirst = (list) => [
    ...list.filter((item) => ids.value.includes(item.id)),
    ...list.filter((item) => !ids.value.includes(item.id)),
  ]

  watch(ids, (value) => {
    if (!storage) return

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // 저장 공간이 막혀 있어도 이번 세션 동작에는 지장이 없다
    }
  })

  return { ids, count, isFavorite, toggle, sortFavoritesFirst }
})
