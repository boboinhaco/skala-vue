import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { toWmoCode } from '@/data/openWeatherToWmo'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

// Open-Meteo — 키가 필요 없고 CORS가 열려 있는 외부 API.
// OpenWeather 무료 키로는 못 받는 자외선 실측값과 오존을 여기서 받는다.
const OPEN_METEO_AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const OPEN_METEO_DAILY_URL = 'https://api.open-meteo.com/v1/forecast'
// 예보는 지금 보고 있는 지역 한 곳만 받는다 (17곳 전부 받으면 요청이 너무 늘어난다)
const FORECAST_SLOTS = 8
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CACHE_DURATION = 5 * 60 * 1000

const CITIES = [
  { id: 'seoul', name: '서울', location: '서울특별시', lat: 37.5665, lon: 126.978 },
  { id: 'incheon', name: '인천', location: '인천광역시', lat: 37.4563, lon: 126.7052 },
  { id: 'suwon', name: '수원', location: '경기도 수원시', lat: 37.2636, lon: 127.0286 },
  { id: 'goyang', name: '고양', location: '경기도 고양시', lat: 37.6584, lon: 126.832 },
  { id: 'yongin', name: '용인', location: '경기도 용인시', lat: 37.2411, lon: 127.1776 },
  { id: 'seongnam', name: '성남', location: '경기도 성남시', lat: 37.42, lon: 127.1265 },
  { id: 'bucheon', name: '부천', location: '경기도 부천시', lat: 37.5035, lon: 126.766 },
  { id: 'ansan', name: '안산', location: '경기도 안산시', lat: 37.3219, lon: 126.8309 },
  { id: 'pyeongtaek', name: '평택', location: '경기도 평택시', lat: 36.9921, lon: 127.1129 },
  { id: 'uijeongbu', name: '의정부', location: '경기도 의정부시', lat: 37.7381, lon: 127.0337 },
  { id: 'paju', name: '파주', location: '경기도 파주시', lat: 37.7599, lon: 126.78 },
  { id: 'chuncheon', name: '춘천', location: '강원특별자치도 춘천시', lat: 37.8813, lon: 127.7298 },
  { id: 'wonju', name: '원주', location: '강원특별자치도 원주시', lat: 37.3422, lon: 127.9202 },
  { id: 'gangneung', name: '강릉', location: '강원특별자치도 강릉시', lat: 37.7519, lon: 128.8761 },
  { id: 'sokcho', name: '속초', location: '강원특별자치도 속초시', lat: 38.207, lon: 128.5918 },
  { id: 'donghae', name: '동해', location: '강원특별자치도 동해시', lat: 37.5247, lon: 129.1143 },
  { id: 'cheongju', name: '청주', location: '충청북도 청주시', lat: 36.6424, lon: 127.489 },
  { id: 'chungju', name: '충주', location: '충청북도 충주시', lat: 36.991, lon: 127.9259 },
  { id: 'jecheon', name: '제천', location: '충청북도 제천시', lat: 37.1326, lon: 128.191 },
  { id: 'sejong', name: '세종', location: '세종특별자치시', lat: 36.48, lon: 127.289 },
  { id: 'daejeon', name: '대전', location: '대전광역시', lat: 36.3504, lon: 127.3845 },
  { id: 'cheonan', name: '천안', location: '충청남도 천안시', lat: 36.8151, lon: 127.1139 },
  { id: 'asan', name: '아산', location: '충청남도 아산시', lat: 36.7898, lon: 127.0018 },
  { id: 'seosan', name: '서산', location: '충청남도 서산시', lat: 36.7848, lon: 126.4503 },
  { id: 'boryeong', name: '보령', location: '충청남도 보령시', lat: 36.3333, lon: 126.6128 },
  { id: 'gongju', name: '공주', location: '충청남도 공주시', lat: 36.4465, lon: 127.1189 },
  { id: 'jeonju', name: '전주', location: '전북특별자치도 전주시', lat: 35.8242, lon: 127.148 },
  { id: 'gunsan', name: '군산', location: '전북특별자치도 군산시', lat: 35.9676, lon: 126.7369 },
  { id: 'iksan', name: '익산', location: '전북특별자치도 익산시', lat: 35.9483, lon: 126.9576 },
  { id: 'namwon', name: '남원', location: '전북특별자치도 남원시', lat: 35.4164, lon: 127.3905 },
  { id: 'gwangju', name: '광주', location: '광주광역시', lat: 35.1595, lon: 126.8526 },
  { id: 'mokpo', name: '목포', location: '전라남도 목포시', lat: 34.8118, lon: 126.3922 },
  { id: 'yeosu', name: '여수', location: '전라남도 여수시', lat: 34.7604, lon: 127.6622 },
  { id: 'suncheon', name: '순천', location: '전라남도 순천시', lat: 34.9506, lon: 127.4872 },
  { id: 'gwangyang', name: '광양', location: '전라남도 광양시', lat: 34.9407, lon: 127.6959 },
  { id: 'naju', name: '나주', location: '전라남도 나주시', lat: 35.016, lon: 126.7108 },
  { id: 'daegu', name: '대구', location: '대구광역시', lat: 35.8714, lon: 128.6014 },
  { id: 'pohang', name: '포항', location: '경상북도 포항시', lat: 36.019, lon: 129.3435 },
  { id: 'gyeongju', name: '경주', location: '경상북도 경주시', lat: 35.8562, lon: 129.2247 },
  { id: 'andong', name: '안동', location: '경상북도 안동시', lat: 36.5684, lon: 128.7294 },
  { id: 'gumi', name: '구미', location: '경상북도 구미시', lat: 36.1196, lon: 128.3446 },
  { id: 'gimcheon', name: '김천', location: '경상북도 김천시', lat: 36.1398, lon: 128.1136 },
  { id: 'yeongju', name: '영주', location: '경상북도 영주시', lat: 36.8056, lon: 128.6239 },
  { id: 'busan', name: '부산', location: '부산광역시', lat: 35.1796, lon: 129.0756 },
  { id: 'ulsan', name: '울산', location: '울산광역시', lat: 35.5384, lon: 129.3114 },
  { id: 'changwon', name: '창원', location: '경상남도 창원시', lat: 35.228, lon: 128.6811 },
  { id: 'jinju', name: '진주', location: '경상남도 진주시', lat: 35.18, lon: 128.1076 },
  { id: 'gimhae', name: '김해', location: '경상남도 김해시', lat: 35.2285, lon: 128.8894 },
  { id: 'tongyeong', name: '통영', location: '경상남도 통영시', lat: 34.8544, lon: 128.4331 },
  { id: 'geoje', name: '거제', location: '경상남도 거제시', lat: 34.8806, lon: 128.6211 },
  { id: 'miryang', name: '밀양', location: '경상남도 밀양시', lat: 35.5038, lon: 128.7469 },
  { id: 'jeju', name: '제주', location: '제주특별자치도 제주시', lat: 33.4996, lon: 126.5312 },
  {
    id: 'seogwipo',
    name: '서귀포',
    location: '제주특별자치도 서귀포시',
    lat: 33.2541,
    lon: 126.5601,
  },
]

