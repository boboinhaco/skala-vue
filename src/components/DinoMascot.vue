<!-- src/components/DinoMascot.vue -->
<script setup>
import { computed } from 'vue'
import {
  SPRITE,
  getSpriteMeta,
  layoutAccessory,
  pickAccessories,
  pickGesture,
} from '@/data/dinoSprites'

const props = defineProps({
  // dinos.json 의 id. 스프라이트 키와 같은 이름을 쓴다.
  dinoId: {
    type: String,
    default: 'tyrannosaurus',
  },
  // { weatherCode, temp, wind, pm25, isNight } — 없으면 소품 없이 서 있는다
  weather: {
    type: Object,
    default: null,
  },
  // 원본 96x72 픽셀을 몇 배로 키울지. 정수로 줘야 픽셀이 안 뭉갠다.
  scale: {
    type: Number,
    default: 3,
  },
  animate: {
    type: Boolean,
    default: true,
  },
  alt: {
    type: String,
    default: '오늘의 공룡',
  },
})

const meta = computed(() => getSpriteMeta(props.dinoId))

// 스프라이트는 public/dinos/ 에 두고 절대 경로로 참조한다
const spriteUrl = computed(() => `/dinos/${meta.value.file}`)

const px = (n) => `${n * props.scale}px`

// 원본 픽셀 좌표계 위에 액세서리를 배치한다 (아직 화면 좌표는 아니다)
const accessories = computed(() =>
  pickAccessories(props.weather).map((name) => layoutAccessory(name, meta.value)),
)

// 우산처럼 머리 위로 삐져나오는 소품만큼만 여백을 준다.
// 고정 여백으로 두면 소품이 없는 날(로고 등)에 빈 공간이 그대로 남는다.
const padding = computed(() => {
  const boxes = accessories.value
  const top = Math.max(0, ...boxes.map((b) => -b.y))
  const left = Math.max(0, ...boxes.map((b) => -b.x))
  const right = Math.max(0, ...boxes.map((b) => b.x + b.w - SPRITE.w))

  return { top: Math.ceil(top), left: Math.ceil(left), right: Math.ceil(right) }
})

const stageStyle = computed(() => ({
  width: px(padding.value.left + SPRITE.w + padding.value.right),
  height: px(padding.value.top + SPRITE.h),
  paddingTop: px(padding.value.top),
  paddingLeft: px(padding.value.left),
}))

const imgStyle = computed(() => ({ width: px(SPRITE.w), height: px(SPRITE.h) }))

const accessoryStyles = computed(() =>
  accessories.value.map((acc) => ({
    ...acc,
    style: { left: px(acc.x), top: px(acc.y), width: px(acc.w), height: px(acc.h) },
  })),
)

// 종마다 발끝 아래 여백이 달라서, 그만큼 끌어올려야 그림자가 발에 붙는다
const shadowStyle = computed(() => ({
  left: px(padding.value.left + SPRITE.w / 2),
  bottom: px(meta.value.foot),
  width: px(SPRITE.w * 0.52),
  height: `${Math.max(3, props.scale * 1.5)}px`,
}))

const gesture = computed(() => (props.animate ? pickGesture(props.weather) : null))
</script>

<template>
  <div class="dino-stage" :style="stageStyle">
    <!-- 그림자는 몸통 밖에 둬야 몸짓 애니메이션을 따라 흔들리지 않는다 -->
    <span class="dino-shadow" :style="shadowStyle" aria-hidden="true"></span>

    <div class="dino-body" :class="gesture && `is-${gesture}`">
      <img :src="spriteUrl" :alt="alt" class="dino-img" :style="imgStyle" />

      <!-- 액세서리는 스프라이트 위에 절대 위치로 겹친다 -->
      <svg
        v-for="acc in accessoryStyles"
        :key="acc.name"
        class="dino-acc"
        :style="acc.style"
        :viewBox="acc.viewBox"
        shape-rendering="crispEdges"
        aria-hidden="true"
      >
        <rect
          v-for="(r, i) in acc.rects"
          :key="i"
          :x="r.x"
          :y="r.y"
          :width="r.w"
          height="1"
          :fill="r.fill"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.dino-stage {
  position: relative;
  box-sizing: content-box;
}

.dino-body {
  position: relative;
  width: fit-content;
  transform-origin: 50% 100%;
}

.dino-img {
  display: block;
  image-rendering: pixelated;
}

.dino-acc {
  position: absolute;
  overflow: visible;
  pointer-events: none;
}

/* 계단식 픽셀 그림자 — 둥근 그림자는 픽셀 화면에서 겉돈다 */
.dino-shadow {
  position: absolute;
  background: rgb(4 7 14 / 32%);
  transform: translateX(-50%);
}

.dino-shadow::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 12%;
  left: 12%;
  height: 60%;
  background: rgb(4 7 14 / 20%);
}

/* 몸짓 */
.is-idle {
  animation: bob 2.4s ease-in-out infinite;
}

.is-shiver {
  animation: shiver 0.11s linear infinite;
}

.is-pant {
  animation: pant 1.3s ease-in-out infinite;
}

.is-crouch {
  animation: crouch 3s ease-in-out infinite;
}

.is-lean {
  animation: lean 2s ease-in-out infinite;
}

.is-sleep {
  animation: sleep 3.4s ease-in-out infinite;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes shiver {
  0%,
  100% {
    transform: translateX(-1px);
  }

  50% {
    transform: translateX(1px);
  }
}

@keyframes pant {
  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.97);
  }
}

@keyframes crouch {
  0%,
  100% {
    transform: scaleY(1) translateY(0);
  }

  50% {
    transform: scaleY(0.93) translateY(4px);
  }
}

@keyframes lean {
  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-6deg);
  }
}

@keyframes sleep {
  0%,
  100% {
    transform: scaleY(1) translateY(0);
  }

  50% {
    transform: scaleY(0.96) translateY(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dino-body {
    animation: none;
  }
}
</style>
