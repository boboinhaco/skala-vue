import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toWmoCode } from '@/data/openWeatherToWmo'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
// 예보는 지금 보고 있는 지역 한 곳만 받는다 (17곳 전부 받으면 요청이 너무 늘어난다)
const FORECAST_SLOTS = 8
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CACHE_DURATION = 5 * 60 * 1000

const CITIES = [
  { id: 'seoul', name: '서울', location: '서울특별시', lat: 37.5665, lon: 126.978 },
  { id: 'incheon', name: '인천', location: '인천광역시', lat: 37.4563, lon: 126.7052 },
  { id: 'gyeonggi', name: '경기', location: '경기도 수원시', lat: 37.2636, lon: 127.0286 },
  { id: 'gangwon', name: '강원', location: '강원특별자치도 춘천시', lat: 37.8813, lon: 127.7298 },
  { id: 'chungbuk', name: '충북', location: '충청북도 청주시', lat: 36.6424, lon: 127.489 },
  { id: 'chungnam', name: '충남', location: '충청남도 홍성군', lat: 36.6009, lon: 126.665 },
  { id: 'sejong', name: '세종', location: '세종특별자치시', lat: 36.48, lon: 127.289 },
  { id: 'daejeon', name: '대전', location: '대전광역시', lat: 36.3504, lon: 127.3845 },
  { id: 'jeonbuk', name: '전북', location: '전북특별자치도 전주시', lat: 35.8242, lon: 127.148 },
  { id: 'gwangju', name: '광주', location: '광주광역시', lat: 35.1595, lon: 126.8526 },
  { id: 'jeonnam', name: '전남', location: '전라남도 무안군', lat: 34.99, lon: 126.483 },
  { id: 'gyeongbuk', name: '경북', location: '경상북도 안동시', lat: 36.5684, lon: 128.7294 },
  { id: 'daegu', name: '대구', location: '대구광역시', lat: 35.8714, lon: 128.6014 },
  { id: 'ulsan', name: '울산', location: '울산광역시', lat: 35.5384, lon: 129.3114 },
  { id: 'gyeongnam', name: '경남', location: '경상남도 창원시', lat: 35.228, lon: 128.6811 },
  { id: 'busan', name: '부산', location: '부산광역시', lat: 35.1796, lon: 129.0756 },
  { id: 'jeju', name: '제주', location: '제주특별자치도', lat: 33.4996, lon: 126.5312 },
]

export { CITIES }

// 대기질 응답에서 지수와 미세먼지 농도를 뽑는다
const readAir = (result) => {
  if (result?.status !== 'fulfilled') return { aqi: null, pm25: null, pm10: null }

  const entry = result.value.data.list?.[0]
  return {
    aqi: entry?.main?.aqi ?? null,
    pm25: entry?.components?.pm2_5 ?? null,
    pm10: entry?.components?.pm10 ?? null,
  }
}

const createEmptyWeather = (city) => ({
  ...city,
  temp: null,
  status: '날씨 정보 대기 중',
  humidity: null,
  windSpeed: null,
  icon: null,
  conditionId: null,
  isNight: false,
  aqi: null,
  pm25: null,
  pm10: null,
  clouds: null,
})

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref(CITIES.map(createEmptyWeather))
  // 배경과 공룡 카드가 함께 바라보는 '지금 보고 있는 도시'
  const selectedCityId = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastUpdated = ref(null)

  const hasWeatherData = computed(() => {
    return weatherList.value.some((item) => typeof item.temp === 'number')
  })

  // 고른 도시가 없거나 아직 데이터가 없으면 값이 들어온 첫 도시를 쓴다
  const selectedWeather = computed(() => {
    const picked = weatherList.value.find((item) => item.id === selectedCityId.value)
    if (picked && typeof picked.temp === 'number') return picked

    return weatherList.value.find((item) => typeof item.temp === 'number') ?? null
  })

  // 배경 화면이 쓰는 값
  const sceneCode = computed(() => toWmoCode(selectedWeather.value?.conditionId))
  const sceneIsNight = computed(() => Boolean(selectedWeather.value?.isNight))

  const selectCity = (cityId) => {
    selectedCityId.value = cityId
  }

  // ── 시간별 예보 (보고 있는 지역만) ─────────────────────────
  const forecasts = ref({})
  const isForecastLoading = ref(false)

  const fetchForecast = async (cityId) => {
    const city = CITIES.find((item) => item.id === cityId)
    if (!city || !API_KEY) return

    const cached = forecasts.value[cityId]
    if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) return

    isForecastLoading.value = true

    try {
      const { data } = await axios.get(FORECAST_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
          cnt: FORECAST_SLOTS,
        },
      })

      forecasts.value = {
        ...forecasts.value,
        [cityId]: {
          fetchedAt: Date.now(),
          list: (data.list ?? []).map((slot) => ({
            at: new Date(slot.dt * 1000),
            temp: slot.main.temp,
            // pop 은 0~1 이라 백분율로 바꿔 둔다
            pop: Math.round((slot.pop ?? 0) * 100),
            conditionId: slot.weather?.[0]?.id ?? null,
            isNight: slot.weather?.[0]?.icon?.endsWith('n') ?? false,
          })),
        },
      }
    } catch (error) {
      console.error('OpenWeather 예보 요청 실패:', error)
    } finally {
      isForecastLoading.value = false
    }
  }

  const selectedForecast = computed(() => forecasts.value[selectedWeather.value?.id]?.list ?? [])

  // 보고 있는 지역이 바뀌면 그 지역 예보를 받아둔다
  watch(
    () => selectedWeather.value?.id,
    (cityId) => {
      if (cityId) fetchForecast(cityId)
    },
    { immediate: true },
  )

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
      // 날씨와 대기질을 함께 요청한다 (대기질은 실패해도 날씨 표시에 영향을 주지 않는다)
      const [results, airResults] = await Promise.all([
        Promise.allSettled(
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
        ),
        Promise.allSettled(
          CITIES.map((city) =>
            axios.get(AIR_URL, {
              params: { lat: city.lat, lon: city.lon, appid: API_KEY },
            }),
          ),
        ),
      ])

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
        const condition = data.weather?.[0] ?? null
        const airResult = airResults[index]

        return {
          ...city,
          temp: data.main.temp,
          status: condition?.description ?? '정보 없음',
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: condition?.icon ?? null,
          // 공룡 매칭에 필요한 값들
          conditionId: condition?.id ?? null,
          // 아이콘 코드가 'n'으로 끝나면 밤 (예: '10n')
          isNight: condition?.icon?.endsWith('n') ?? false,
          // 자외선 추정에 쓰는 구름량(%)
          clouds: data.clouds?.all ?? null,
          ...readAir(airResult),
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
    selectedCityId,
    selectedWeather,
    sceneCode,
    sceneIsNight,
    selectCity,
    selectedForecast,
    isForecastLoading,
    fetchForecast,
  }
})
