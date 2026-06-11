<template>
  <div class="page-container">
    <!-- Steps -->
    <t-steps :current="2" class="steps-bar">
      <t-step-item title="基本信息" />
      <t-step-item title="MBTI测评" />
      <t-step-item title="查看结果" />
    </t-steps>

    <div class="result-content">
      <!-- MBTI Type Card -->
      <div class="type-card">
        <div class="type-header">
          <span class="type-emoji">🧠</span>
          <div>
            <h2 class="type-name">{{ store.mbtiType }} — {{ mbtiInfo?.name }}</h2>
            <p class="type-tagline">{{ mbtiInfo?.traits.join(' · ') }}</p>
          </div>
        </div>
      </div>

      <!-- Personality Description -->
      <div class="section-card personality-card">
        <h3 class="section-title">✨ 性格画像</h3>
        <p class="personality-desc">{{ personalityDesc }}</p>
      </div>

      <!-- 年级阶段建议 -->
      <div class="section-card grade-advice-card">
        <h3 class="section-title">{{ gradeAdvice.title }}</h3>
        <ul class="gap-list">
          <li v-for="(tip, i) in gradeAdvice.tips" :key="i">
            <span class="check">{{ icons[i] }}</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
        <div class="grade-focus">{{ gradeAdvice.focus }}</div>
      </div>

      <!-- Dimension Bars -->
      <div class="section-card">
        <h3 class="section-title">📊 四个维度得分</h3>
        <div class="dimension-bars">
          <div v-for="dim in dimensions" :key="dim.key" class="dim-bar">
            <div class="dim-labels">
              <span class="dim-left">{{ dim.left }}</span>
              <span class="dim-right">{{ dim.right }}</span>
            </div>
            <div class="dim-track">
              <div
                class="dim-fill"
                :style="{ width: dim.percent + '%', left: dim.side === 'right' ? '50%' : (50 - dim.percent) + '%' }"
                :class="dim.side"
              ></div>
              <div class="dim-center"></div>
            </div>
            <div class="dim-desc">
              <span class="dim-desc-text">
                {{ dim.score > 0 ? dim.rightLabel : dim.leftLabel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Strengths -->
      <div class="section-card" v-if="mbtiInfo">
        <h3 class="section-title">💪 你的优势</h3>
        <ul class="gap-list">
          <li v-for="s in mbtiInfo.strengths" :key="s">
            <span class="check">✅</span>
            <span>{{ s }}</span>
          </li>
        </ul>
      </div>

      <!-- Growth Tips -->
      <div class="section-card" v-if="mbtiInfo">
        <h3 class="section-title">🌱 成长建议</h3>
        <ul class="gap-list">
          <li v-for="t in mbtiInfo.growthTips" :key="t">
            <span class="check">💡</span>
            <span>{{ t }}</span>
          </li>
        </ul>
      </div>

      <!-- Career Direction -->
      <div class="section-card" v-if="mbtiInfo">
        <h3 class="section-title">🎯 适合的岗位方向</h3>
        <div class="career-tags">
          <span v-for="d in mbtiInfo.careerDirections" :key="d" class="tag tag-primary">
            {{ d }}
          </span>
        </div>
      </div>

      <!-- CTA -->
      <button class="btn-primary btn-full" @click="viewJobs">
        🎯 查看为你推荐的岗位
      </button>

      <button class="btn-secondary btn-full" style="margin-top: 12px;" @click="retake">
        🔄 重新测评
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userProfile'
import { getMBTIInfo } from '../data/mbti-career-map'
import { getMBTIDimensionNames } from '../utils/mbti-calculator'
import { getPersonalizedRecommendedJobs } from '../data/job-positions'

const router = useRouter()
const store = useUserStore()

const mbtiInfo = computed(() => getMBTIInfo(store.mbtiType))
const personalityDesc = computed(() => store.getMBTIDescription(store.mbtiType))
const gradeAdvice = computed(() => store.getGradeAdvice(store.grade))

const icons = ['🌱', '🎯', '📚', '💪']

const dimensions = computed(() => {
  const names = getMBTIDimensionNames()
  const result: any[] = []
  for (const [key, info] of Object.entries(names)) {
    const score = store.mbtiScores[key as keyof typeof store.mbtiScores] || 0
    const absScore = Math.abs(score)
    const maxScore = 3
    const percent = Math.round((absScore / maxScore) * 50)
    result.push({
      key,
      left: info.left,
      right: info.right,
      leftLabel: info.leftLabel,
      rightLabel: info.rightLabel,
      score,
      percent,
      side: score > 0 ? 'right' : 'left',
    })
  }
  return result
})

function viewJobs() {
  // 在跳转前生成个性化推荐并保存到 store
  const recommendations = getPersonalizedRecommendedJobs(
    store.grade,
    store.major,
    store.mbtiType,
    store.interestedFields
  )
  store.setRecommendedJobs(recommendations)
  router.push('/recommend')
}

function retake() {
  router.push('/mbti')
}
</script>

<style scoped>
.steps-bar {
  margin-bottom: 24px;
}

.result-content {
  max-width: 440px;
  margin: 0 auto;
}

.type-card {
  background: linear-gradient(135deg, #0052D9 0%, #0073e6 100%);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 82, 217, 0.2);
}

.type-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.type-emoji {
  font-size: 48px;
  flex-shrink: 0;
}

.type-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.type-tagline {
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.5;
}

.section-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.dimension-bars {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dim-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dim-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.dim-track {
  position: relative;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.dim-fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

.dim-fill.left {
  background: linear-gradient(90deg, #0052D9, #4787f0);
}

.dim-fill.right {
  background: linear-gradient(90deg, #4787f0, #0052D9);
}

.dim-center {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: white;
  z-index: 2;
}

.dim-desc {
  font-size: 11px;
  color: var(--text-tertiary);
}

.check {
  flex-shrink: 0;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-full {
  width: 100%;
}

.btn-secondary.btn-full {
  margin-top: 12px;
}

/* ====== 性格画像 ====== */
.personality-card {
  border-left: 4px solid var(--primary);
}

.personality-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* ====== 年级建议 ====== */
.grade-advice-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #faf5ff 100%);
  border: 1px solid #d1fae5;
}

.grade-focus {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(0, 82, 217, 0.06);
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}
</style>
