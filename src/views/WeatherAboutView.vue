<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SceneGallery from '@/components/scene/SceneGallery.vue'
import DinoShowcase from '@/components/scene/DinoShowcase.vue'
import { SCENE_GROUPS } from '@/data/weatherScenes'
import { dinos } from '@/data/matchDino'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const weatherStore = useWeatherStore()

// 날씨 그룹마다 대표 WMO 코드 하나씩 (배경 미리보기용)
const SCENES = [
  { group: 'clear', code: 0, label: '맑음' },
  { group: 'cloudy', code: 3, label: '흐림' },
  { group: 'fog', code: 45, label: '안개' },
  { group: 'drizzle', code: 53, label: '이슬비' },
  { group: 'rain', code: 63, label: '비' },
  { group: 'shower', code: 81, label: '소나기' },
  { group: 'snow', code: 73, label: '눈' },
  { group: 'thunder', code: 95, label: '뇌우' },
]

// 공룡이 어떻게 갈리는지 보여줄 날씨 예시
const DINO_SAMPLES = [
  { label: '맑고 더운 날', weather: { temp: 33, humidity: 45, weatherCode: 0, wind: 8 } },
  { label: '비 오는 날', weather: { temp: 20, humidity: 85, weatherCode: 63, wind: 10 } },
  { label: '뇌우 치는 날', weather: { temp: 24, humidity: 85, weatherCode: 95, wind: 15 } },
  { label: '안개 낀 날', weather: { temp: 15, humidity: 90, weatherCode: 45, wind: 3 } },
  { label: '눈 오는 날', weather: { temp: -2, humidity: 70, weatherCode: 71, wind: 12 } },
  { label: '바람 부는 날', weather: { temp: 15, humidity: 50, weatherCode: 1, wind: 35 } },
]

const HOW_TO = [
  {
    title: '지역을 고릅니다',
    body: '왼쪽 지도의 점을 누르거나, 오른쪽 관측소 카드를 누르세요. 마커 색이 곧 그 지역 기온입니다.',
  },
  {
    title: '배경이 바뀝니다',
    body: '고른 지역의 하늘이 화면 배경이 됩니다. 비가 오면 비가 내리고, 밤이면 별이 뜹니다.',
  },
  {
    title: '자주 보는 곳은 별을 누르세요',
    body: '즐겨찾기한 지역은 목록 맨 위로 올라옵니다. 브라우저에 저장돼서 다시 와도 그대로입니다.',
  },
  {
    title: '아래로 내려가 보세요',
    body: '운석 경보로 오늘 조심할 것을, 발자국으로 24시간 기온 흐름을, 맨 아래에서 오늘의 공룡을 볼 수 있습니다.',
  },
]

const TECH = [
  { name: 'Vue 3 + Vite', body: '<script setup> 문법으로 작성했습니다.' },
  { name: 'Pinia', body: '날씨·즐겨찾기·단위 설정을 스토어로 나눠 관리합니다.' },
  { name: 'Vue Router', body: '화면마다 주소가 있고, 필요한 순간에만 코드를 내려받습니다.' },
  { name: 'Axios', body: '여러 지역을 한 번에 요청하고, 실패한 곳만 따로 처리합니다.' },
  { name: 'PrimeVue', body: '버튼·카드·입력창을 가져다 픽셀 테마로 다시 칠했습니다.' },
  { name: 'SVG 픽셀 그래픽', body: '배경·지도·발자국을 격자 위에 직접 그렸습니다.' },
  {
    name: '96×72 도트 스프라이트',
    body: '공룡 9종은 픽셀 이미지로 그리고, 우산·목도리 같은 소품만 SVG로 얹습니다.',
  },
]

const moveToHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <div class="about-page">
    <header class="about-hero">
      <span class="px-eyebrow">ABOUT</span>
      <h1>중생대 날씨 관측소</h1>
      <p class="about-hero__lead">
        숫자를 읽는 대신 <strong>하늘을 보고 날씨를 아는</strong> 날씨 앱입니다. 지역을 고르면 그
        지역의 하늘이 화면 배경이 되고, 그 날씨에 어울리는 공룡이 마스코트로 나타납니다.
      </p>
    </header>

    <BaseDashboardCard title="이렇게 써보세요" subtitle="처음이시라면 순서대로">
      <ol class="steps">
        <li v-for="(step, i) in HOW_TO" :key="step.title">
          <span class="steps__no">{{ i + 1 }}</span>
          <div>
            <strong>{{ step.title }}</strong>
            <p>{{ step.body }}</p>
          </div>
        </li>
      </ol>
    </BaseDashboardCard>

    <BaseDashboardCard
      title="오늘의 공룡은 어떻게 정해지나요"
      :subtitle="`${dinos.length}종 중에서 그날 날씨에 가장 잘 맞는 한 마리`"
    >
      <p class="about-text">
        공룡마다 살던 환경이 다릅니다. 물가에 살던 공룡, 갑옷으로 추위를 견디던 공룡, 골판으로 열을
        식히던 공룡이 각각 있습니다. 그래서 <strong>기온 · 습도 · 풍속 · 날씨 상태</strong>를 점수로
        매겨 그날 가장 잘 맞는 한 마리를 고릅니다.
      </p>

      <DinoShowcase :samples="DINO_SAMPLES" />

      <Divider />

      <p class="about-text">
        고른 공룡은 날씨에 따라
        <strong
          >우산을 쓰고, 선글라스를 끼고, 목도리를 두르고, 미세먼지가 심하면 마스크를 씁니다.</strong
        >
        추우면 덜덜 떨고, 더우면 헐떡이고, 바람이 세면 몸을 기울이고, 밤에는 졸기 시작합니다.
      </p>
      <p class="px-dim">
        점수는 날씨 상태가 맞으면 40점, 좋아하는 기온 구간이면 30점, 습도 성향이 맞으면 15점, 바람
        조건을 채우면 15점을 더하는 식으로 계산합니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard
      title="날씨별 배경"
      :subtitle="`${SCENE_GROUPS.length}가지 하늘 × 낮과 밤 = ${SCENE_GROUPS.length * 2}가지 화면`"
    >
      <SceneGallery :samples="SCENES" />
      <p class="px-dim">
        화산이 연기를 뿜고, 비가 내리고, 밤에는 별이 뜹니다. 지역을 바꾸면 배경이 서서히 겹쳐지며
        바뀝니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard
      title="왜 지역이 이만큼만 있나요"
      :subtitle="`현재 ${weatherStore.weatherList.length}곳 · 계속 늘려갈 예정입니다`"
    >
      <p class="about-text">
        지금은 전국 주요 <strong>{{ weatherStore.weatherList.length }}개 시</strong>를 보여드리고
        있습니다. 시·군·구 단위로 전부 넣으면 226곳이 되는데, 날씨 데이터를 받아오는 곳의
        <strong>분당 요청 한도</strong>를 넘어서 화면이 아예 안 뜨게 됩니다.
      </p>
      <p class="about-text">
        그래서 지금은 한도 안에서 최대한 촘촘하게 담았습니다. 요청을 나눠 보내는 방식으로 바꾸면 더
        늘릴 수 있어서, <strong>읍·면 단위까지 확장할 계획</strong>입니다.
      </p>
      <p class="px-dim">찾으시는 지역이 없다면 가까운 시를 골라주세요. 날씨는 대체로 비슷합니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="쓰인 기술" subtitle="무엇으로 만들었나">
      <ul class="tech-list">
        <li v-for="item in TECH" :key="item.name">
          <strong>{{ item.name }}</strong>
          <span>{{ item.body }}</span>
        </li>
      </ul>

      <p class="px-dim">날씨는 OpenWeatherMap에서, 자외선과 오존은 Open-Meteo에서 받아옵니다.</p>

      <Divider />

      <Button label="관측소로 돌아가기" icon="pi pi-home" @click="moveToHome" />
    </BaseDashboardCard>
  </div>
</template>

<style scoped src="./WeatherAboutView.css"></style>
