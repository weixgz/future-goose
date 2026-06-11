<template>
  <div class="page-container">
    <!-- Progress Steps -->
    <t-steps :current="stepIndex" class="steps-bar">
      <t-step-item title="基本信息" />
      <t-step-item title="MBTI测评" />
      <t-step-item title="查看结果" />
    </t-steps>

    <!-- ====== Step 0: 基本信息 ====== -->
    <div class="form-content" v-if="step === 'profile'">
      <div class="page-header">
        <div class="icon">📝</div>
        <h1>先来认识一下你</h1>
        <p>这些信息能帮助鹅学姐更了解你，给你更精准的建议～</p>
      </div>

      <!-- 年级选择 -->
      <div class="form-section">
        <label class="form-label">🎓 你的年级</label>
        <div class="grade-grid">
          <div
            v-for="g in grades"
            :key="g.value"
            class="grade-card"
            :class="{ active: form.grade === g.value }"
            @click="form.grade = g.value"
          >
            <span class="grade-icon">{{ g.icon }}</span>
            <span class="grade-text">{{ g.label }}</span>
          </div>
        </div>
      </div>

      <!-- 专业输入 -->
      <div class="form-section">
        <label class="form-label">📚 你的专业</label>
        <t-input
          v-model="form.major"
          placeholder="输入你的专业，如：计算机科学与技术"
          size="large"
          clearable
        >
          <template #suffix-icon>
            <span>🔍</span>
          </template>
        </t-input>
        <div class="major-hints">
          <span class="hint-label">热门专业：</span>
          <t-tag
            v-for="m in hotMajors"
            :key="m"
            :theme="form.major === m ? 'primary' : 'default'"
            :variant="form.major === m ? 'dark' : 'outline'"
            class="major-tag"
            @click="form.major = m"
          >
            {{ m }}
          </t-tag>
        </div>
      </div>

      <!-- 兴趣方向 -->
      <div class="form-section">
        <label class="form-label">💡 你感兴趣的领域（可多选）</label>
        <t-checkbox-group v-model="form.interestedFields">
          <div class="interest-grid">
            <div
              v-for="f in interestOptions"
              :key="f.value"
              class="interest-card"
              :class="{ active: form.interestedFields.includes(f.value) }"
              @click="toggleInterest(f.value)"
            >
              <span class="interest-icon">{{ f.icon }}</span>
              <span class="interest-text">{{ f.label }}</span>
            </div>
          </div>
        </t-checkbox-group>
      </div>

      <!-- 下一步按钮 -->
      <button
        class="btn-primary btn-next"
        :disabled="!canNext"
        @click="goMBTIStep"
      >
        下一步 →
      </button>
    </div>

    <!-- ====== Step 1: 已有MBTI？ ====== -->
    <div class="form-content" v-if="step === 'mbtiChoice'">
      <div class="page-header">
        <div class="icon">🧠</div>
        <h1>你做过MBTI测评吗？</h1>
        <p>MBTI性格类型能帮助我们更好地为你推荐适合的岗位～</p>
      </div>

      <div class="mbti-choice-grid">
        <div class="choice-card" @click="goDirectInput">
          <span class="choice-icon">✅</span>
          <div class="choice-title">我知道自己的类型</div>
          <div class="choice-desc">之前测过，直接填写即可</div>
        </div>
        <div class="choice-card" @click="goMBTITest">
          <span class="choice-icon">📋</span>
          <div class="choice-title">没测过，想测一下</div>
          <div class="choice-desc">12道题，约3分钟完成</div>
        </div>
      </div>
    </div>

    <!-- ====== Step 2: 直接填写MBTI ====== -->
    <div class="form-content" v-if="step === 'directInput'">
      <div class="page-header">
        <div class="icon">🔤</div>
        <h1>选择你的MBTI类型</h1>
        <p>从下面选择与你最匹配的性格类型</p>
      </div>

      <!-- 四个维度逐维度选择 -->
      <div class="mbti-4pickers">
        <div class="picker-col" v-for="dim in mbtiDims" :key="dim.key">
          <label class="picker-label">{{ dim.label }}</label>
          <div class="picker-options">
            <div
              v-for="opt in dim.options"
              :key="opt.value"
              class="picker-option"
              :class="{ active: mbtiSelection[dim.key as number] === opt.value }"
              @click="mbtiSelection[dim.key as number] = opt.value"
            >
              <span class="picker-emoji">{{ opt.emoji }}</span>
              <span class="picker-name">{{ opt.name }}</span>
              <span class="picker-desc">{{ opt.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 预览生成类型 -->
      <div class="mbti-preview" v-if="selectedMBTIType">
        <span class="preview-badge">你的类型</span>
        <span class="preview-type">{{ selectedMBTIType }}</span>
        <span class="preview-name">{{ mbtiQuickInfo?.name }}</span>
      </div>

      <button
        class="btn-primary btn-next"
        :disabled="!selectedMBTIType"
        @click="confirmDirectMBTI"
      >
        确认，查看结果 ✨
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userProfile'
import { getMBTIInfo } from '../data/mbti-career-map'

const router = useRouter()
const store = useUserStore()

// Step 管理: profile → mbtiChoice → directInput 或 /mbti
const step = ref<'profile' | 'mbtiChoice' | 'directInput'>('profile')

const stepIndex = computed(() => {
  if (step.value === 'profile') return 0
  return 1
})

// ---- 基本信息 ----
const grades = [
  { value: 'freshman', label: '大一', icon: '🌱' },
  { value: 'sophomore', label: '大二', icon: '🌿' },
  { value: 'junior', label: '大三', icon: '🌳' },
  { value: 'senior', label: '大四', icon: '🎓' },
  { value: 'graduate', label: '研究生', icon: '📖' },
]

const hotMajors = [
  '计算机科学与技术', '软件工程', '人工智能', '电子信息工程',
  '数学与应用数学', '工商管理', '新闻传播', '心理学',
]

const interestOptions = [
  { value: 'tech', label: '技术研发', icon: '💻' },
  { value: 'product', label: '产品策划', icon: '💡' },
  { value: 'design', label: '设计创意', icon: '🎨' },
  { value: 'operation', label: '运营增长', icon: '📈' },
  { value: 'market', label: '市场营销', icon: '📢' },
  { value: 'function', label: '职能管理', icon: '📋' },
]

const form = reactive({
  grade: '',
  major: '',
  interestedFields: [] as string[],
})

const canNext = computed(() => form.grade && form.major.trim())

function toggleInterest(value: string) {
  const idx = form.interestedFields.indexOf(value)
  if (idx >= 0) {
    form.interestedFields.splice(idx, 1)
  } else {
    form.interestedFields.push(value)
  }
}

function goMBTIStep() {
  if (!canNext.value) return
  store.setProfile(form.grade, form.major.trim(), [...form.interestedFields])
  step.value = 'mbtiChoice'
}

// ---- MBTI 维度选择（逐维度） ----
const mbtiDims = [
  {
    key: 0,
    label: '精力来源',
    options: [
      { value: 'E', name: '外向 Extraversion', emoji: '🗣️', desc: '从社交中获取能量' },
      { value: 'I', name: '内向 Introversion', emoji: '🧘', desc: '从独处中获取能量' },
    ],
  },
  {
    key: 1,
    label: '认知方式',
    options: [
      { value: 'S', name: '实感 Sensing', emoji: '🔍', desc: '关注具体事实与细节' },
      { value: 'N', name: '直觉 Intuition', emoji: '🔮', desc: '关注整体模式与可能' },
    ],
  },
  {
    key: 2,
    label: '决策方式',
    options: [
      { value: 'T', name: '理性 Thinking', emoji: '🧮', desc: '逻辑分析，客观决策' },
      { value: 'F', name: '感性 Feeling', emoji: '💗', desc: '价值观驱动，以人为本' },
    ],
  },
  {
    key: 3,
    label: '生活态度',
    options: [
      { value: 'J', name: '判断 Judging', emoji: '📋', desc: '喜欢计划与条理' },
      { value: 'P', name: '知觉 Perceiving', emoji: '🌊', desc: '喜欢灵活与随性' },
    ],
  },
]

const mbtiSelection = reactive<string[]>(['', '', '', ''])

const selectedMBTIType = computed(() => {
  const type = mbtiSelection.join('')
  return type.length === 4 ? type : ''
})

const mbtiQuickInfo = computed(() => {
  if (!selectedMBTIType.value) return null
  return getMBTIInfo(selectedMBTIType.value)
})

function goDirectInput() {
  step.value = 'directInput'
}

function goMBTITest() {
  router.push('/mbti')
}

function confirmDirectMBTI() {
  if (!selectedMBTIType.value) return
  store.setMBTIDirect(selectedMBTIType.value)
  router.push('/result')
}
</script>

<style scoped>
.steps-bar {
  margin-bottom: 32px;
}

.form-content {
  max-width: 440px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 28px;
}

.form-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.grade-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.grade-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: white;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
}

.grade-card:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.grade-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}

