<script setup>
import { computed } from 'vue'
import PixelDino from '@/components/PixelDino.vue'
import { matchDino } from '@/data/matchDino'

// 어떤 날씨에 어떤 공룡이 나오는지 보여주는 예시.
// 이름을 적어두는 대신 실제 매칭 함수를 돌려서, 데이터가 바뀌면 여기도 같이 바뀐다.
const props = defineProps({
  samples: { type: Array, default: () => [] },
})

const picks = computed(() =>
  props.samples.map((sample) => {
    const best = matchDino(sample.weather).best
    return {
      key: sample.label,
      label: sample.label,
      weather: sample.weather,
      dino: best,
      name: best.name,
      comment: best.comment,
    }
  }),
)
</script>

<template>
  <ul class="showcase">
    <li v-for="pick in picks" :key="pick.key">
      <div class="showcase__figure">
        <PixelDino :dino="pick.dino" :weather="pick.weather" :size="120" :animate="false" />
      </div>
      <p class="showcase__when">{{ pick.label }}</p>
      <h4>{{ pick.name }}</h4>
      <p class="showcase__comment">{{ pick.comment }}</p>
    </li>
  </ul>
</template>

<style scoped>
.showcase {
  display: grid;
  margin: 0;
  padding: 0;
  gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  list-style: none;
}

.showcase li {
  padding: 12px;
  border: 2px solid var(--px-edge);
  background: #0d1526;
}

.showcase__figure {
  display: flex;
  height: 100px;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.showcase__when {
  margin: 8px 0 2px;
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
}

.showcase h4 {
  margin: 0 0 4px;
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

.showcase__comment {
  margin: 0;
  color: var(--px-ink-dim);
  font-size: 11px;
  line-height: 1.5;
}
</style>
