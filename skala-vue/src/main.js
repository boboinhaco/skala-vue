import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primeicons/primeicons.css'

// 픽셀 테마는 제일 마지막에 와야 Element Plus / PrimeIcons 기본 스타일을 덮는다
import './assets/pixel.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 픽셀 UI라 둥근 모서리를 전부 없애고, 강조색은 용암/모래 느낌의 주황으로 맞춘다
const PixelPreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '0', sm: '0', md: '0', lg: '0', xl: '0' },
  },
  semantic: {
    primary: {
      50: '#fef6e7',
      100: '#fce9c4',
      200: '#f9d695',
      300: '#f7c76a',
      400: '#f5b642',
      500: '#e09420',
      600: '#c98a1c',
      700: '#9c6715',
      800: '#7a5115',
      900: '#5f3f14',
      950: '#33210a',
    },
    focusRing: { width: '3px', style: 'solid', offset: '3px' },
  },
})

// PrimeVue 5는 라이선스 키가 필요하다. 키를 저장소에 커밋하지 않도록
// .env.local 의 VITE_PRIMEUI_LICENSE 에서 읽는다.
const PRIMEVUE_LICENSE = import.meta.env.VITE_PRIMEUI_LICENSE

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(PrimeVue, {
  // 키가 없으면 항목 자체를 빼서 기본 동작(미설정)으로 둔다
  ...(PRIMEVUE_LICENSE ? { license: PRIMEVUE_LICENSE } : {}),
  ripple: true,
  theme: {
    preset: PixelPreset,
    options: {
      // .p-dark 클래스가 붙은 경우에만 다크 모드 적용
      darkModeSelector: '.p-dark',
      // PrimeVue 스타일을 레이어에 넣어서 pixel.css가 항상 이기게 한다
      cssLayer: { name: 'primevue', order: 'primevue' },
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
