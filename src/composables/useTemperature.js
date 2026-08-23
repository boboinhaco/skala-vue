import { useConfigStore } from '@/stores/configStore'

export function useTemperature() {
  const configStore = useConfigStore()

  const formatTemperature = (celsius) => {
    if (typeof celsius !== 'number') return '--'

    if (configStore.unit === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }

    return Math.round(celsius)
  }

  return {
    configStore,
    formatTemperature,
  }
}
