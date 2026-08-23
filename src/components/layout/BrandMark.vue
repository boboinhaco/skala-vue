<script setup>
import { RouterLink } from 'vue-router'
import PixelDino from '@/components/PixelDino.vue'

// 로고 공룡은 도감 스프라이트를 그대로 쓴다 (목 긴 용각류).
// 헤더에서는 가만히 서 있게 두려고 animate 를 끈다.
const LOGO_DINO = { id: 'brachiosaurus', accent: '#5BC8E8' }
</script>

<template>
  <RouterLink class="brand" :to="{ name: 'weather-home' }">
    <!-- weather 를 null 로 줘야 우산·반짝이 같은 날씨 장식이 안 붙는다 -->
    <PixelDino class="brand__dino" :dino="LOGO_DINO" :weather="null" :size="84" :animate="false" />

    <span class="brand__text">
      <strong>SKALA WEATHER</strong>
      <span class="brand__sub">
        <i class="brand__rule" aria-hidden="true"></i>
        중생대 날씨 관측소
        <i class="brand__rule" aria-hidden="true"></i>
      </span>
    </span>
  </RouterLink>
</template>

<style scoped src="./BrandMark.css"></style>
