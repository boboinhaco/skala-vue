<script setup>
import { computed } from 'vue'
import {
  SCENE_W,
  SCENE_H,
  TERRAIN,
  VOLCANO,
  TREES,
  STARS,
  RAIN,
  SNOW,
  FOG_BANDS,
  GROUND_DETAIL,
  LIGHTNING,
  SUN,
  MOON,
  sceneFor,
} from '@/data/weatherScenes'

const props = defineProps({
  weatherCode: { type: Number, default: 2 },
  isNight: { type: Boolean, default: false },
})

const scene = computed(() => sceneFor(props.weatherCode, props.isNight))

// 하늘은 색 띠 4개 + 띠 사이 체크무늬로 옛날 게임 그라데이션을 흉내낸다
const SKY_STOPS = [0, 15, 31, 47, 60]
const skyBands = computed(() =>
  scene.value.palette.sky.map((color, i) => ({
    color,
    y: SKY_STOPS[i],
    h: SKY_STOPS[i + 1] - SKY_STOPS[i],
  })),
)
const dithers = computed(() =>
  scene.value.palette.sky.slice(0, 3).map((from, i) => ({
    id: `dither-${scene.value.key}-${i}`,
    from,
    to: scene.value.palette.sky[i + 1],
    y: SKY_STOPS[i + 1] - 2,
  })),
)

const isRain = computed(() => scene.value.effect === 'rain' || scene.value.effect === 'drizzle')
</script>

