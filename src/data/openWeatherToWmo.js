// OpenWeatherMap 응답을 공룡 매칭 시스템(dinos.json / dinoSprites.js)이 쓰는 형태로 변환한다.
// dinos.json은 Open-Meteo의 WMO 코드 기준이라 두 체계를 이어주는 어댑터가 필요하다.

// 알 수 없는 코드가 들어왔을 때 사용할 기본값 (WMO 3 = 흐림)
const FALLBACK_WMO = 3

// OpenWeather 조건 코드(weather[0].id) -> WMO 코드
const WMO_BY_CONDITION_ID = {
  // 2xx 뇌우
  200: 95,
  201: 95,
  202: 99,
  210: 95,
  211: 95,
  212: 99,
  221: 99,
  230: 95,
  231: 95,
  232: 95,

  // 3xx 이슬비
  300: 51,
  301: 53,
  302: 55,
  310: 51,
  311: 53,
  312: 55,
  313: 80,
  314: 81,
  321: 80,

  // 5xx 비
  500: 61,
  501: 63,
  502: 65,
  503: 65,
  504: 65,
  511: 66,
  520: 80,
  521: 81,
  522: 82,
  531: 82,

  // 6xx 눈 (611~613 진눈깨비는 어는 비 코드로, 615~616 비/눈은 눈 코드로 근사)
  600: 71,
  601: 73,
  602: 75,
  611: 66,
  612: 66,
  613: 67,
  615: 71,
  616: 73,
  620: 85,
  621: 85,
  622: 86,

  // 7xx 대기 현상 (안개/연무/황사는 전부 안개로, 토네이도는 뇌우로)
  701: 45,
  711: 45,
  721: 45,
  731: 45,
  741: 45,
  751: 45,
  761: 45,
  762: 45,
  771: 3,
  781: 99,

  // 800번대 맑음/구름
  800: 0,
  801: 1,
  802: 2,
  803: 3,
  804: 3,
}

// 조건 코드를 WMO 코드로 변환한다
export function toWmoCode(conditionId) {
  return WMO_BY_CONDITION_ID[conditionId] ?? FALLBACK_WMO
}

// OpenWeather 풍속은 units=metric일 때 m/s인데,
// dinos.json의 windMin(20~35)은 km/h 기준이라 변환이 필요하다
export function msToKmh(speed) {
  if (typeof speed !== 'number') return 0
  return Math.round(speed * 3.6 * 10) / 10
}

// OpenWeather 대기질 지수(1~5)를 공룡 스프라이트가 아는 등급으로 변환한다
export function aqiToAirQuality(aqi) {
  if (aqi >= 5) return 'veryBad'
  if (aqi >= 3) return 'bad'
  return 'good'
}

// 스토어의 도시 날씨 항목 하나를 matchDino / DinoMascot 입력 형태로 변환한다.
// pm25 는 마스크를 씌울지 정하는 값이라 원본 수치를 그대로 넘긴다.
export function toDinoWeather(item) {
  if (!item || typeof item.temp !== 'number') return null

  return {
    temp: item.temp,
    humidity: typeof item.humidity === 'number' ? item.humidity : 50,
    weatherCode: toWmoCode(item.conditionId),
    wind: msToKmh(item.windSpeed),
    isNight: Boolean(item.isNight),
    airQuality: aqiToAirQuality(item.aqi),
    pm25: typeof item.pm25 === 'number' ? item.pm25 : 0,
  }
}
