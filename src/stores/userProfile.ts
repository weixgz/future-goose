import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MBTIScores {
  E_I: number
  S_N: number
  T_F: number
  J_P: number
}

export interface UserProfile {
  grade: string
  major: string
  mbtiType: string
  mbtiScores: MBTIScores
  interestedFields: string[]
  currentSkills: string[]
}

export interface JobPosition {
  id: string
  title: string
  category: string
  department: string
  matchType: 'professional' | 'personality' | 'both'
  matchScore: number
  matchReason?: string
  jd: {
    responsibilities: string[]
    hardSkills: string[]
    softSkills: string[]
    bonusPoints: string[]
    preferredMajors: string[]
  }
  recommendedMBTI: string[]
  growthPath: GrowthPhase[]
  description: string
}

export interface GrowthPhase {
  phase: number
  title: string
  targetGrade: string
  tasks: string[]
  resources: string[]
  estimatedTime: string
}

export const useUserStore = defineStore('user', () => {
  const grade = ref('')
  const major = ref('')
  const interestedFields = ref<string[]>([])
  const mbtiAnswers = ref<number[]>([])
  const mbtiType = ref('')
  const mbtiScores = ref<MBTIScores>({ E_I: 0, S_N: 0, T_F: 0, J_P: 0 })
  const recommendedJobs = ref<JobPosition[]>([])
  const selectedJob = ref<JobPosition | null>(null)
  const completedSteps = ref<string[]>([])

  const isProfileComplete = computed(() => !!grade.value && !!major.value)
  const isMBTIComplete = computed(() => mbtiType.value !== '')
  const currentStep = computed(() => {
    if (!isProfileComplete.value) return 'profile'
    if (!isMBTIComplete.value) return 'mbti'
    return 'done'
  })

  function setProfile(g: string, m: string, fields: string[]) {
    grade.value = g
    major.value = m
    interestedFields.value = fields
    completedSteps.value.push('profile')
  }

  function setMBTI(type: string, scores: MBTIScores) {
    mbtiType.value = type
    mbtiScores.value = scores
    completedSteps.value.push('mbti')
  }

  // 用户直接填写已知MBTI类型（跳过测试）
  function setMBTIDirect(type: string) {
    mbtiType.value = type
    // 根据类型推算四个维度分数（±2表示偏向明确）
    const scoreMap: Record<string, MBTIScores> = {
      INTJ: { E_I: 2, S_N: 2, T_F: -2, J_P: -2 },
      INTP: { E_I: 2, S_N: 2, T_F: -2, J_P: 2 },
      ENTJ: { E_I: -2, S_N: 2, T_F: -2, J_P: -2 },
      ENTP: { E_I: -2, S_N: 2, T_F: -2, J_P: 2 },
      INFJ: { E_I: 2, S_N: 2, T_F: 2, J_P: -2 },
      INFP: { E_I: 2, S_N: 2, T_F: 2, J_P: 2 },
      ENFJ: { E_I: -2, S_N: 2, T_F: 2, J_P: -2 },
      ENFP: { E_I: -2, S_N: 2, T_F: 2, J_P: 2 },
      ISTJ: { E_I: 2, S_N: -2, T_F: -2, J_P: -2 },
      ISFJ: { E_I: 2, S_N: -2, T_F: 2, J_P: -2 },
      ESTJ: { E_I: -2, S_N: -2, T_F: -2, J_P: -2 },
      ESFJ: { E_I: -2, S_N: -2, T_F: 2, J_P: -2 },
      ISTP: { E_I: 2, S_N: -2, T_F: -2, J_P: 2 },
      ISFP: { E_I: 2, S_N: -2, T_F: 2, J_P: 2 },
      ESTP: { E_I: -2, S_N: -2, T_F: -2, J_P: 2 },
      ESFP: { E_I: -2, S_N: -2, T_F: 2, J_P: 2 },
    }
    mbtiScores.value = scoreMap[type] || { E_I: 0, S_N: 0, T_F: 0, J_P: 0 }
    completedSteps.value.push('mbti')
  }

  // 年级阶段建议
  function getGradeAdvice(g: string): { title: string; tips: string[]; focus: string } {
    const adviceMap: Record<string, { title: string; tips: string[]; focus: string }> = {
      freshman: {
        title: '🌱 大一 · 探索萌芽期',
        tips: [
          '多尝试不同方向的课程和社团，找到你真正热爱的领域',
          '打好专业基础，GPA 是未来保研/出国/求职的重要指标',
          '开始关注行业动态，建立基本的职业认知',
          '利用寒暑假参加社会实践或短期项目，积累经验',
        ],
        focus: '重心：广泛探索 + 夯实基础',
      },
      sophomore: {
        title: '🌿 大二 · 方向确定期',
        tips: [
          '确定 1-2 个职业方向，开始有针对性地积累能力和项目经验',
          '参加专业相关的竞赛（如 ACM、数学建模、大创项目等）',
          '尝试找一份与目标方向相关的实习或项目实践',
          '开始系统准备目标岗位所需的硬技能（如刷题、学框架、做作品集等）',
        ],
        focus: '重心：定向积累 + 项目实战',
      },
      junior: {
        title: '🌳 大三 · 求职冲刺期',
        tips: [
          '重点准备暑期实习（大三暑期实习是留用转正的最佳途径）',
          '系统刷面试题，准备技术面/群面/HR面各类环节',
          '完善简历，通过内推渠道投递目标公司',
          '关注各大厂秋招提前批（7-8月）和正式批（9-10月）节奏',
        ],
        focus: '重心：实习冲刺 + 秋招备战',
      },
      senior: {
        title: '🎓 大四 · 收官决胜期',
        tips: [
          '如果已有 offer，认真准备入职，提前了解岗位职责和团队情况',
          '如果还在求职，关注春招补录（2-4月）和社招初级岗位',
          '积累毕业前最后一段实习经历，增加简历竞争力',
          '建立行业人脉，为长远职业发展做准备',
        ],
        focus: '重心：拿下offer + 顺利过渡',
      },
      graduate: {
        title: '📖 研究生 · 深度深耕期',
        tips: [
          '深耕研究方向或技术领域，成为某个方向的专家',
          '积极参与实验室项目或导师课题，产出高质量成果',
          '关注专项招聘（如技术大咖、青云计划等高级别项目）',
          '发表高质量论文或参与行业会议，建立个人技术品牌',
        ],
        focus: '重心：深度专精 + 技术品牌',
      },
    }
    return adviceMap[g] || {
      title: '🚀 职业启航期',
      tips: ['探索适合自己的职业方向', '积累相关项目经验', '关注校招动态和岗位要求'],
      focus: '重心：方向定位 + 能力积累',
    }
  }

  function setRecommendedJobs(jobs: JobPosition[]) {
    recommendedJobs.value = jobs
  }

  function setSelectedJob(job: JobPosition) {
    selectedJob.value = job
  }

  function getMBTIDescription(type: string): string {
    const descriptions: Record<string, string> = {
      INTJ: '战略思维 · 独立思考 · 追求卓越',
      INTP: '逻辑分析 · 创新思维 · 深度思考',
      ENTJ: '领导力 · 果断决策 · 目标导向',
      ENTP: '机智善辩 · 灵活创新 · 热爱挑战',
      INFJ: '深刻洞察 · 理想主义 · 助人成长',
      INFP: '内心丰富 · 价值驱动 · 创意表达',
      ENFJ: '感染力强 · 善于激励 · 关心他人',
      ENFP: '热情洋溢 · 想象力丰富 · 善于社交',
      ISTJ: '严谨务实 · 可靠负责 · 注重细节',
      ISFJ: '温和体贴 · 勤勉尽责 · 守护传统',
      ESTJ: '高效管理 · 务实果断 · 组织力强',
      ESFJ: '热心服务 · 善于合作 · 关怀他人',
      ISTP: '冷静务实 · 动手能力强 · 善于解决实际问题',
      ISFP: '温和敏感 · 审美力强 · 享受当下',
      ESTP: '行动力强 · 喜欢冒险 · 随机应变',
      ESFP: '活力四射 · 乐观开朗 · 享受生活',
    }
    return descriptions[type] || '独特个性 · 无限可能'
  }

  function reset() {
    grade.value = ''
    major.value = ''
    interestedFields.value = []
    mbtiAnswers.value = []
    mbtiType.value = ''
    mbtiScores.value = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 }
    recommendedJobs.value = []
    selectedJob.value = null
    completedSteps.value = []
  }

  return {
    grade,
    major,
    interestedFields,
    mbtiAnswers,
    mbtiType,
    mbtiScores,
    recommendedJobs,
    selectedJob,
    completedSteps,
    isProfileComplete,
    isMBTIComplete,
    currentStep,
    setProfile,
    setMBTI,
    setMBTIDirect,
    setRecommendedJobs,
    setSelectedJob,
    getMBTIDescription,
    getGradeAdvice,
    reset,
  }
})