export { CITIES }

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

  // 따로 받아둔 대기질을 도시 정보에 얹는다
  const withAir = (item) => {
    if (!item) return null

    const air = airByCity.value[item.id]
    return air ? { ...item, aqi: air.aqi, pm25: air.pm25, pm10: air.pm10 } : item
  }

  // 고른 도시가 없거나 아직 데이터가 없으면 값이 들어온 첫 도시를 쓴다
  const selectedWeather = computed(() => {
    const picked = weatherList.value.find((item) => item.id === selectedCityId.value)
    if (picked && typeof picked.temp === 'number') return withAir(picked)

    return withAir(weatherList.value.find((item) => typeof item.temp === 'number') ?? null)
  })

  // 배경 화면이 쓰는 값
  const sceneCode = computed(() => toWmoCode(selectedWeather.value?.conditionId))
  const sceneIsNight = computed(() => Boolean(selectedWeather.value?.isNight))

  const selectCity = (cityId) => {
    selectedCityId.value = cityId
  }

  // ── 대기질 (보고 있는 지역만) ──────────────────────────────
  // 도시 카드에는 안 쓰이고 공룡·운석 경보에서만 쓰여서, 전부 받으면 낭비다.
  const airByCity = ref({})

  const fetchAir = async (cityId) => {
    const city = CITIES.find((item) => item.id === cityId)
    if (!city || !API_KEY) return

    const cached = airByCity.value[cityId]
    if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) return

    try {
      const { data } = await axios.get(AIR_URL, {
        params: { lat: city.lat, lon: city.lon, appid: API_KEY },
      })
      const entry = data.list?.[0]

      airByCity.value = {
        ...airByCity.value,
        [cityId]: {
          fetchedAt: Date.now(),
          aqi: entry?.main?.aqi ?? null,
          pm25: entry?.components?.pm2_5 ?? null,
          pm10: entry?.components?.pm10 ?? null,
        },
      }
    } catch (error) {
      // 대기질이 없어도 날씨 표시에는 지장이 없다
      console.error('OpenWeather 대기질 요청 실패:', error)
    }
  }

  // ── Open-Meteo (보고 있는 지역만) ─────────────────────────
  // 자외선 실측값 · 오존 · 오늘의 최고/최저 기온
  const openMeteoByCity = ref({})
  const isOpenMeteoLoading = ref(false)

  const fetchOpenMeteo = async (cityId) => {
    const city = CITIES.find((item) => item.id === cityId)
    if (!city) return

    const cached = openMeteoByCity.value[cityId]
    if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) return

    isOpenMeteoLoading.value = true
    const common = { latitude: city.lat, longitude: city.lon, timezone: 'Asia/Seoul' }

    try {
      const [air, daily] = await Promise.all([
        axios.get(OPEN_METEO_AIR_URL, {
          params: { ...common, current: 'ozone,uv_index' },
        }),
        axios.get(OPEN_METEO_DAILY_URL, {
          params: {
            ...common,
            daily: 'temperature_2m_max,temperature_2m_min,uv_index_max',
            forecast_days: 1,
          },
        }),
      ])

      const now = air.data.current ?? {}
      const today = daily.data.daily ?? {}

      openMeteoByCity.value = {
        ...openMeteoByCity.value,
        [cityId]: {
          fetchedAt: Date.now(),
          uv: typeof now.uv_index === 'number' ? now.uv_index : null,
          ozone: typeof now.ozone === 'number' ? now.ozone : null,
          tempMax: today.temperature_2m_max?.[0] ?? null,
          tempMin: today.temperature_2m_min?.[0] ?? null,
          uvMax: today.uv_index_max?.[0] ?? null,
        },
      }
    } catch (error) {
      // 못 받아도 자외선은 태양 고도로 추정하고, 최고/최저는 표시만 생략한다
      console.error('Open-Meteo 요청 실패:', error)
    } finally {
      isOpenMeteoLoading.value = false
    }
  }

  const selectedOpenMeteo = computed(() => openMeteoByCity.value[selectedWeather.value?.id] ?? null)

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
      if (!cityId) return

      fetchForecast(cityId)
      fetchAir(cityId)
      fetchOpenMeteo(cityId)
    },
    { immediate: true },
  )

  const getWeatherById = computed(() => {
    return (cityId) => withAir(weatherList.value.find((item) => item.id === cityId) ?? null)
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
      // 도시 수만큼만 요청한다.
      // 대기질은 지금 보고 있는 곳에서만 쓰이므로 여기서 전부 받지 않는다.
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
        const condition = data.weather?.[0] ?? null

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
    fetchAir,
    selectedOpenMeteo,
    isOpenMeteoLoading,
    fetchOpenMeteo,
  }
})
