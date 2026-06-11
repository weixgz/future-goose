<template>
  <div class="page-container">
    <div class="page-header">
      <button class="btn-back" @click="$router.back()">← 返回</button>
    </div>

    <div v-if="job" class="jd-content">
      <!-- Job Header -->
      <div class="jd-header-card">
        <div class="jd-title-row">
          <h1>{{ job.title }}</h1>
          <span class="match-badge high">{{ job.matchScore }}%</span>
        </div>
        <div class="jd-meta">
          <t-tag size="small" variant="light">{{ job.category }}</t-tag>
          <span class="meta-sep">·</span>
          <span>{{ job.department }}</span>
        </div>
        <p class="jd-desc">{{ job.description }}</p>
      </div>

      <!-- Responsibilities -->
      <div class="section-card">
        <h3 class="section-title">📌 岗位职责</h3>
        <ul class="gap-list">
          <li v-for="r in job.jd.responsibilities" :key="r">
            <span>🔹</span>
            <span>{{ r }}</span>
          </li>
        </ul>
      </div>

      <!-- Hard Skills -->
      <div class="section-card">
        <h3 class="section-title">🛠️ 硬技能要求</h3>
        <div class="skill-check-list">
          <div v-for="s in job.jd.hardSkills" :key="s" class="skill-check-item">
            <span class="skill-icon">⚡</span>
            <span class="skill-name">{{ s }}</span>
            <t-tag size="small" :theme="getSkillStatus(s)" variant="light">
              {{ getSkillStatusLabel(s) }}
            </t-tag>
          </div>
        </div>
      </div>

      <!-- Soft Skills -->
      <div class="section-card">
        <h3 class="section-title">💬 软技能要求</h3>
        <div class="skill-check-list">
          <div v-for="s in job.jd.softSkills" :key="s" class="skill-check-item">
            <span class="skill-icon">💡</span>
            <span class="skill-name">{{ s }}</span>
            <t-tag size="small" :theme="getSoftSkillStatus(s)" variant="light">
              {{ getSoftSkillStatusLabel(s) }}
            </t-tag>
          </div>
        </div>
      </div>

      <!-- Bonus Points -->
      <div class="section-card">
        <h3 class="section-title">⭐ 加分项</h3>
        <div class="bonus-list">
          <div v-for="bp in job.jd.bonusPoints" :key="bp" class="bonus-item">
            <span>✨</span>
            <span>{{ bp }}</span>
          </div>
        </div>
      </div>

      <!-- Preferred Majors -->
      <div class="section-card" v-if="job.jd.preferredMajors.length > 0">
        <h3 class="section-title">🎓 偏好专业背景</h3>
        <div class="major-tags">
          <t-tag
            v-for="m in job.jd.preferredMajors"
            :key="m"
            :theme="store.major.includes(m.replace('类','').replace('不限','')) ? 'primary' : 'default'"
          >
            {{ m }}
          </t-tag>
        </div>
      </div>

      <!-- Growth Path -->
      <div class="section-card">
        <h3 class="section-title">🗺️ 你的专属成长路线图</h3>
        <div class="grade-tip" v-if="currentPhaseIndex !== null">
          🎯 根据你的年级（<strong>{{ gradeLabel }}</strong>），当前建议聚焦 <strong>{{ job.growthPath[currentPhaseIndex]?.title }}</strong>
        </div>
        <t-steps :current="currentPhaseIndex ?? 0" layout="vertical">
          <t-step-item
            v-for="(phase, idx) in job.growthPath"
            :key="phase.phase"
            :title="getPhaseTitle(phase)"
            :status="idx <= (currentPhaseIndex ?? -1) ? 'finish' : 'default'"
          >
            <template #content>
              <div class="phase-content">
                <div class="phase-tasks">
                  <p class="phase-label">📋 阶段任务：</p>
                  <ul>
                    <li v-for="t in phase.tasks" :key="t">{{ t }}</li>
                  </ul>
                </div>
                <div class="phase-resources">
                  <p class="phase-label">📚 推荐资源：</p>
                  <ul>
                    <li v-for="r in phase.resources" :key="r">{{ r }}</li>
                  </ul>
                </div>
                <p class="phase-time">⏱️ 预计耗时：{{ phase.estimatedTime }}</p>
              </div>
            </template>
          </t-step-item>
        </t-steps>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-primary btn-full" @click="goChat">
          💬 找鹅学姐聊聊这个岗位
        </button>
        <button class="btn-secondary btn-full" @click="$router.push('/recommend')">
          ← 返回岗位列表
        </button>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found">
      <p>😕 未找到该岗位信息</p>
      <button class="btn-primary" @click="$router.push('/recommend')">返回岗位列表</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, type GrowthPhase } from '../stores/userProfile'
