<script setup>
import { RouterLink } from 'vue-router'

// 메뉴를 배열로 두면 화면이 늘어도 여기 한 줄만 추가하면 된다
const LINKS = [
  { name: 'weather-home', label: '관측소' },
  { name: 'regions', label: '전체 지역' },
  { name: 'weather-about', label: '소개' },
  { name: 'practice', label: '실습' },
]
</script>

<template>
  <nav class="main-nav" aria-label="주요 메뉴">
    <RouterLink v-for="link in LINKS" :key="link.name" :to="{ name: link.name }">
      {{ link.label }}
    </RouterLink>
  </nav>
</template>

<style scoped src="./MainNav.css"></style>
