<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink class="brand" :to="{ name: 'weather-home' }">
    <span class="brand__icon" aria-hidden="true">🦕</span>
    <span class="brand__text">
      <strong>SKALA WEATHER</strong>
      <small>중생대 날씨 관측소</small>
    </span>
  </RouterLink>
</template>

<style scoped src="./BrandMark.css"></style>
