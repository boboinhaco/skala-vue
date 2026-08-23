// 운석 경보 — 자외선·미세먼지·강수확률을 하나의 위협도로 묶는다.
// 겉모습만 공룡이고 안의 값과 기준은 실제 예보 기준을 그대로 쓴다.

// ------------------------------------------------------------
// 자외선 추정
// OpenWeather 무료 키로는 자외선 지수를 받을 수 없어(One Call 3.0 유료)
// 태양 고도와 구름량으로 계산한다. 측정값이 아니라 추정값이다.
// ------------------------------------------------------------
const RAD = Math.PI / 180

function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  return Math.floor((date.getTime() - start) / 86400000)
}

// 태양 고도각(도). 균시차는 최대 16분이라 자외선 추정에는 영향이 작아 생략한다.
export function solarElevation(lat, lon, date = new Date()) {
  const declination = 23.45 * Math.sin(RAD * ((360 * (284 + dayOfYear(date))) / 365))
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60
  const hourAngle = (utcHours + lon / 15 - 12) * 15

  const sinElevation =
    Math.sin(RAD * lat) * Math.sin(RAD * declination) +
    Math.cos(RAD * lat) * Math.cos(RAD * declination) * Math.cos(RAD * hourAngle)

  return Math.asin(Math.max(-1, Math.min(1, sinElevation))) / RAD
}

// 맑은 하늘 자외선 지수 근사 + 구름 감쇠
export function estimateUvIndex({ lat, lon, clouds = 0, at = new Date() }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null

  const elevation = solarElevation(lat, lon, at)
  if (elevation <= 0) return 0

  const clearSky = 12.5 * Math.sin(RAD * elevation) ** 2.42
  const cloudFraction = Math.min(1, Math.max(0, (clouds ?? 0) / 100))

  return Math.round(clearSky * (1 - 0.75 * cloudFraction ** 3.4) * 10) / 10
}

// ------------------------------------------------------------
// 지표별 등급 (0~4). 국내 예보 기준을 따른다.
// ------------------------------------------------------------
const gradeBy = (value, breaks) => {
  if (typeof value !== 'number') return null
  return breaks.findIndex((limit) => value <= limit) === -1
    ? breaks.length
    : breaks.findIndex((limit) => value <= limit)
}

const LEVEL_WORDS = ['없음', '약함', '보통', '강함', '매우 강함']

export const INDICATORS = {
  uv: {
    key: 'uv',
    label: '자외선',
    unit: '',
    estimated: true,
    breaks: [2, 5, 7, 10],
    words: ['낮음', '보통', '높음', '매우 높음', '위험'],
  },
  dust: {
    key: 'dust',
    label: '미세먼지',
    unit: '㎍/㎥',
    estimated: false,
    breaks: [15, 35, 75, 150],
    words: ['좋음', '보통', '나쁨', '매우 나쁨', '최악'],
  },
  rain: {
    key: 'rain',
    label: '강수확률',
    unit: '%',
    estimated: false,
    breaks: [20, 40, 60, 80],
    words: ['거의 없음', '낮음', '보통', '높음', '매우 높음'],
    // 비는 불편한 것이지 위험한 것은 아니라서 최고 단계까지는 올리지 않는다.
    // 미세먼지·자외선만 '대멸종 경보'를 띄울 수 있다.
    cap: 3,
  },
}

// ------------------------------------------------------------
// 위협 단계
// ------------------------------------------------------------
export const THREAT_LEVELS = [
  { name: '평온한 하늘', note: '관측된 위협 없음', color: '#6fd08c' },
  { name: '유성 관측', note: '가볍게 챙기면 충분합니다', color: '#a9d96a' },
  { name: '운석 접근', note: '외출 전 대비가 필요합니다', color: '#f0d64a' },
  { name: '궤도 진입', note: '오래 밖에 있는 건 피하세요', color: '#f0913c' },
  { name: '대멸종 경보', note: '가급적 실내에 머무르세요', color: '#ef6b6b' },
]

// 여러 지표 중 가장 나쁜 것이 경보 단계를 정한다 (실제 경보 체계와 같은 방식)
export function buildMeteorAlert({ weather, forecast = [] }) {
  if (!weather || typeof weather.temp !== 'number') return null

  const uv = estimateUvIndex({ lat: weather.lat, lon: weather.lon, clouds: weather.clouds })
  // 앞으로 12시간(3시간 간격 4칸) 중 가장 높은 강수확률
  const pop = forecast.length ? Math.max(...forecast.slice(0, 4).map((slot) => slot.pop)) : null

  const readings = [
    { ...INDICATORS.uv, value: uv },
    { ...INDICATORS.dust, value: weather.pm25 },
    { ...INDICATORS.rain, value: pop },
  ].map((item) => {
    const grade = gradeBy(item.value, item.breaks)
    return {
      ...item,
      grade,
      word: grade === null ? '자료 없음' : item.words[grade],
      ratio: grade === null ? 0 : (grade + 1) / (item.breaks.length + 1),
    }
  })

  const graded = readings.filter((item) => item.grade !== null)
  const capped = graded.map((item) => Math.min(item.grade, item.cap ?? 4))
  const level = capped.length ? Math.max(...capped) : 0
  const driver = graded.find((item, i) => capped[i] === level) ?? null

  return {
    level,
    ...THREAT_LEVELS[level],
    driver,
    readings,
    levelWord: LEVEL_WORDS[level],
  }
}