<template>
  <div class="pixel-scene" aria-hidden="true">
    <Transition name="scene">
      <div
        :key="scene.key"
        class="pixel-scene__layer"
        :style="{ background: scene.palette.sky[0] }"
      >
        <svg
          class="pixel-scene__svg"
          :viewBox="`0 0 ${SCENE_W} ${SCENE_H}`"
          preserveAspectRatio="xMidYMax meet"
          shape-rendering="crispEdges"
        >
          <defs>
            <pattern
              v-for="d in dithers"
              :id="d.id"
              :key="d.id"
              width="2"
              height="2"
              patternUnits="userSpaceOnUse"
            >
              <rect width="2" height="2" :fill="d.from" />
              <rect width="1" height="1" :fill="d.to" />
              <rect x="1" y="1" width="1" height="1" :fill="d.to" />
            </pattern>
          </defs>

          <!-- 하늘 -->
          <rect
            v-for="band in skyBands"
            :key="band.y"
            x="0"
            :y="band.y"
            :width="SCENE_W"
            :height="band.h"
            :fill="band.color"
          />
          <rect
            v-for="d in dithers"
            :key="`s-${d.id}`"
            x="0"
            :y="d.y"
            :width="SCENE_W"
            height="2"
            :fill="`url(#${d.id})`"
          />

          <!-- 별 (밤) -->
          <g v-if="scene.isNight" class="twinkle">
            <rect
              v-for="(s, i) in STARS"
              :key="i"
              :x="s.x"
              :y="s.y"
              :width="s.s"
              :height="s.s"
              fill="#FFFFFF"
              :opacity="0.35 + (i % 5) * 0.15"
            />
          </g>

          <!-- 해 / 달 -->
          <g v-if="scene.showSun && !scene.isNight">
            <rect
              v-for="(r, i) in SUN.glow"
              :key="`g${i}`"
              :x="r.x"
              :y="r.y"
              :width="r.w"
              height="1"
              :fill="scene.palette.sunGlow"
              opacity="0.35"
            />
            <rect
              v-for="(r, i) in SUN.body"
              :key="`s${i}`"
              :x="r.x"
              :y="r.y"
              :width="r.w"
              height="1"
              :fill="scene.palette.sun"
            />
          </g>
          <g v-else-if="scene.showSun">
            <rect
              v-for="(r, i) in MOON.body"
              :key="`m${i}`"
              :x="r.x"
              :y="r.y"
              :width="r.w"
              height="1"
              :fill="scene.palette.sun"
            />
            <rect
              v-for="(c, i) in MOON.craters"
              :key="`c${i}`"
              :x="c.x"
              :y="c.y"
              :width="c.w"
              :height="c.h"
              :fill="scene.palette.sunGlow"
            />
          </g>

          <!-- 구름 (천천히 흐른다) -->
          <g class="drift">
            <template v-for="pass in [0, SCENE_W]" :key="pass">
              <rect
                v-for="(c, i) in scene.clouds"
                :key="`${pass}-${i}`"
                :x="c.x + pass"
                :y="c.y"
                :width="c.w"
                :height="c.h"
                :fill="scene.palette.cloud"
                opacity="0.92"
              />
            </template>
          </g>

          <!-- 먼 산 -->
          <path :d="TERRAIN.far" :fill="scene.palette.far" />

          <!-- 화산 -->
          <path :d="VOLCANO.body" :fill="scene.palette.volcano" />
          <rect
            :x="VOLCANO.crater.x"
            :y="VOLCANO.crater.y"
            :width="VOLCANO.crater.w"
            :height="VOLCANO.crater.h"
            :fill="scene.palette.lava"
          />
          <rect
            v-for="(l, i) in VOLCANO.lava"
            :key="`l${i}`"
            :x="l.x"
            :y="l.y"
            :width="l.w"
            :height="l.h"
            :fill="scene.palette.lava"
            opacity="0.85"
          />
          <g class="smoke">
            <rect
              v-for="(sm, i) in VOLCANO.smoke"
              :key="`sm${i}`"
              :x="sm.x"
              :y="sm.y"
              :width="sm.w"
              :height="sm.h"
              :fill="scene.palette.smoke"
              :opacity="sm.o"
            />
          </g>

          <!-- 언덕과 땅 -->
          <path :d="TERRAIN.mid" :fill="scene.palette.mid" />
          <path :d="TERRAIN.ground" :fill="scene.palette.groundTop" />
          <path :d="TERRAIN.groundDeep" :fill="scene.palette.ground" />
          <rect
            v-for="(g, i) in GROUND_DETAIL"
            :key="`gd${i}`"
            :x="g.x"
            :y="g.y"
            :width="g.w"
            :height="g.h"
            :fill="g.rock ? scene.palette.far : scene.palette.tree[0]"
            opacity="0.7"
          />

          <!-- 나무 -->
          <rect
            v-for="(t, i) in TREES"
            :key="`t${i}`"
            :x="t.x"
            :y="t.y"
            :width="t.w"
            :height="t.h"
            :fill="t.trunk ? scene.palette.trunk : scene.palette.tree[t.tone]"
          />

          <!-- 날씨 효과 -->
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
        </svg>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pixel-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.pixel-scene__layer {
  position: absolute;
  inset: 0;
}

/* 화면 아래쪽에 원래 비율대로 깔고, 남는 위쪽은 하늘색으로 채운다.
   세로로 긴 화면에서 배경이 통째로 확대되는 걸 막는다. */
.pixel-scene__svg {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
}

/* 도시를 바꾸면 새 배경이 위로 겹쳐지며 서서히 나타난다 */
.scene-enter-active,
.scene-leave-active {
  transition: opacity 0.75s ease;
}

.scene-enter-from,
.scene-leave-to {
  opacity: 0;
}

.drift {
  animation: drift 90s linear infinite;
}

@keyframes drift {
  to {
    transform: translateX(-160px);
  }
}

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

.smoke {
  animation: puff 9s ease-in-out infinite alternate;
  transform-origin: 116px 30px;
}

@keyframes puff {
  to {
    transform: translate(-3px, -3px) scale(1.12);
  }
}

.twinkle {
  animation: twinkle 4s steps(2, end) infinite alternate;
}

@keyframes twinkle {
  to {
    opacity: 0.65;
  }
}

.bolt {
  opacity: 0;
  animation: bolt 6s steps(1, end) infinite;
}

.flash {
  opacity: 0;
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
  .drift,
  .rain,
  .snowfall,
  .fog,
  .smoke,
  .twinkle,
  .bolt,
  .flash {
    animation: none;
  }
}
</style>
