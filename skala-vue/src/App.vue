<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink class="brand" :to="{ name: 'weather-home' }">
          <span class="brand-icon" aria-hidden="true">☀️</span>
          <span>
            <strong>SKALA Weather</strong>
            <small>도시별 기상 대시보드</small>
          </span>
        </RouterLink>

        <nav class="main-nav" aria-label="주요 메뉴">
          <RouterLink :to="{ name: 'weather-home' }">날씨 대시보드</RouterLink>
          <RouterLink :to="{ name: 'weather-about' }">서비스 소개</RouterLink>
          <RouterLink :to="{ name: 'practice' }">Vue 실습</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #dce5ee;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 2px 12px rgb(44 62 80 / 6%);
  backdrop-filter: blur(12px);
}

.header-inner {
  display: flex;
  width: min(100% - 40px, 960px);
  min-height: 76px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #20364b;
  text-decoration: none;
}

.brand-icon {
  font-size: 2rem;
  line-height: 1;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand small {
  margin-top: 1px;
  color: #7890a5;
  font-size: 0.75rem;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.main-nav a {
  padding: 9px 14px;
  border-radius: 8px;
  color: #65798c;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s ease;
}

.main-nav a:hover {
  background: #edf6fc;
  color: #1678a8;
}

.main-nav a.router-link-exact-active {
  background: #249dd8;
  color: #fff;
}

.app-content {
  width: min(100% - 40px, 960px);
  margin: 0 auto;
  padding: 42px 0 64px;
}

@media (max-width: 680px) {
  .header-inner {
    width: min(100% - 28px, 960px);
    padding: 14px 0;
    flex-direction: column;
    gap: 12px;
  }

  .main-nav {
    width: 100%;
  }

  .main-nav a {
    flex: 1;
    padding: 8px 6px;
    font-size: 0.82rem;
    text-align: center;
  }

  .app-content {
    width: min(100% - 28px, 960px);
    padding-top: 28px;
  }
}
</style>
