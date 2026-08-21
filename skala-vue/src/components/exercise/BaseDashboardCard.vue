<!-- 검색박스와 리스트박스의 공통 디자인. 내용은 부모가 slot으로 주입한다 -->
<template>
  <section class="base-dashboard-card">
    <slot></slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 18px;
  padding: 22px;
  border: 1px solid #e1e9ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(44 62 80 / 6%);
}

@media (max-width: 520px) {
  .base-dashboard-card {
    padding: 17px;
  }
}
</style>
