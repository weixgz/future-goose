<template>
  <div class="page-container">
      <div class="page-header">
      <div class="icon">🎯</div>
      <h1>为你匹配的岗位</h1>
      <p>基于你的「{{ store.major }}」专业 · {{ gradeLabel }} · MBTI「{{ store.mbtiType }}」
        <span v-if="store.interestedFields.length > 0"> · 兴趣「{{ interestLabel }}」</span>
      </p>
    </div>

    <!-- 专业对口推荐 -->
    <div class="section-block" v-if="professionalJobs.length > 0">
      <div class="section-label">
        <t-tag theme="primary" variant="dark">📌 专业对口推荐</t-tag>
      </div>
      <div
        v-for="job in professionalJobs"
        :key="job.id"
        class="job-card"
        @click="viewJobDetail(job)"
      >
        <div class="job-header">
          <div class="job-title-row">
            <h3>{{ job.title }}</h3>
            <span class="match-badge high">{{ job.matchScore }}% 匹配</span>
          </div>
          <div class="job-meta">
            <t-tag size="small" variant="light">{{ job.category }}</t-tag>
            <span class="meta-sep">·</span>
            <span class="dept-text">{{ job.department }}</span>
          </div>
        </div>
        <p class="job-desc">{{ job.description }}</p>
        <div class="job-skills">
          <span v-for="s in job.jd.hardSkills.slice(0, 4)" :key="s" class="skill-dot">{{ s }}</span>
        </div>
        <div class="match-reason">💡 {{ job.matchReason }}</div>
        <div class="job-arrow">查看JD拆解 →</div>
      </div>
    </div>

    <!-- 性格匹配推荐 -->
    <div class="section-block" v-if="personalityJobs.length > 0">
      <div class="section-label">
        <t-tag theme="success" variant="dark">🌟 性格匹配推荐（跨专业惊喜）</t-tag>
      </div>
      <div
        v-for="job in personalityJobs"
        :key="job.id"
        class="job-card personality-card"
        @click="viewJobDetail(job)"
      >
        <div class="job-header">
          <div class="job-title-row">
            <h3>{{ job.title }}</h3>
            <span class="match-badge mid">{{ job.matchScore }}% 匹配</span>
          </div>
          <div class="job-meta">
            <t-tag size="small" variant="light">{{ job.category }}</t-tag>
            <span class="meta-sep">·</span>
            <span class="dept-text">{{ job.department }}</span>
          </div>
        </div>
        <p class="job-desc">{{ job.description }}</p>
        <div class="match-reason">💡 {{ job.matchReason }}</div>
        <div class="job-arrow">查看JD拆解 →</div>
      </div>
    </div>

    <!-- AI Chat CTA -->
    <div class="chat-cta">
      <p>想和鹅学姐聊聊这些岗位吗？</p>
      <button class="btn-primary btn-full" @click="goChat">
        💬 找鹅学姐聊聊
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type JobPosition } from '../stores/userProfile'
import { getPersonalizedRecommendedJobs } from '../data/job-positions'

const router = useRouter()
const store = useUserStore()

const gradeLabel = computed(() => {
  const labels: Record<string, string> = {
    freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四', graduate: '研究生',
  }
  return labels[store.grade] || store.grade
})

const interestLabel = computed(() => {
  const labels: Record<string, string> = {
    tech: '技术', product: '产品', design: '设计',
    operation: '运营', market: '市场', function: '职能',
  }
  return store.interestedFields.map(f => labels[f] || f).join('、')
})

// 优先使用 store 中已保存的推荐结果（从 ResultPage 跳转过来时已计算）
// 否则实时计算
const allRecommended = computed(() => {
  if (store.recommendedJobs.length > 0) return store.recommendedJobs
  return getPersonalizedRecommendedJobs(
    store.grade,
    store.major,
    store.mbtiType,
    store.interestedFields
  )
})

const professionalJobs = computed(() =>
  allRecommended.value
    .filter(j => j.matchType === 'professional' || (j.matchType === 'personality' && j.matchScore >= 75))
    .slice(0, 3)
)

const personalityJobs = computed(() =>
  allRecommended.value
    .filter(j => j.matchType === 'personality')
    .slice(0, 3)
)

function viewJobDetail(job: JobPosition) {
  store.setSelectedJob(job)
  router.push(`/jd/${job.id}`)
}

function goChat() {
  router.push('/chat')
}
</script>

<style scoped>
.section-block {
  margin-bottom: 28px;
}

.section-label {
  margin-bottom: 14px;
}

.job-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.job-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--primary);
}

.job-card.personality-card:hover {
  border-color: var(--success);
}

.job-header {
  margin-bottom: 12px;
}

.job-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.job-title-row h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.match-badge {
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}

.match-badge.high {
  background: #e8f8f2;
  color: #00A870;
}

.match-badge.mid {
  background: #e8f0fe;
  color: #0052D9;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.meta-sep {
  color: var(--border);
}

.dept-text {
  font-size: 12px;
  color: var(--text-tertiary);
}

.job-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.skill-dot {
  font-size: 11px;
  padding: 3px 10px;
  background: #f5f5f5;
  border-radius: 12px;
  color: var(--text-tertiary);
}

.match-reason {
  font-size: 13px;
  color: #0073e6;
  background: #e8f0fe;
  padding: 10px 14px;
  border-radius: var(--radius);
  margin-bottom: 14px;
  line-height: 1.6;
}

.job-arrow {
  font-size: 13px;
  color: var(--primary);
  font-weight: 500;
}

.chat-cta {
  text-align: center;
  padding: 24px 0;
}

.chat-cta p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.btn-full {
  width: 100%;
}
</style>
