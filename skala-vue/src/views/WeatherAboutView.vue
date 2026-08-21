<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <main class="about-page">
    <h2>ℹ️ 서비스 소개</h2>

    <section class="about-card">
      <p>본 앱은 Vue 3 및 Vue Router 기반으로 제작된 실습용 기상 관측 대시보드입니다.</p>

      <ul>
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>동적 URL의 도시 ID를 이용한 지역별 상세 정보 표시</li>
      </ul>

      <button type="button" @click="moveToHome">대시보드 홈으로 이동</button>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  color: #2c3e50;
}

h2 {
  margin: 0 0 22px;
  color: #20364b;
  font-size: clamp(1.7rem, 4vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.about-card {
  padding: 24px;
  border: 1px solid #e1e9ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(44 62 80 / 6%);
}

ul {
  margin: 18px 0;
  padding-left: 24px;
}

li + li {
  margin-top: 8px;
}

code {
  padding: 2px 5px;
  border-radius: 4px;
  background: #fff4e6;
  color: #e67e22;
}

button {
  width: 100%;
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #249dd8;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

button:hover {
  background: #1678a8;
}
</style>
