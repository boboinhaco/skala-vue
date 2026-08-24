<script setup>
import { RouterLink } from 'vue-router'
import DinoMascot from '@/components/DinoMascot.vue'

// 로고 공룡은 도감 스프라이트를 그대로 쓴다 (목 긴 용각류).
// 헤더에서는 가만히 서 있게 두려고 animate 를 끈다.
const LOGO_DINO_ID = 'brachiosaurus'
</script>

<template>
  <RouterLink class="brand" :to="{ name: 'weather-home' }">
    <!-- weather 를 안 주면 우산·목도리 같은 날씨 소품이 안 붙는다 -->
    <DinoMascot
      class="brand__dino"
      :dino-id="LOGO_DINO_ID"
      :scale="1"
      :animate="false"
      alt="중생대 날씨 관측소"
    />

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
