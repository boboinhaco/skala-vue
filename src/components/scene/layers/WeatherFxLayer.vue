<script setup>
import { computed } from 'vue'
import { SCENE_W, SCENE_H, RAIN, SNOW, FOG_BANDS, LIGHTNING } from '@/data/weatherScenes'

// 비·눈·안개·번개. 공룡보다 뒤에 깔리는 배경 효과다.
const props = defineProps({
  scene: { type: Object, required: true },
})

const isRain = computed(() => ['rain', 'drizzle'].includes(props.scene.effect))
</script>

<template>
  <g>
    <g v-if="isRain" class="rain">
      <template v-for="pass in [0, -SCENE_H]" :key="pass">
        <rect
          v-for="(r, i) in RAIN"
          :key="`${pass}-${i}`"
          :x="r.x"
          :y="r.y + pass"
          width="1"
          :height="r.h"
          :fill="scene.palette.particle"
          :opacity="scene.effect === 'drizzle' ? 0.45 : 0.7"
        />
      </template>
    </g>

    <g v-else-if="scene.effect === 'snow'" class="snowfall">
      <template v-for="pass in [0, -SCENE_H]" :key="pass">
        <rect
          v-for="(s, i) in SNOW"
          :key="`${pass}-${i}`"
          :x="s.x"
          :y="s.y + pass"
          :width="s.s"
          :height="s.s"
          :fill="scene.palette.particle"
          opacity="0.9"
        />
      </template>
    </g>

    <g v-else-if="scene.effect === 'fog'" class="fog">
      <rect
        v-for="(f, i) in FOG_BANDS"
        :key="`f${i}`"
        x="-20"
        :y="f.y"
        :width="SCENE_W + 40"
        :height="f.h"
        :fill="scene.palette.haze"
        :opacity="f.o"
      />
    </g>

    <g v-else-if="scene.effect === 'thunder'">
      <g class="rain">
        <template v-for="pass in [0, -SCENE_H]" :key="pass">
          <rect
            v-for="(r, i) in RAIN"
            :key="`${pass}-${i}`"
            :x="r.x"
            :y="r.y + pass"
            width="1"
            :height="r.h"
            :fill="scene.palette.particle"
            opacity="0.6"
          />
        </template>
      </g>
      <path :d="LIGHTNING" fill="#FFF3A6" opacity="0" class="bolt" />
      <rect
        x="0"
        y="0"
        :width="SCENE_W"
        :height="SCENE_H"
        fill="#FFF3A6"
        opacity="0"
        class="flash"
      />
    </g>
  </g>
</template>

<style scoped>
.rain {
  animation: fall 0.75s linear infinite;
}

.snowfall {
  animation: fall 7s linear infinite;
}

@keyframes fall {
  to {
    transform: translateY(90px);
  }
}

.fog {
  animation: haze 26s ease-in-out infinite alternate;
}

@keyframes haze {
  to {
    transform: translateX(20px);
  }
}

.bolt {
  animation: bolt 6s steps(1, end) infinite;
}

.flash {
  animation: flash 6s steps(1, end) infinite;
}

@keyframes bolt {
  0%,
  3% {
    opacity: 1;
  }

  4%,
  8% {
    opacity: 0;
  }

  9%,
  11% {
    opacity: 1;
  }

  12%,
  100% {
    opacity: 0;
  }
}

@keyframes flash {
  0%,
  2% {
    opacity: 0.28;
  }

  3%,
  9% {
    opacity: 0;
  }

  10% {
    opacity: 0.18;
  }

  11%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rain,
  .snowfall,
  .fog,
  .bolt,
  .flash {
    animation: none;
  }
}
</style>
