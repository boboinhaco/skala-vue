<script setup>
import { ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const handleFetchWeather = async () => {
  if (!API_KEY) {
    errorMessage.value = 'OpenWeather API 키가 설정되지 않았습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: 35.1585,
        lon: 126.8649,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    weatherData.value = response.data
  } catch (error) {
    console.error(error)
    errorMessage.value = '날씨 정보를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="axios-example">
    <h2>⚡ Axios 통신 검증</h2>

    <button type="button" :disabled="isLoading" @click="handleFetchWeather">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 가져오기' }}
    </button>

    <div v-if="weatherData" class="result-card">
      <p>위치: {{ weatherData.name }}</p>
      <p>현재 기온: {{ weatherData.main.temp }}°C</p>
      <p>날씨 상태: {{ weatherData.weather[0].description }}</p>
      <p>습도: {{ weatherData.main.humidity }}%</p>
    </div>

    <p v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-else>아직 가져온 데이터가 없습니다.</p>
  </section>
</template>

<style scoped>
.axios-example {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e1e9ef;
  border-radius: 10px;
  background: #fff;
}

.result-card {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f3f8fc;
}

.error-message {
  margin-top: 16px;
  color: #d63031;
}
</style>
