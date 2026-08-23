<script setup>
import { onUnmounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

//회원가입 폼
const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(userForm.value.email)) {
    ElMessage.warning('올바른 이메일 형식이 아닙니다.')
    return
  }

  if (!userForm.value.agree) {
    ElMessage.warning('이용약관에 동의해야 합니다.')
    return
  }

  ElMessage.success('가입 신청이 정상적으로 완료되었습니다!')
}

//수량과 평점
const productQuantity = ref(1)
const productRate = ref(4)

//삭제 확인과 진행률
const downloadProgress = ref(0)
const isDownloading = ref(false)
let intervalId = null

const confirmDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '서버에 저장된 해당 파일을 영구 삭제하시겠습니까?',
      '최종 경고',
      {
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소',
        type: 'warning',
      },
    )

    ElMessage.success('파일이 안전하게 파쇄되었습니다.')
  } catch {
    ElMessage.info('삭제 작업이 취소되었습니다.')
  }
}

const stopDownload = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }

  isDownloading.value = false
}

const startDownload = () => {
  if (isDownloading.value) return

  downloadProgress.value = 0
  isDownloading.value = true

  intervalId = setInterval(() => {
    downloadProgress.value = Math.min(
      downloadProgress.value + 20,
      100,
    )

    if (downloadProgress.value === 100) {
      stopDownload()
      ElMessage.success('대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}

onUnmounted(stopDownload)
</script>

<template>
  <section class="element-plus-challenge">
    <el-card>
      <template #header>
        📝 실습 1. 회원가입 Form & 인증 제어
      </template>

      <div class="form-group">
        <label>이메일 주소</label>
        <el-input
          v-model="userForm.email"
          type="email"
          placeholder="example@email.com"
          clearable
        />
      </div>

      <div class="agreement">
        <el-switch v-model="userForm.agree" />
        <span>개인정보 수집 및 필수 이용약관에 동의합니다.</span>
      </div>

      <el-button type="success" class="full-button" @click="handleRegister">
        🚀 회원가입하기
      </el-button>
    </el-card>

    <el-card>
      <template #header>
        🛒 실습 2. 커머스 상품 수량 및 평점 시스템
      </template>

      <div class="commerce-row">
        <span>구매 수량 선택:</span>
        <el-input-number
          v-model="productQuantity"
          :min="1"
          :max="10"
        />
        <small>최대 10개 구매 가능</small>
      </div>

      <div class="commerce-row">
        <span>상품 만족도 별점:</span>
        <el-rate
          v-model="productRate"
          show-score
          score-template="{value}점"
        />
      </div>

      <el-alert
        :title="`실시간 장바구니 요약: 선택 수량 ${productQuantity}개 / 평점 ${productRate}점`"
        type="success"
        :closable="false"
      />
    </el-card>

    <el-card>
      <template #header>
        ⚙️ 실습 3. 시스템 피드백 & 프로그레스 인터랙션
      </template>

      <div class="system-actions">
        <el-button type="danger" plain @click="confirmDelete">
          🗑 서버 파일 삭제 테스트
        </el-button>

        <el-button
          type="primary"
          :loading="isDownloading"
          @click="startDownload"
        >
          💾 데이터 동기화 시작
        </el-button>
      </div>

      <el-progress
        :percentage="downloadProgress"
        :status="downloadProgress === 100 ? 'success' : undefined"
      />
    </el-card>
  </section>
</template>

<style scoped>
.element-plus-challenge {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
}

.agreement,
.commerce-row,
.system-actions {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  gap: 10px;
}

.full-button {
  width: 100%;
}

.commerce-row small {
  color: #909399;
}

@media (max-width: 600px) {
  .commerce-row,
  .system-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>