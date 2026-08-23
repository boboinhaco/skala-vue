import data from './dinos.json'

const { dinos, wmoGroups } = data

// WMO 코드가 속한 그룹명을 찾는다
function findGroup(code) {
  return Object.keys(wmoGroups).find((key) => wmoGroups[key].includes(code))
}

// 습도(%)를 low / mid / high 로 변환한다
function humidityLevel(humidity) {
  if (humidity < 45) return 'low'
  if (humidity < 75) return 'mid'
  return 'high'
}

// 공룡 한 마리의 적합도 점수를 계산한다
function scoreDino(dino, weather) {
  const { temp, humidity, weatherCode, wind } = weather
  const m = dino.match
  let score = m.priority * 5

  // 날씨 코드가 정확히 일치하면 가장 큰 가중치
  if (m.weatherCodes.includes(weatherCode)) {
    score += 40
  } else if (
    findGroup(weatherCode) &&
    m.weatherCodes.some((c) => findGroup(c) === findGroup(weatherCode))
  ) {
    score += 20
  }

  // 기온이 선호 구간 안이면 만점, 벗어난 만큼 깎는다
  const [min, max] = m.tempRange
  if (temp >= min && temp <= max) {
    score += 30
  } else {
    score += Math.max(0, 30 - Math.abs(temp < min ? min - temp : temp - max) * 3)
  }

  // 습도 성향이 맞으면 가산
  if (m.humidity === humidityLevel(humidity)) score += 15

  // 바람 조건이 있는 공룡은 풍속 충족 시 가산
  if (m.windMin) score += wind >= m.windMin ? 15 : -10

  return score
}

// 오늘 날씨에 가장 어울리는 공룡을 반환한다
export function matchDino(weather) {
  const ranked = dinos
    .map((dino) => ({ ...dino, score: scoreDino(dino, weather) }))
    .sort((a, b) => b.score - a.score)

  return { best: ranked[0], runnersUp: ranked.slice(1, 3) }
}

// 전체 공룡 목록을 그대로 내보낸다 (도감용)
export { dinos }
