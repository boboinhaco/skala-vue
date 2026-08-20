<script setup>
import { ref, reactive, computed, watch } from 'vue'
import WeatherParent from '@/components/exercise/WeatherParent.vue'
import PropsEmitsParent from '@/components/practices/PropsEmitsParent.vue'
import LifecycleDemo from '@/components/practices/LifecycleDemo.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'

let normalCount = 0
const vueCount = ref(0)
const welcomeMessage = 'Welcome to Skala-Vue'
const rawHtmlData = '이 글자는 <span style="color: red; font-weight: bold;">빨간색 굵은 글자 </span>이다.'

const inputValue = ref('')
const message = ref('')
function showMessage() {
  message.value = inputValue.value
}

const content = '안녕하세요! <strong>Skala-Vue</strong>강의입니다.'

const dynamicUrl = 'https://www.naver.com'
const logoImSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)

const isWarning = ref(false)
const themeClass = ref('bg-dark')

const textColor = ref('purple')
const boxWidth = ref(150)
const baseBoxStyle = ref({
  backgroundColor: '#42b883',
  height: '100px',
  transition: 'all 0.3s ease',
})

const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'

const isLogged = ref(false)
const score = ref(85)

const inVisible = ref(true)

const count = ref(0)
const showAlert = () => {
  alert('함수가 성공적으로 호출되었습니다!')
}

const position = ref('')
const tagName = ref('')
const getOnlyEvent = (e) => {
  position.value = `좌표: X=${e.clientX}, Y=${e.clientY}`
}
const getWithParam = (name, e) => {
  tagName.value = `대상: ${name} / 클릭된 태그: ${e.target.tagName}`
}

const handleLink = () => {
  alert('수식어 덕분에 네이버로 이동하지 않고 함수만 실행됩니다!')
}
const handleBox = () => {
  alert('부모 박스가 클릭되었습니다!')
}
const handleChild1 = () => {
  alert('1번 자식 클릭!')
}
const handleChild2 = () => {
  alert('2번 자식 클릭!')
}

const text1 = ref('')
const text2 = ref('')

const comment = ref('')
const isAgreed = ref(false)
const favoriteFruits = ref([])
const gender = ref('')
const selectedCar = ref('')

const lazyText = ref('')
const age = ref('')
const userEmail = ref('')
const price = ref('')

const name = ref('홍길동')
const isActive = ref(true)
const items = ref(['사과', '배'])
const user = ref({ name: '이순신', age: 30 })
const increaseRef = () => { count.value++ }
const changeUserName = () => { user.value.name = '장보고' }

const userReactive = reactive({ name: '이순신', age: 30, })
const celebrateReactive = () => { userReactive.age++ }
const items1 = reactive(['사과', '바나나'])
// const addItem = () => { items1.push(`과일 ${items1.length + 1}`) } -> 배열 길이 때문에 삭제해도 하나 더 생김
let fruitSeq = 2
const addItem = () => { items1.push(`과일 ${++fruitSeq}`) }
const removeItem = (index) => { items1.splice(index, 1) }

const dummy = ref(0)
const getMethodResult = () => {
  console.log('❌ 일반 함수 실행됨!')
  return count.value * 2
}
const doubleCount = computed(() => {
  console.log('✅ Computed 연산 실행됨!')
  return count.value * 2
})

const currentCity = ref('서울')
const logMessage = ref('아직 감시 시스템이 작동하지 않았습니다.')
watch(currentCity, (newValue, oldValue) => {
  logMessage.value = `📍 감시자 발동! [${oldValue}]에서 [${newValue}]로 변경됨.`
  console.log(`🤖 [서버 요청 완료] 기상청 서버에서 ${newValue}의 날씨 API를 다시 조회합니다...`)
})

const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기 중...')
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate}) ➡️ ${newCity}(${newDate})`
  console.log(`🤖 [통합 API 호출] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)
})

const user1 = ref({ name: '홍길동', age: 20, })
const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')
//객체 내부 어디든 바뀌면 알 수 있음
watch(user1, (newVal) => {
  logDeep.value = `[deep 감지] 누군가 변경됨! 현재 이름: ${newVal.name}, 나이: ${newVal.age}`
}, { deep: true },)
//객체의 특정 값만 감시 가능(새 값까지 알 수 있음)
watch(() => user1.value.age, (newAge, oldAge) => {
  logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
},)

