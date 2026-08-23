<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import PixelWeatherChip from '@/components/scene/PixelWeatherChip.vue'
import FavoriteStar from '@/components/common/FavoriteStar.vue'
import TemperatureReading from '@/components/common/TemperatureReading.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { toWmoCode, msToKmh } from '@/data/openWeatherToWmo'
import { sceneFor } from '@/data/weatherScenes'

// 선택된 도시 객체 하나를 전달받아 표시한다
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 전달한다
const emit = defineEmits(['select-card', 'click-detail'])

const favoriteStore = useFavoriteStore()

const isFavorite = computed(() => favoriteStore.isFavorite(props.item.id))

const hasData = computed(() => typeof props.item.temp === 'number')
const scene = computed(() => sceneFor(toWmoCode(props.item.conditionId), props.item.isNight))

// 온도 구간을 태그 색으로
const band = computed(() => {
  if (!hasData.value) return { label: '데이터 없음', severity: 'secondary' }
  if (props.item.temp >= 30) return { label: '슈퍼핫', severity: 'danger' }
  if (props.item.temp >= 25) return { label: '더움', severity: 'warn' }
  if (props.item.temp >= 10) return { label: '선선함', severity: 'info' }
  return { label: '쌀쌀함', severity: 'success' }
})
</script>

<template>
  <article
    class="weather-card"
    :class="{ 'weather-card--on': selected }"
    tabindex="0"
    role="button"
    :aria-pressed="selected"
    @click="emit('select-card', item)"
    @keydown.enter.prevent="emit('select-card', item)"
    @keydown.space.prevent="emit('select-card', item)"
  >
    <div class="weather-card__chip">
      <PixelWeatherChip :weather-code="toWmoCode(item.conditionId)" :is-night="item.isNight" />
    </div>

    <div class="weather-card__body">
      <div class="weather-card__head">
        <h4>{{ item.name }}</h4>
        <Tag :value="band.label" :severity="band.severity" />

        <FavoriteStar
          class="weather-card__fav"
          :active="isFavorite"
          :label="item.name"
          @toggle="favoriteStore.toggle(item.id)"
        />
      </div>

      <p class="weather-card__status">
        {{ scene.label
        }}<template v-if="item.status && item.status !== scene.label">
          · {{ item.status }}</template
        >
      </p>

      <ul class="weather-card__stats">
        <li v-if="hasData">
          습도 <strong>{{ item.humidity }}%</strong>
        </li>
        <li v-if="hasData">
          바람 <strong>{{ msToKmh(item.windSpeed) }}km/h</strong>
        </li>
      </ul>
    </div>

    <div class="weather-card__end">
      <p class="weather-card__temp">
        <TemperatureReading :temp="item.temp" small-unit />
      </p>
      <Button
        label="상세"
        icon="pi pi-angle-right"
        icon-pos="right"
        severity="secondary"
        size="small"
        @click.stop="emit('click-detail', item)"
      />
    </div>

    <span v-if="selected" class="weather-card__flag">배경 적용 중</span>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  display: flex;
  margin-bottom: 12px;
  padding: 12px;
  border: var(--px-border) solid var(--px-edge);
  align-items: center;
  gap: 12px;
  background: var(--px-panel-soft);
  box-shadow: var(--px-shadow-sm);
  cursor: pointer;
  transition:
    transform 0.06s steps(1, end),
    box-shadow 0.06s steps(1, end);
}

.weather-card:hover,
.weather-card:focus-visible {
  outline: 0;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgb(3 6 14 / 55%);
}

.weather-card--on {
  border-color: var(--px-accent);
  background: #24314f;
}

.weather-card__chip {
  flex: 0 0 auto;
  width: 72px;
  height: 52px;
  border: 2px solid var(--px-edge);
  overflow: hidden;
}

.weather-card__body {
  flex: 1;
  min-width: 0;
}

.weather-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 별 자체 모양은 FavoriteStar 가 갖고 있고, 여기서는 자리만 잡는다 */
.weather-card__fav {
  margin-left: auto;
}

.weather-card__head h4 {
  margin: 0;
  font-family: var(--px-font-display);
  font-size: 14px;
  font-weight: 700;
}

.weather-card__status {
  margin: 4px 0 0;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.weather-card__stats {
  display: flex;
  margin: 6px 0 0;
  padding: 0;
  gap: 12px;
  color: var(--px-ink-dim);
  font-size: 11px;
  list-style: none;
}

.weather-card__stats strong {
  color: var(--px-ink);
}

.weather-card__end {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  flex-direction: column;
  gap: 8px;
}

.weather-card__temp {
  margin: 0;
  color: var(--px-accent);
  font-family: var(--px-font-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.weather-card__flag {
  position: absolute;
  top: -9px;
  left: 10px;
  padding: 1px 6px;
  border: 2px solid var(--px-edge);
  background: var(--px-accent);
  color: var(--px-accent-ink);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 560px) {
  .weather-card {
    flex-wrap: wrap;
  }

  .weather-card__end {
    align-items: flex-start;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
