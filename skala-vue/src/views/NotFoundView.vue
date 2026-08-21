<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found-page">
    <div class="weather-icon" aria-hidden="true">🌞❓</div>
    <h2>페이지를 찾을 수 없습니다</h2>
    <p>요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>

    <RouterLink class="home-link" :to="{ name: 'weather-home' }">
      날씨 메인으로 이동
    </RouterLink>
  </main>
</template>

<style scoped>
.not-found-page {
  width: 100%;
  max-width: 560px;
  margin: 80px auto 0;
  padding: 56px 32px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 18px rgb(44 62 80 / 12%);
  color: #2c3e50;
  text-align: center;
}

.weather-icon {
  margin-bottom: 20px;
  font-size: 4rem;
}

h2 {
  margin-bottom: 10px;
  font-size: 1.6rem;
  font-weight: 700;
}

p {
  margin-bottom: 26px;
  color: #7f8c8d;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 24px;
  background: #249dd8;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
</style>
