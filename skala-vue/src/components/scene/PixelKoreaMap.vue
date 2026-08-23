<script setup>
import { computed, ref } from 'vue'
import { MAP_W, MAP_H, landRects, coastRects, toCell } from '@/data/koreaMap'

const props = defineProps({
  cities: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
})

const emit = defineEmits(['select'])

const land = landRects()
const coast = coastRects()

// 기온을 색으로. 지도만 보고도 어디가 덥고 추운지 한눈에 들어오게 한다.
const TEMP_STEPS = [
  { max: 0, color: '#6aa9e0' },
  { max: 10, color: '#74c4ee' },
  { max: 20, color: '#6fd08c' },
  { max: 25, color: '#f0d64a' },
  { max: 30, color: '#f0913c' },
  { max: Infinity, color: '#ef6b6b' },
]
const tempColor = (temp) =>
  typeof temp === 'number' ? TEMP_STEPS.find((s) => temp < s.max).color : '#55617d'

const markers = computed(() =>
  props.cities.map((city) => {
    const { x, y } = toCell(city.lat, city.lon, city.id)
    return {
      id: city.id,
      name: city.name,
      temp: city.temp,
      x,
      y,
      color: tempColor(city.temp),
      selected: city.id === props.selectedId,
    }
  }),
)

// 육지가 실제로 차지하는 범위만 보여준다 (오른쪽·아래 빈 바다를 잘라낸다)
const VIEW = '1 -1 44 64'

const hovered = ref(null)
// 이름표는 고른 곳과 마우스 올린 곳만 (17개를 다 띄우면 수도권이 겹친다)
const labelled = computed(() => markers.value.filter((m) => m.selected || m.id === hovered.value))

const LEGEND = [
  { label: '0°C 미만', color: '#6aa9e0' },
  { label: '10°', color: '#74c4ee' },
  { label: '20°', color: '#6fd08c' },
  { label: '25°', color: '#f0d64a' },
  { label: '30°', color: '#f0913c' },
  { label: '이상', color: '#ef6b6b' },
]
</script>

<template>
  <div class="korea-map">
    <div class="korea-map__frame">
      <svg
        class="korea-map__svg"
        :viewBox="VIEW"
        shape-rendering="crispEdges"
        role="group"
        aria-label="전국 시도 날씨 지도"
      >
        <rect x="0" y="0" :width="MAP_W" :height="MAP_H" class="sea" />

        <rect
          v-for="(r, i) in land"
          :key="`l${i}`"
          :x="r.x"
          :y="r.y"
          :width="r.w"
          height="1"
          class="land"
        />
        <rect
          v-for="(c, i) in coast"
          :key="`c${i}`"
          :x="c.x"
          :y="c.y"
          width="1"
          height="1"
          class="coast"
        />

        <!-- 관측소 -->
        <g
          v-for="m in markers"
          :key="m.id"
          class="marker"
          :class="{ 'marker--on': m.selected }"
          role="button"
          tabindex="0"
          :aria-label="`${m.name} ${typeof m.temp === 'number' ? Math.round(m.temp) + '도' : '데이터 없음'}`"
          :aria-pressed="m.selected"
          @click="emit('select', m.id)"
          @keydown.enter.prevent="emit('select', m.id)"
          @keydown.space.prevent="emit('select', m.id)"
          @mouseenter="hovered = m.id"
          @mouseleave="hovered = null"
          @focus="hovered = m.id"
          @blur="hovered = null"
        >
          <rect
            v-if="m.selected"
            :x="m.x - 2"
            :y="m.y - 2"
            width="6"
            height="6"
            class="marker__ring"
          />
          <rect :x="m.x - 1" :y="m.y - 1" width="4" height="4" class="marker__edge" />
          <rect :x="m.x" :y="m.y" width="2" height="2" :fill="m.color" />
        </g>
      </svg>

      <!-- 이름표는 픽셀 폰트를 쓰려고 HTML로 얹는다 -->
      <span
        v-for="m in labelled"
        :key="`t${m.id}`"
        class="korea-map__tag"
        :style="{
          left: `${((m.x + 1 - 1) / 44) * 100}%`,
          top: `${((m.y + 3 + 1) / 63) * 100}%`,
        }"
      >
        {{ m.name }}
        <b v-if="typeof m.temp === 'number'">{{ Math.round(m.temp) }}°</b>
      </span>
    </div>

    <ul class="korea-map__legend">
      <li v-for="l in LEGEND" :key="l.label">
        <i :style="{ background: l.color }"></i>{{ l.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.korea-map__frame {
  position: relative;
  border: 2px solid var(--px-edge);
  background: #0a1322;
}

.korea-map__svg {
  display: block;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
}

.sea {
  fill: #0d1a2e;
}

.land {
  fill: #2c4a3a;
}

.coast {
  fill: #3f6b52;
}

.marker {
  cursor: pointer;
  outline: 0;
}

.marker__edge {
  fill: var(--px-edge);
}

.marker__ring {
  fill: var(--px-accent);
}

.marker:hover .marker__edge,
.marker:focus-visible .marker__edge {
  fill: var(--px-accent);
}

.marker--on .marker__ring {
  animation: ring 1.2s steps(2, end) infinite;
}

@keyframes ring {
  50% {
    opacity: 0.35;
  }
}

.korea-map__tag {
  position: absolute;
  padding: 1px 5px;
  border: 2px solid var(--px-edge);
  background: var(--px-panel-solid);
  color: var(--px-ink);
  font-family: var(--px-font-display);
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
  white-space: nowrap;
  transform: translateY(-2px);
  z-index: 2;
}

.korea-map__tag b {
  color: var(--px-accent);
}

.korea-map__legend {
  display: flex;
  margin: 10px 0 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 4px 8px;
  list-style: none;
}

.korea-map__legend li {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--px-ink-dim);
  font-size: 11px;
}

.korea-map__legend i {
  width: 9px;
  height: 9px;
  border: 2px solid var(--px-edge);
}

/* 한 단으로 접히면 지도가 화면을 다 먹지 않도록 폭을 제한한다 */
@media (max-width: 960px) {
  .korea-map__frame {
    max-width: 340px;
    margin: 0 auto;
  }

  .korea-map__legend {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker--on .marker__ring {
    animation: none;
  }
}
</style>