.grade-icon {
  font-size: 24px;
}

.grade-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.grade-card.active .grade-text {
  color: var(--primary);
  font-weight: 600;
}

.major-hints {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.hint-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.major-tag {
  cursor: pointer;
}

.interest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.interest-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: white;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
}

.interest-card:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.interest-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}

.interest-icon {
  font-size: 22px;
}

.interest-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.interest-card.active .interest-text {
  color: var(--primary);
  font-weight: 600;
}

.btn-next {
  width: 100%;
  margin-top: 8px;
}

.btn-next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ====== MBTI 选择页 ====== */
.mbti-choice-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.choice-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px;
  background: white;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
}

.choice-card:hover {
  border-color: var(--primary);
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 82, 217, 0.08);
}

.choice-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.choice-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.choice-desc {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* ====== MBTI 直接选择页 ====== */
.mbti-4pickers {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.picker-col {
  background: white;
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow-sm);
}

.picker-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.picker-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.picker-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.picker-option:hover {
  border-color: #b3ceff;
  background: #f8faff;
}

.picker-option.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.picker-emoji {
  font-size: 22px;
}

.picker-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.picker-desc {
  font-size: 11px;
  color: var(--text-tertiary);
  line-height: 1.4;
}

.mbti-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 100%);
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.preview-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  background: white;
  padding: 3px 10px;
  border-radius: 20px;
}

.preview-type {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 2px;
}

.preview-name {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