import { getJobById } from '../data/job-positions'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const jobId = computed(() => route.params.jobId as string)
const job = computed(() => {
  const id = jobId.value
  return getJobById(id) || store.selectedJob
})

// 年级标签映射
const gradeLabel = computed(() => {
  const map: Record<string, string> = {
    freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四', graduate: '研究生',
  }
  return map[store.grade] || store.grade
})

// 根据用户年级匹配成长路径阶段
const currentPhaseIndex = computed(() => {
  if (!job.value || !store.grade) return null
  const gradeMap: Record<string, number> = {
    freshman: 0, sophomore: 1, junior: 2, senior: 2, graduate: 2,
  }
  const idx = gradeMap[store.grade]
  return idx !== undefined ? Math.min(idx, job.value.growthPath.length - 1) : null
})

function getPhaseTitle(phase: GrowthPhase) {
  const gradeLabel: Record<string, string> = {
    '大一': '🌱', '大二': '🌿', '大三': '🌳', '大四': '🎓',
    '大二/大三': '📈', '大三/大四': '🚀', '研一': '📖', '研二': '📊',
  }
  const emoji = gradeLabel[phase.targetGrade] || '📅'
  return `${emoji} ${phase.title}（${phase.targetGrade}）`
}

function getSkillStatus(skill: string) {
  return 'default'
}

function getSkillStatusLabel(skill: string) {
  const known = ['JavaScript', 'Python', 'HTML', 'CSS']
  if (known.some(k => skill.includes(k))) return '已具备'
  return '待学习'
}

function getSoftSkillStatus(skill: string) {
  return 'default'
}

function getSoftSkillStatusLabel(skill: string) {
  return '待提升'
}

function goChat() {
  if (job.value) {
    store.setSelectedJob(job.value)
  }
  router.push('/chat')
}
</script>

<style scoped>
.btn-back {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--primary);
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  display: block;
}

.jd-content {
  max-width: 440px;
  margin: 0 auto;
}

.jd-header-card {
  background: linear-gradient(135deg, #0052D9 0%, #0073e6 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  color: white;
  margin-bottom: 20px;
}

.jd-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.jd-title-row h1 {
  font-size: 22px;
  font-weight: 700;
}

.jd-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.85;
  margin-bottom: 12px;
}

.meta-sep {
  opacity: 0.5;
}

.jd-desc {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.9;
}

.section-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.skill-check-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: var(--radius);
}

.skill-icon {
  font-size: 14px;
}

.skill-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
}

.bonus-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bonus-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.major-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.phase-content {
  padding: 12px 0;
}

.grade-tip {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 10px 14px;
  background: var(--primary-light);
  border-radius: var(--radius);
  margin-bottom: 16px;
  line-height: 1.5;
}

.grade-tip strong {
  color: var(--primary);
}

.phase-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.phase-content ul {
  list-style: none;
  padding-left: 8px;
}

.phase-content li {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 3px 0;
  position: relative;
  padding-left: 14px;
}

.phase-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.phase-tasks,
.phase-resources {
  margin-bottom: 8px;
}

.phase-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
  padding-bottom: 40px;
}

.btn-full {
  width: 100%;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
</style>
