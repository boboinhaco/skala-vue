<script setup>
import { computed, ref } from 'vue'
import { MAP_W, MAP_H, landRects, coastRects, toCell } from '@/data/koreaMap'
import { tempColor } from '@/data/tempScale'
import MapMarker from './MapMarker.vue'
import TempLegend from './TempLegend.vue'

const props = defineProps({
  cities: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
})

const emit = defineEmits(['select'])

const land = landRects()
const coast = coastRects()

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
</script>

<template>
  <div class="korea-map">
    <div class="korea-map__frame">
      <div class="korea-map__stage">
        <svg
          class="korea-map__svg"
          :viewBox="VIEW"
          preserveAspectRatio="xMidYMid meet"
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
          <MapMarker
            v-for="m in markers"
            :key="m.id"
            :marker="m"
            @select="emit('select', $event)"
            @hover="hovered = $event"
          />
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
    </div>

    <TempLegend />
  </div>
</template>

<style scoped>
.korea-map {
  display: flex;
  height: 100%;
  flex-direction: column;
}

/* 카드가 세로로 늘어나면 지도도 같이 커진다 */
.korea-map__frame {
  display: flex;
  flex: 1;
  min-height: 240px;
  padding: 4px;
  border: 2px solid var(--px-edge);
  background: #0a1322;
}

/* viewBox 와 같은 비율을 유지하는 상자.
   SVG 와 이름표가 이 상자를 공유해야 좌표가 어긋나지 않는다. */
.korea-map__stage {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  aspect-ratio: 44 / 64;
}

.korea-map__svg {
  display: block;
  width: 100%;
  height: 100%;
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
