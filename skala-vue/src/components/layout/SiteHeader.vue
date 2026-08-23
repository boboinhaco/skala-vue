<script setup>
import BrandMark from './BrandMark.vue'
import MainNav from './MainNav.vue'
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <BrandMark />
      <MainNav />
    </div>

    <!-- 화면에 따라 헤더 아래에 덧붙는 줄 (관측 막대 등) -->
    <slot />
  </header>
</template>

<style scoped src="./SiteHeader.css"></style>
