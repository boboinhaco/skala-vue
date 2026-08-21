import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CACHE_DURATION = 5 * 60 * 1000

const CITIES = [
  {
    id: 'city_01',
    name: '서울',
    location: '대한민국 서울특별시',
    lat: 37.5665,
    lon: 126.978,
  },
  {
    id: 'city_02',
    name: '부산',
    location: '대한민국 부산광역시',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    id: 'city_03',
    name: '대구',
    location: '대한민국 대구광역시',
    lat: 35.8714,
    lon: 128.6014,
  },
  {
    id: 'city_04',
    name: '광주',
    location: '대한민국 광주광역시',
    lat: 35.1595,
    lon: 126.8526,
  },
]

const createEmptyWeather = (city) => ({
  ...city,
  temp: null,
  status: '날씨 정보 대기 중',
  humidity: null,
  windSpeed: null,
  icon: null,
})

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref(CITIES.map(createEmptyWeather))
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastUpdated = ref(null)

  const hasWeatherData = computed(() => {
    return weatherList.value.some((item) => typeof item.temp === 'number')
  })

  const getWeatherById = computed(() => {
    return (cityId) => weatherList.value.find((item) => item.id === cityId) ?? null
  })

  const fetchWeather = async (force = false) => {
    if (isLoading.value) return

    const hasFreshCache =
      lastUpdated.value && Date.now() - lastUpdated.value.getTime() < CACHE_DURATION

    if (!force && hasFreshCache) return

    if (!API_KEY) {
      errorMessage.value = 'OpenWeather API 키가 설정되지 않았습니다.'
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const results = await Promise.allSettled(
        CITIES.map((city) =>
          axios.get(API_URL, {
            params: {
              lat: city.lat,
              lon: city.lon,
              appid: API_KEY,
              units: 'metric',
              lang: 'kr',
            },
          }),
        ),
      )

      let successCount = 0

      weatherList.value = results.map((result, index) => {
        const city = CITIES[index]

        if (result.status === 'rejected') {
          const previousData = weatherList.value.find((item) => item.id === city.id)
          return previousData?.temp != null
            ? previousData
            : { ...createEmptyWeather(city), status: '날씨 정보 조회 실패' }
        }

        successCount++
        const data = result.value.data

        return {
          ...city,
          temp: data.main.temp,
          status: data.weather?.[0]?.description ?? '정보 없음',
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather?.[0]?.icon ?? null,
        }
      })

      if (successCount === 0) {
        errorMessage.value = '실시간 날씨 정보를 불러오지 못했습니다.'
        return
      }

      if (successCount < CITIES.length) {
        errorMessage.value = '일부 도시의 날씨 정보를 불러오지 못했습니다.'
      }

      lastUpdated.value = new Date()
    } catch (error) {
      console.error('OpenWeather API 요청 실패:', error)
      errorMessage.value = '실시간 날씨 정보를 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    weatherList,
    isLoading,
    errorMessage,
    lastUpdated,
    hasWeatherData,
    getWeatherById,
    fetchWeather,
  }
})
