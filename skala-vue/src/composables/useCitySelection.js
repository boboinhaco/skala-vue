import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useWeatherStore } from '@/stores/weatherStore'
import { sceneFor } from '@/data/weatherScenes'

// 도시를 고르면 배경·공룡·요약이 함께 바뀐다.
// 관측소 화면과 전체 지역 화면이 같은 동작을 써야 해서 따로 뺐다.
export function useCitySelection() {
  const router = useRouter()
  const weatherStore = useWeatherStore()
  const toast = useToast()

  const selectCity = (item) => {
    weatherStore.selectCity(item.id)

    const scene = sceneFor(weatherStore.sceneCode, weatherStore.sceneIsNight)
    toast.add({
      severity: 'success',
      summary: `${item.name} 관측소`,
      detail: `배경이 '${scene.label}' 화면으로 바뀌었습니다.`,
      life: 2600,
    })
  }

  const selectCityById = (cityId) => {
    const item = weatherStore.weatherList.find((city) => city.id === cityId)
    if (item) selectCity(item)
  }

  const openDetail = (item) => {
    router.push({ name: 'weather-detail', params: { cityId: item.id } })
  }

  return { selectCity, selectCityById, openDetail }
}
