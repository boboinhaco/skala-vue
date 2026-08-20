<!-- 검색박스와 리스트박스의 공통 디자인. 내용은 부모가 slot으로 주입한다 -->
<template>
  <section class="base-dashboard-card">
    <slot></slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
