<template>
  <div class="page-container">
    <!-- Progress Steps -->
    <t-steps :current="1" class="steps-bar">
      <t-step-item title="基本信息" />
      <t-step-item title="MBTI测评" />
      <t-step-item title="查看结果" />
    </t-steps>

    <!-- Progress bar -->
    <div class="progress-wrapper">
      <div class="progress-info">
        <span>MBTI 性格测评</span>
        <span>{{ currentIndex + 1 }} / {{ questions.length }}</span>
      </div>
      <t-progress
        :percentage="Math.round(((currentIndex) / questions.length) * 100)"
        :color="{ from: '#0052D9', to: '#0073e6' }"
        size="small"
      />
    </div>

    <!-- Question Card -->
    <div class="question-area">
      <transition name="slide" mode="out-in">
        <div class="question-card" :key="currentIndex">
          <div class="dimension-tag">
            <t-tag theme="primary" variant="light" size="small">
              维度 {{ dimensionNames[currentQuestion.dimension]?.label || '' }}
            </t-tag>
          </div>

          <h3 class="question-text">
            Q{{ currentIndex + 1 }}. {{ currentQuestion.question }}
          </h3>

          <div class="options">
            <div
              class="option-card"
              :class="{ selected: selectedAnswer === currentQuestion.optionA.value }"
              @click="selectAnswer(currentQuestion.optionA.value)"
            >
              <div class="option-radio">
                <div class="radio-dot" v-if="selectedAnswer === currentQuestion.optionA.value"></div>
              </div>
              <span class="option-text">{{ currentQuestion.optionA.text }}</span>
            </div>

            <div class="option-divider">
              <span>或</span>
            </div>

            <div
              class="option-card"
              :class="{ selected: selectedAnswer === currentQuestion.optionB.value }"
              @click="selectAnswer(currentQuestion.optionB.value)"
            >
              <div class="option-radio">
                <div class="radio-dot" v-if="selectedAnswer === currentQuestion.optionB.value"></div>
              </div>
              <span class="option-text">{{ currentQuestion.optionB.text }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <div class="nav-buttons">
      <button
        v-if="currentIndex > 0"
        class="btn-secondary"
        @click="prevQuestion"
      >
        ← 上一题
      </button>
      <div v-else></div>

      <button
        class="btn-primary"
        :disabled="selectedAnswer === null"
        @click="nextQuestion"
      >
        {{ currentIndex < questions.length - 1 ? '下一题 →' : '查看结果 ✨' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userProfile'
import { getMBTIQuestions, calculateMBTI } from '../utils/mbti-calculator'

const router = useRouter()
const store = useUserStore()

const questions = getMBTIQuestions()
const currentIndex = ref(0)
const answers = ref<number[]>(new Array(questions.length).fill(0))
const selectedAnswer = ref<number | null>(null)

const currentQuestion = computed(() => questions[currentIndex.value])

const dimensionNames: Record<string, { label: string }> = {
  E_I: { label: '外向 / 内向' },
  S_N: { label: '实感 / 直觉' },
  T_F: { label: '理性 / 感性' },
  J_P: { label: '判断 / 知觉' },
}

function selectAnswer(value: number) {
  selectedAnswer.value = value
}

function nextQuestion() {
  if (selectedAnswer.value === null) return
  answers.value[currentIndex.value] = selectedAnswer.value

  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    // Restore previous answer if exists
    selectedAnswer.value = answers.value[currentIndex.value] || null
  } else {
    // Calculate final result
    const result = calculateMBTI(answers.value)
    store.setMBTI(result.type, result.scores)
    router.push('/result')
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = answers.value[currentIndex.value] || null
  }
}
</script>

<style scoped>
.steps-bar {
  margin-bottom: 24px;
}

.progress-wrapper {
  margin-bottom: 32px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.question-area {
  min-height: 360px;
  margin-bottom: 24px;
}

.question-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  box-shadow: var(--shadow-md);
}

.dimension-tag {
  margin-bottom: 16px;
}

.question-text {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 28px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
}

.option-card:hover {
  border-color: #b3ceff;
  background: #f8faff;
}

.option-card.selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.25s ease;
}

.option-card.selected .option-radio {
  border-color: var(--primary);
  background: var(--primary);
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.option-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.option-card.selected .option-text {
  color: var(--text-primary);
  font-weight: 500;
}

.option-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.nav-buttons .btn-primary {
  min-width: 140px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