// 라이프사이클 훅 실습은 LifecycleDemo.vue로 분리 (v-if로 파괴해야 onUnmounted가 실행됨)
const isAlive = ref(true)
</script>

<template>
  <header>
    <div class="practice-section">
      <h2>Hello Skala-Vue</h2>
      <h3>일반 변수 클릭: {{ normalCount }}</h3>
      <button @click="normalCount++">일반 변수 증가</button>
      <br />
      <h3>Vue 반응성 변수 클릭: {{ vueCount }}</h3>
      <button @click="vueCount++">Vue 반응성 변수 증가</button>
    </div>

    <div class="practice-section">
      <h2>{{ welcomeMessage }}</h2>
      <p>{{ welcomeMessage.toUpperCase() }}</p>
      <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
    </div>

    <div class="practice-section">
      <h2>v-html 디렉티브 학습</h2>
      <h3>일반 보간법 {{ }} 사용 결과:</h3>
      <p>{{ rawHtmlData }}</p>
      <br />
      <h3>v-html 디렉티브 사용 결과:</h3>
      <p v-html="rawHtmlData"></p>
    </div>

    <div class="practice-section">
      <h2>v-html XSS 학습</h2>
      <input v-model="inputValue" placeholder="내용을 입력하세요" />
      <button @click="showMessage">확인</button>
      <div v-html="message"></div>
    </div>

    <div class="practice-section">
      <h2>v-text 디렉티브 학습</h2>
      <h3>1) 일반 보간법 {{ }} 결과: </h3>
      <p>출력: {{ content }}</p>
      <br />

      <h3>2) v-text 디렉티브 사용 결과:</h3>
      <p v-text="'출력: ' + content"></p>
      <br />

      <h3>3) v-html 결과 비교:</h3>
      <p v-html="content"></p>
    </div>

    <div class="practice-section">
      <h2>v-bind 디렉티브 기본 (축약형: 콜론)</h2>
      <h3>1) 동적 링크 연결</h3>
      <a :href="dynamicUrl">여기를 클릭하면 네이버로 이동합니다</a>
      <br />

      <h3>2) 동적 이미지 연결</h3>
      <img :src="logoImSrc" alt="Vue 로고" style="width: 100px" />
      <br />

      <h3>3) 버튼 비활성화 제어</h3>
      <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
      <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>&nbsp;
      <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
    </div>

    <div class="practice-section">
      <h2>v-bind 디렉티브 고급 (클래스 바인딩)</h2>
      <h3>클래스 바인딩 (객체 형식)</h3>
      <p :class="{ 'text-danger': isWarning }">현재 경고 상태: {{ isWarning }}</p>
      <button @click="isWarning = !isWarning">경고 상태 토글</button>
      <br />

      <h3>클래스 바인딩 (배열 형식)</h3>
      <div :class="[themeClass, isWarning ? 'border-red' : 'border-gray']">다중 클래스가 조립된 박스 구역입니다.</div>
    </div>

    <div class="practice-section">
      <h2>v-bind 디렉티브 고급 (스타일 바인딩)</h2>
      <h3>1) 인라인 스타일 변수 조작 (객체 형식)</h3>
      <p :style="{ color: textColor, fontWeight: 'bold' }">이 글자의 색상은 실시간으로 바뀝니다.</p>
      <button @click="textColor = textColor === 'purple' ? 'blue' : 'purple'">글자 색상 토글</button>
      <br />

      <h3>2) 다중 스타일 객체 조립 (배열 형식)</h3>
      <label>박스 가로 크기(px): </label>
      <input type="number" v-model="boxWidth" step="50" />
      <br />

      <div :style="[baseBoxStyle, { width: boxWidth + 'px' }]">
        <p style="color: white; padding: 10px; text-align: center">가로 크기: {{ boxWidth }}px 박스</p>
      </div>
    </div>

    <div class="practice-section">
      <h2>v-bind 디렉티브 고급 (단축 문법)</h2>
      <div :id>
        <img :src alt="Vue 로고" style="width: 50px" />
      </div>
    </div>

    <div class="practice-section">
      <h2>v-if, v-else-if, v-else 디렉티브 학습</h2>
      <h3>1) 기본 로그인 상태 스위치</h3>
      <p v-if="isLogged">환영합니다! 회원 전용 화면입니다.</p>
      <p v-else>로그인이 필요합니다. 먼저 로그인해 주세요.</p>
      <button @click="isLogged = !isLogged">
        {{ isLogged ? '로그아웃하기' : '로그인하기' }}
      </button>
      <br />

      <h3>2) 성적별 학점 등급 측정 (다중 조건문)</h3>
      <label>현재 점수 입력: </label>
      <input type="number" v-model="score" min="0" max="100" step="5" />
      <br />

      <div v-if="score >= 90" style="color: green; font-weight: bold">합격등급: A 학점 (훌륭합니다!)</div>
      <div v-else-if="score >= 80" style="color: blue">합격등급: B 학점 (양호합니다.)</div>
      <div v-else-if="score >= 70" style="color: orange">합격등급: C 학점 (조금 더 분발하세요.)</div>
      <div v-else style="color: red; font-weight: bold">합격등급: F 학점 (재시험 대상입니다.)</div>
    </div>

    <div class="practice-section">
      <h2>v-show 디렉티브 학습</h2>
      <button @click="inVisible = !inVisible">화면 토글하기 </button>
      <br />

      <div v-show="inVisible" class="box">
        <p>v-show 상자</p>
        <p>조건이 false가 되면 CSS display: none이 붙습니다.</p>
      </div>
    </div>

    <div class="practice-section">
      <h2>v-on 이벤트 핸들링 기초</h2>
      <h3>1) 인라인 연산 처리</h3>
      <p>현재 카운트: {{ count }}</p>
      <button @click="count++">1씩 증가</button>
      <br />

      <h3>2) 스크립트 함수 호출</h3>
      <button @click="showAlert">알림창 띄우기</button>
    </div>

    <div class="practice-section">
      <h2>v-on 이벤트 객체($event) 활용</h2>
      <p>좌표: {{ position }}</p>
      <p>태그: {{ tagName }}</p>
      <button @click="getOnlyEvent">클릭 좌표 알아내기</button>
      <button @click="getWithParam('회원A', $event)">회원 정보와 태그 확인</button>
    </div>

    <div class="practice-section">
      <h2>이벤트 수식어(Modifiers) 학습</h2>
      <h3>1) .prevent (기본 동작 막기)</h3>
      <a href="https://www.naver.com" @click.prevent="handleLink">네이버 링크</a>
      <br />
      <h3>2) .stop (이벤트 버블링 막기)</h3>
      <div @click="handleBox" style="padding: 20px; background-color: #eee">
        <p>부모 영역 (클릭 시 alert 발동)</p>
        <button @click="handleChild1">버블링 발생 버튼</button>
        <button @click.stop="handleChild2">버블링 차단 버튼</button>
      </div>
    </div>

    <div class="practice-section">
      <h2>v-model 양방향 데이터 바인딩</h2>
      <h3>1) v-model 축약 문법 (양방향)</h3>
      <input type="text" v-model="text1" placeholder="여기에 입력하세요" />
      <p>입력된 값: <strong>{{ text1 }}</strong></p>
      <h3>2) y-model의 내부 작동 원리 (단방향 + 이벤트)</h3>
      <input type="text" :value="text2" @input="(e) => (text2 = e.target.value)" placeholder="원리파악용 입력창" />
      <p>입력된 값: <strong>{{ text2 }}</strong></p>
    </div>

    <div class="practice-section">
      <h2>모든 HTML Form 요소와 v-model 매핑</h2>
      <div>
        <h3>1) Textarea (장문 텍스트)</h3>
        <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
        <p>데이터 상태 : <span>{{ comment }}</span></p>
      </div>
      <div>
        <h3>2) 단일 Checkbox (동의여부)</h3>
        <label> <input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다. </label>
        <p>데이터 상태 : <span>{{ isAgreed }}</span></p>
      </div>
      <div>
        <h3>3) 다중 Checkbox (복수선택 -> 배열에 저장)</h3>
        <label><input type="checkbox" value="사과" v-model="favoriteFruits" /> 사과</label> &nbsp;
        <label><input type="checkbox" value="바나나" v-model="favoriteFruits" /> 바나나</label> &nbsp;
        <label><input type="checkbox" value="딸기" v-model="favoriteFruits" /> 딸기</label> &nbsp;
        <p>데이터 상태 (배열): <span>{{ favoriteFruits }}</span></p>
      </div>
      <div>
        <h3>4) Radio (단일선택)</h3>
        <label><input type="radio" value="남성" v-model="gender" /> 남성</label> &nbsp;
        <label><input type="radio" value="여성" v-model="gender" /> 여성</label>
        <p>데이터 상태 : <span>{{ gender }}</span></p>
      </div>
      <div>
        <h3>5) Select (드롭다운 선택)</h3>
        <select v-model="selectedCar">
          <option value="">-- 선택하세요 --</option>
          <option value="tesla">테슬라</option>
          <option value="hundai">현대</option>
          <option value="bmw">BMW</option>
        </select>
        <p>데이터 상태 : <span>{{ selectedCar }}</span></p>
      </div>
    </div>

    <div class="practice-section">
      <h2>v-model 수식어 (Modifiers) 활용</h2>
      <section style="margin-bottom: 20px">
        <h3>1) .lazy 수식어 (change 이벤트 시점 반영)</h3>
        <input type="text" v-model.lazy="lazyText" placeholder="입력 후 Enter 또는 외부 클릭" />
        <p>실시간이 아닌 확정된 값: <strong>{{ lazyText }}</strong></p>
      </section>
      <section style="margin-bottom: 20px">
        <h3>2) .number 수식어 (Number 타입 자동 형변환)</h3>
        <input type="text" v-model.number="age" placeholder="나이를 입력하세요" />
        <p>입력된 값: <strong>{{ age }}</strong></p>
        <p>데이터타입: <strong>{{ typeof age }}</strong></p>
      </section>
      <section>
        <h3>3) .trim 수식어 (양끝 공백 자동 제거)</h3>
        <input type="text" v-model.trim="userEmail" placeholder="앞뒤 공백을 포함해 입력해 보세요" />
        <p>공백 제거된 값: <strong>"{{ userEmail }}"</strong></p>
        <p>문자열 길이: <strong>{{ userEmail.length }}</strong></p>
      </section>
      <section>
        <h3>4) Chaining (수식어 체이닝: .trim.number)</h3>
        <p><input type="text" v-model.trim.number="price" placeholder="공백과 숫자를 섞어 입력해 보세요" /></p>
        <p>데이터 타입: <strong>{{ typeof price }}</strong></p>
      </section>
    </div>

    <div class="practice-section">
      <h2>Scoped 스타일 및 외부 CSS 활용</h2>
      <p class="title">이 글자는 이 컴포넌트 내부에서만 빨간색이 됩니다.</p>
      <button class="btn-external">외부 CSS에서 불러온 버튼 스타일</button>
    </div>

    <div class="practice-section">
      <h2>반응형 상태 ref() 기초</h2>
      <p>Ref 카운트: <strong>{{ count }}</strong></p>
      <p>이름: <input v-model="name" />{{ name }}</p>
      <p>활성 상태: {{ isActive ? '활성' : '비활성' }}</p>
      <p>과일 목록: {{ items.join(', ') }}</p>
      <p>사용자 정보: 이름- {{ user.name }}, 나이- {{ user.age }}</p>
      <button @click="increaseRef">Ref 변수 증가</button>
      <button @click="isActive = !isActive">토글</button>
      <button @click="items.push('귤')">과일 추가</button>
      <button @click="changeUserName">사용자 이름 변경</button>
    </div>

    <div class="practice-section">
      <h2>반응형 상태 reactive() 특징 및 주의점</h2>
      <h3>1) 객체(Object) reactive</h3>
      <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>
      <button @click="celebrateReactive">reactive 나이 한 살 추가</button>
      <h3>2) 배열(Array) reactive</h3>
      <ul>
        <li v-for="(item, index) in items1" :key="index">
          {{ item }}
          <button @click="removeItem(index)" style="margin-left: 8px; padding: 2px 6px">삭제</button>
        </li>
      </ul>
      <button @click="addItem">과일 항목 추가</button>
    </div>

    <div class="practice-section">
      <h2>computed() 캐싱 동작 비교</h2>
      <p>count: {{ count }} | dummy: {{ dummy }}</p>
      <button @click="count++">count 증가 (의존성 변경)</button>
      <button @click="dummy++">dummy 증가 (무관한 변경)</button>
      <!-- computed:count가 바뀌지 않으면 값 재사용(성능 좋음) / 일반함수:그냥 재계산(성능 떨어짐) -->
      <p>일반 함수 결과: {{ getMethodResult() }}</p>
      <p>Computed 결과: {{ doubleCount }}</p>
    </div>

    <div class="practice-section">
      <h2>감시자 watch()의 원리와 실무 활용</h2>
      <h3>지역 선택 제어판</h3>
      <p>현재 선택된 도시: {{ currentCity }}</p>
      <button @click="currentCity =
        '서울'">서울 선택</button> &nbsp;
      <button @click="currentCity =
        '수원'">수원 선택</button> &nbsp;
      <button @click="currentCity =
        '부산'">부산 선택</button>
      <div class="monitor">
        <h3>👁️ 파수꾼(watch) 모니터링 시스템 👁️ </h3>
        <p>{{ logMessage }}</p>
        <small style="color: gray">(버튼을 누른 후 브라우저 콘솔창 F12를 확인해 보세요)</small>
      </div>
    </div>

    <div class="practice-section">
      <h2>여러 개의 변수 동시 감시 (watch)</h2>
      <h3>날씨 조건 설정</h3>
      <label>도시: </label>
      <select v-model="city">
        <option value="서울">서울</option>
        <option value="수원">수원</option>
        <option value="부산">부산</option>
      </select> &nbsp;
      <label>날짜: </label>
      <label><input type="radio" value="오늘" v-model="dateType" /> 오늘</label> &nbsp;
      <label><input type="radio" value="내일" v-model="dateType" /> 내일</label> &nbsp;
      <label><input type="radio" value="주간예보" v-model="dateType" /> 주간예보</label>
      <div class="monitor">
        <h3>통합 모니터링 로그</h3>
        <p>현재 상태: {{ apiStatus }}</p>
      </div>
    </div>

    <div class="practice-section">
      <h2>ref 객체/배열 감시</h2>
      <h3>회원 데이터 조작 panel</h3>
      <p>이름: {{ user1.name }} / 나이: {{ user1.age }}세</p>
      <button @click="user1.name =
        '이순신'">이름만 변경</button> &nbsp;
      <button @click="user1.age++">나이만 변경 (age++)</button>
      <div class="monitor">
        <p>1) deep: true 모니터 (전체 감시)</p>
        <p>{{ logDeep }}</p>
      </div>
      <div class="monitor target">
        <p>2) 화살표 함수 모니터 (나이만 타겟 감시)</p>
        <p>{{ logTarget }}</p>
      </div>
    </div>

    <div class="practice-section">
      <h2>Lifecycle Hook</h2>
      <button class="btn-destroy" @click="isAlive = !isAlive">
        🔴 실습 컴포넌트 {{ isAlive ? '파괴하기' : '되살리기' }} (v-if="false")
      </button>
      <hr />
      <h3>⏱️ 라이프사이클 훅 흐름 탐색기</h3>
      <LifecycleDemo v-if="isAlive" />
    </div>

    <PropsEmitsParent />

    <SlotDefaultParent />
    <SlotNamedParent />
    <SlotScopedParent />
  </header>

  <WeatherParent />
</template>

<style>
@import '@/assets/practice.css';

.text-danger {
  color: red;
  font-weight: bold;
}

.bg-dark {
  background-color: #333;
  color: white;
  padding: 15px;
}

.border-red {
  border: 3px solid red;
}

.border-gray {
  border: 3px solid #ccc;
}

.box {
  padding: 10px;
  margin-top: 5px;
  color: white;
  border-radius: 5px;
  background-color: #3498db;
}

.title {
  color: #ff7675;
  font-weight: bold;
  font-size: 18px;
}
</style>
