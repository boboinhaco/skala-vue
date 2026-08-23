<script setup>
import BrandMark from './BrandMark.vue'
import MainNav from './MainNav.vue'
import HeaderScene from './HeaderScene.vue'
</script>

<template>
  <!-- 금색 테두리 배너. 안쪽 풍경은 시간에 따라 낮/밤이 바뀐다.
       스크롤해도 이 줄만 화면에 남는다. -->
  <header class="site-banner">
    <HeaderScene />

    <div class="site-banner__inner">
      <BrandMark />
      <MainNav />
    </div>
  </header>
</template>

<style scoped src="./SiteHeader.css"></style>
