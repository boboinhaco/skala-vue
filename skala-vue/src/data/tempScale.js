// 기온을 색으로 읽는 눈금. 전국 지도와 발자국 타임라인이 같은 기준을 쓴다.
export const TEMP_STEPS = [
  { max: 0, color: '#6aa9e0', label: '0°C 미만' },
  { max: 10, color: '#74c4ee', label: '10°' },
  { max: 20, color: '#6fd08c', label: '20°' },
  { max: 25, color: '#f0d64a', label: '25°' },
  { max: 30, color: '#f0913c', label: '30°' },
  { max: Infinity, color: '#ef6b6b', label: '이상' },
]

export const NO_DATA_COLOR = '#55617d'

export function tempColor(temp) {
  if (typeof temp !== 'number') return NO_DATA_COLOR
  return TEMP_STEPS.find((step) => temp < step.max).color
}
