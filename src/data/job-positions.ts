import type { JobPosition } from '../stores/userProfile'
import { mbtiCareerMap } from './mbti-career-map'

export const jobPositions: JobPosition[] = [
  {
    id: 'backend-dev',
    title: '后台开发工程师',
    category: '技术类',
    department: '微信事业群',
    matchType: 'professional',
    matchScore: 92,
    description: '负责腾讯核心产品的后端服务架构设计与开发，支撑亿级用户的高并发场景。',
    jd: {
      responsibilities: [
        '负责后台服务的架构设计、开发与维护',
        '参与高并发、高可用系统的设计与优化',
        '编写高质量代码，进行代码审查',
        '与产品、前端团队紧密协作，推动项目落地',
      ],
      hardSkills: ['Go/C++/Java至少精通一门', '数据结构与算法', '数据库(MySQL/Redis)', '分布式系统设计', 'Linux操作系统'],
      softSkills: ['逻辑分析能力', '问题拆解能力', '团队协作', '技术文档编写'],
      bonusPoints: ['有个人开源项目', 'ACM/数学建模竞赛经历', '了解微服务架构', '有实习经验'],
      preferredMajors: ['计算机科学与技术', '软件工程', '人工智能', '信息安全', '电子信息工程'],
    },
    recommendedMBTI: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    growthPath: [
      {
        phase: 1, title: '基础能力积累期', targetGrade: '大一',
        tasks: ['学习一门编程语言（推荐Go或Python）', '掌握基础数据结构与算法', '完成LeetCode 50题', '加入校内技术社团/实验室'],
        resources: ['《Go语言程序设计》', 'LeetCode官网', 'B站-尚硅谷Go教程'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '进阶提升期', targetGrade: '大二',
        tasks: ['学习数据库（MySQL + Redis）', '完成一个完整的Web后端项目', '学习Linux基本操作和Shell脚本', '参加校内外编程比赛（如ACM）'],
        resources: ['《高性能MySQL》', 'GitHub开源项目', '腾讯云免费云服务'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '实战冲刺期', targetGrade: '大三/大四',
        tasks: ['找一份技术实习（优先大厂）', '系统学习分布式系统设计', '阅读优秀开源项目源码', '准备技术面试（八股文+系统设计）'],
        resources: ['《设计数据密集型应用》', '牛客网面经', '各大厂技术博客'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'product-manager',
    title: '产品策划',
    category: '产品类',
    department: 'PCG平台与内容事业群',
    matchType: 'personality',
    matchScore: 85,
    description: '负责腾讯社交、内容、工具等产品的功能策划与迭代，定义产品方向和用户体验。',
    jd: {
      responsibilities: [
        '深入理解用户需求，进行产品功能策划',
        '撰写PRD文档，推动设计、开发落地',
        '跟踪产品数据，持续优化产品体验',
        '竞品分析与行业趋势研究',
      ],
      hardSkills: ['需求分析', '原型设计(Figma/Axure)', '数据分析(SQL/Excel)', '项目推进能力'],
      softSkills: ['用户共情能力', '逻辑表达与沟通', '跨团队协作', '创新思维'],
      bonusPoints: ['有产品相关实习', '独立完成过产品分析报告', '了解互联网商业模式', '会简单的编程'],
      preferredMajors: ['不限专业', '计算机', '心理学', '设计类', '商科', '社会学'],
    },
    recommendedMBTI: ['ENTP', 'ENTJ', 'ENFP', 'INTJ'],
    growthPath: [
      {
        phase: 1, title: '产品思维启蒙期', targetGrade: '大一',
        tasks: ['每周深度体验一款APP并写分析笔记', '阅读产品经理经典书籍', '学习Figma基础操作', '关注互联网行业动态'],
        resources: ['《人人都是产品经理》', '《俞军产品方法论》', '36氪/虎嗅等科技媒体'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '能力锻造期', targetGrade: '大二',
        tasks: ['独立完成一份完整的产品分析报告', '学习SQL进行数据分析', '参加产品类比赛或Hackathon', '尝试运营一个小的产品/社群'],
        resources: ['woshipm.com 人人都是产品经理社区', 'ProcessOn流程图工具', '腾讯大学公开课'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '求职准备期', targetGrade: '大三/大四',
        tasks: ['找一份产品实习（互联网公司优先）', '准备产品面试作品集', '练习产品case分析', '建立自己的产品方法论框架'],
        resources: ['牛客网产品面经', '《幕后产品》', '各大厂产品公众号'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'frontend-dev',
    title: '前端开发工程师',
    category: '技术类',
    department: 'CDG企业发展事业群',
    matchType: 'professional',
    matchScore: 90,
    description: '负责腾讯Web端、小程序等产品的前端架构设计、性能优化和用户体验打磨。',
    jd: {
      responsibilities: [
        '负责Web/小程序前端功能开发',
        '前端性能优化和用户体验提升',
        '参与前端工程化建设和组件库维护',
        '与设计、后端团队紧密协作',
      ],
      hardSkills: ['HTML/CSS/JavaScript', 'React/Vue至少精通一个', 'TypeScript', '前端构建工具(Webpack/Vite)', '浏览器原理'],
      softSkills: ['设计审美', '用户导向思维', '技术热情', '沟通协作'],
      bonusPoints: ['有个人博客/技术分享', 'GitHub活跃贡献', '了解Node.js', '有移动端开发经验'],
      preferredMajors: ['计算机科学与技术', '软件工程', '数字媒体技术', '信息与计算科学'],
    },
    recommendedMBTI: ['INTP', 'ISFP', 'INFP', 'INTJ'],
    growthPath: [
      {
        phase: 1, title: '前端入门期', targetGrade: '大一',
        tasks: ['学习HTML/CSS/JavaScript基础', '完成一个静态页面模仿练习', '学习Git版本管理', '加入前端技术社区'],
        resources: ['MDN Web Docs', 'freeCodeCamp', '《JavaScript高级程序设计》'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '框架进阶期', targetGrade: '大二',
        tasks: ['深入学习React或Vue框架', '学习TypeScript', '完成一个全栈个人项目', '了解前端性能优化'],
        resources: ['Vue/React官方文档', '掘金社区', 'GitHub优秀项目'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '工程化实战期', targetGrade: '大三/大四',
        tasks: ['找一份前端实习', '学习前端工程化（CI/CD/测试）', '深入理解浏览器渲染原理', '准备技术面试'],
        resources: ['各大厂前端技术博客', '前端早早聊大会', 'LeetCode前端专题'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'game-planner',
    title: '游戏策划',
    category: '产品类',
    department: 'IEG互动娱乐事业群',
    matchType: 'personality',
    matchScore: 82,
    description: '参与腾讯游戏的玩法设计、数值体系搭建和用户体验打磨，打造好玩的游戏。',
    jd: {
      responsibilities: [
        '设计游戏核心玩法和系统功能',
        '搭建游戏数值体系和经济系统',
        '撰写策划文档，跟进开发实现',
        '分析玩家数据，迭代优化游戏体验',
      ],
      hardSkills: ['游戏设计理论', '数值策划与平衡', '文档撰写能力', 'Excel高级应用'],
      softSkills: ['创造力与想象力', '逻辑思维', '玩家共情', '沟通表达'],
      bonusPoints: ['游戏深度玩家', '独立制作过游戏Demo', '了解游戏引擎(Unity/UE)', '有游戏分析文章'],
      preferredMajors: ['不限专业', '计算机', '数学', '心理学', '文学', '艺术设计'],
    },
    recommendedMBTI: ['ENTP', 'ENFP', 'INTP', 'INTJ'],
    growthPath: [
      {
        phase: 1, title: '游戏认知积累期', targetGrade: '大一',
        tasks: ['每周深度体验一款游戏并写分析', '学习游戏设计基础理论', '学习Excel数据分析和可视化', '关注游戏行业动态'],
        resources: ['《游戏设计梦工厂》', '《体验引擎》', 'GDC演讲视频', '游戏陀螺/GameLook'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '策划能力锻造期', targetGrade: '大二',
        tasks: ['完成一份完整的游戏反策划案', '学习Unity基础，尝试做个小Demo', '参加GameJam比赛', '分析热门游戏的数值体系'],
        resources: ['Unity官方教程', 'indienova独立游戏社区', '《游戏数值设计》'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '求职冲刺期', targetGrade: '大三/大四',
        tasks: ['找一份游戏公司实习', '准备游戏策划作品集', '深入研究目标品类的游戏', '准备策划面试题'],
        resources: ['牛客网游戏策划面经', '腾讯游戏学院', '各大厂游戏策划博客'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'algorithm-engineer',
    title: '算法工程师',
    category: '技术类',
    department: 'TEG技术工程事业群',
    matchType: 'professional',
    matchScore: 88,
    description: '负责腾讯AI算法研究与应用落地，覆盖推荐系统、NLP、CV等方向。',
    jd: {
      responsibilities: [
        '参与机器学习/深度学习算法研发与优化',
        '负责推荐系统/NLP/CV等方向的技术攻关',
        '将算法模型部署到生产环境',
        '跟踪前沿技术并进行技术预研',
      ],
      hardSkills: ['Python/C++', '机器学习/深度学习理论', 'PyTorch/TensorFlow', '数据处理与分析', '数学基础(概率论/线代/优化)'],
      softSkills: ['研究创新能力', '论文阅读能力', '技术写作', '团队协作'],
      bonusPoints: ['有顶会论文发表', 'Kaggle竞赛获奖', '有相关项目经验', '博士/硕士学历'],
      preferredMajors: ['计算机科学与技术', '人工智能', '数学', '统计学', '自动化', '电子信息'],
    },
    recommendedMBTI: ['INTJ', 'INTP', 'ISTJ', 'ENTJ'],
    growthPath: [
      {
        phase: 1, title: '数学与编程基础期', targetGrade: '大一',
        tasks: ['扎实学习高等数学/线性代数/概率论', '掌握Python编程', '学习数据结构与算法', '参加数学建模竞赛'],
        resources: ['吴恩达《Machine Learning》', 'LeetCode', 'Kaggle入门竞赛'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 2, title: '深度学习进阶期', targetGrade: '大二',
        tasks: ['系统学习机器学习/深度学习课程', '掌握PyTorch框架', '复现经典论文', '参与实验室科研项目'],
        resources: ['李宏毅机器学习课程', 'CS231n/CS224n', 'Papers with Code'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '研究方向深耕期', targetGrade: '大三/大四',
        tasks: ['确定研究方向(NLP/CV/推荐等)', '尝试发表论文', '找算法实习', '参加Kaggle竞赛冲奖'],
        resources: ['arXiv每日论文', '各大AI Lab技术博客', '顶会论文解读'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'ui-designer',
    title: '交互/UI设计师',
    category: '设计类',
    department: 'CSIG云与智慧产业事业群',
    matchType: 'personality',
    matchScore: 80,
    description: '负责腾讯B端和C端产品的界面设计、交互设计和视觉规范制定。',
    jd: {
      responsibilities: [
        '负责产品的交互设计和UI视觉设计',
        '参与设计规范的制定和维护',
        '输出高保真原型和设计稿',
        '与产品、开发团队协作推进落地',
      ],
      hardSkills: ['Figma/Sketch', '交互设计理论', '用户研究方法', '设计系统搭建'],
      softSkills: ['审美能力', '同理心', '沟通表达', '细节把控'],
      bonusPoints: ['有完整的设计作品集', '了解前端开发', '有动效设计能力', '有设计奖项'],
      preferredMajors: ['视觉传达', '工业设计', '数字媒体', '心理学', '不限专业'],
    },
    recommendedMBTI: ['INFP', 'ISFP', 'INFJ', 'ENFP'],
    growthPath: [
      {
        phase: 1, title: '设计基础积累期', targetGrade: '大一',
        tasks: ['学习设计基础（色彩/排版/构图）', '掌握Figma基础操作', '每天临摹一个优秀设计', '建立设计灵感库'],
        resources: ['Dribbble/Behance', '《写给大家看的设计书》', 'B站设计教程'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '交互设计进阶期', targetGrade: '大二',
        tasks: ['系统学习交互设计方法论', '完成3个完整的APP/Web设计项目', '学习用户研究和可用性测试', '参加设计比赛'],
        resources: ['《About Face 4》', 'Nielsen Norman Group', '各大厂设计公众号'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '求职准备期', targetGrade: '大三/大四',
        tasks: ['找一份设计实习', '打磨设计作品集（重中之重）', '学习设计系统搭建', '准备设计面试'],
        resources: ['站酷/UI中国', '各厂设计团队博客', 'Design+Code'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'product-ops',
    title: '产品运营',
    category: '产品类',
    department: 'PCG平台与内容事业群',
    matchType: 'personality',
    matchScore: 83,
    description: '负责腾讯产品的用户增长、内容运营、活动策划和用户社群维护。',
    jd: {
      responsibilities: [
        '策划和执行产品运营活动，提升用户活跃',
        '分析用户数据，优化运营策略',
        '管理用户社群，维护用户关系',
        '内容策划与传播推广',
      ],
      hardSkills: ['数据分析(SQL/Excel)', '活动策划与执行', '内容创作', '用户调研'],
      softSkills: ['创意策划能力', '执行力和抗压能力', '用户共情', '沟通协调'],
      bonusPoints: ['有新媒体运营经验', '熟悉各大社交平台玩法', '有社群运营经验', '会简单的PS/视频剪辑'],
      preferredMajors: ['不限专业', '市场营销', '新闻传播', '广告学', '社会学', '心理学'],
    },
    recommendedMBTI: ['ENFJ', 'ESFJ', 'ENFP', 'ESTP'],
    growthPath: [
      {
        phase: 1, title: '运营入门期', targetGrade: '大一',
        tasks: ['运营一个自己的社交账号或社群', '学习基础数据分析（Excel+SQL）', '关注热门互联网产品玩法', '阅读运营经典书籍'],
        resources: ['《运营之光》', '《增长黑客》', '鸟哥笔记', '运营研究社'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '专项能力提升期', targetGrade: '大二',
        tasks: ['独立策划并执行一个运营活动', '深入学习用户增长方法论', '学习基础设计工具(Canva/稿定)', '参与校内大型活动策划'],
        resources: ['腾讯大学运营课程', '三节课运营课程', '各大厂运营公众号'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '实战冲刺期', targetGrade: '大三/大四',
        tasks: ['找一份互联网运营实习', '建立自己的运营方法论体系', '积累可量化的运营成果数据', '准备运营面试（case+数据题）'],
        resources: ['牛客网运营面经', '人人都是产品经理', '运营深度精选'],
        estimatedTime: '6-12个月',
      },
    ],
  },
  {
    id: 'hr',
    title: '人力资源',
    category: '职能类',
    department: 'S3职能系统',
    matchType: 'personality',
    matchScore: 86,
    description: '负责腾讯人才招聘、组织发展、员工关系、培训发展等人力资源管理工作。',
    jd: {
      responsibilities: [
        '参与招聘全流程，包括需求对接、人才寻访、面试跟进',
        '协助组织发展和人才盘点项目',
        '参与员工关系管理和文化建设',
        '支持培训项目的策划与落地',
      ],
      hardSkills: ['招聘全流程管理', '数据分析(Excel/PPT)', '劳动法基础知识', '项目策划与执行'],
      softSkills: ['沟通亲和力', '组织协调能力', '职业敏感度', '服务意识'],
      bonusPoints: ['有HR相关实习', '有人力资源相关证书', '了解互联网行业', '有活动组织经验'],
      preferredMajors: ['人力资源管理', '心理学', '社会学', '管理学', '不限专业'],
    },
    recommendedMBTI: ['ENFJ', 'ESFJ', 'ISFJ', 'INFJ'],
    growthPath: [
      {
        phase: 1, title: '认知启蒙期', targetGrade: '大一',
        tasks: ['了解HR六大模块和三支柱模型', '学习基础劳动法知识', '参与校内社团/学生组织管理', '培养沟通和倾听能力'],
        resources: ['《人力资源转型》', '三茅人力资源网', 'HRoot'],
        estimatedTime: '3-6个月',
      },
      {
        phase: 2, title: '专项能力积累期', targetGrade: '大二',
        tasks: ['深入学习招聘/培训等1-2个模块', '参与企业HR相关项目或比赛', '学习HR数据分析', '了解互联网行业组织特点'],
        resources: ['《联盟》', '领英学习HR课程', '各大厂HR公众号'],
        estimatedTime: '6-12个月',
      },
      {
        phase: 3, title: '实战冲刺期', targetGrade: '大三/大四',
        tasks: ['找一份HR实习（互联网优先）', '建立HR专业方法论', '了解腾讯组织文化', '准备HR面试'],
        resources: ['牛客网HR面经', 'HRGO', '人力资源开发网'],
        estimatedTime: '6-12个月',
      },
    ],
  },
]

export function getJobById(id: string): JobPosition | undefined {
  return jobPositions.find((j) => j.id === id)
}

// ==================== 兴趣方向 → 岗位分类映射 ====================
const interestToCategory: Record<string, string[]> = {
  tech: ['技术类'],
  product: ['产品类'],
  design: ['设计类'],
  operation: ['产品类'],
  market: ['产品类', '职能类'],
  function: ['职能类'],
}

// ==================== 年级 → 岗位类型偏好 ====================
// 低年级偏向积累型岗位，高年级偏向冲刺型
function getGradePhase(grade: string): 'early' | 'mid' | 'late' {
  if (grade === 'freshman' || grade === 'sophomore') return 'early'
  if (grade === 'junior') return 'mid'
  return 'late'
}

// 计算年级对岗位的适配分 (满分 100)
function calcGradeScore(job: JobPosition, grade: string): number {
  const phase = getGradePhase(grade)
  const category = job.category
  // 不同阶段适合不同类型岗位
  // early: 基础积累型（技术类、设计类更适合早期打基础）
  // mid/late: 冲刺型
  const earlyCategories = ['技术类', '设计类']
  const midCategories = ['技术类', '产品类', '设计类']
  const lateCategories = ['技术类', '产品类', '设计类', '职能类']

  if (phase === 'early' && earlyCategories.includes(category)) return 90
  if (phase === 'mid' && midCategories.includes(category)) return 85
  if (phase === 'late' && lateCategories.includes(category)) return 80
  return 60
}

// ==================== 专业匹配度计算 (满分 100) ====================
function calcMajorScore(job: JobPosition, major: string): number {
  if (!major) return 50

  // 提取专业关键词
  const majorKeywords = major.replace(/学院|系|专业|类/g, '').trim()
  const majorShort = majorKeywords.substring(0, 2)

  for (const preferred of job.jd.preferredMajors) {
    if (preferred === '不限专业') return 75 // 不限专业给中等分，不扣分也不加分

    const prefClean = preferred.replace(/学院|系|专业|类/g, '').trim()

    // 精确关键词匹配
    const prefKeywords = prefClean.split(/(?:与|及|、|,)/).filter(Boolean)
    for (const kw of prefKeywords) {
      const trimmed = kw.trim()
      if (!trimmed) continue
      // 完整包含匹配
      if (majorKeywords.includes(trimmed) || trimmed.includes(majorKeywords)) return 95
      // 首2字匹配（宽松匹配）
      if (trimmed.length >= 2 && majorShort.length >= 2 && trimmed.substring(0, 2) === majorShort) return 75
    }
  }

  // 没有直接匹配，根据岗位类别和通用领域做推测
  if (job.category === '技术类') {
    const techMajors = ['计算机', '软件', '信息', '电子', '通信', '自动化', '数据', '人工智能', '智能']
    if (techMajors.some(t => majorKeywords.includes(t))) return 70
    return 35
  }
  if (job.category === '产品类') return 60 // 产品类通常不限专业
  if (job.category === '设计类') {
    const designMajors = ['设计', '美术', '视觉', '数字媒体', '工业']
    if (designMajors.some(d => majorKeywords.includes(d))) return 80
    return 45
  }
  if (job.category === '职能类') return 65 // 职能类通常不限专业

  return 50
}

// ==================== MBTI 性格适配度 (满分 100) ====================
function calcMBTIScore(job: JobPosition, mbtiType: string): number {
  // 直接 MBTI 推荐
  if (job.recommendedMBTI.includes(mbtiType)) return 90

  // 通过 careerDirections 交叉匹配
  const careerInfo = mbtiCareerMap[mbtiType]
  if (!careerInfo) return 50

  const directions = careerInfo.careerDirections
  const category = job.category
  const jobTitle = job.title

  // careerDirections 到 category 的映射
  const dirToCategory: Record<string, string[]> = {
    '技术研发': ['技术类'],
    '后台开发': ['技术类'],
    '算法工程师': ['技术类'],
    '算法研究': ['技术类'],
    '技术架构': ['技术类'],
    '数据科学': ['技术类'],
    '安全工程师': ['技术类'],
    '运维开发': ['技术类'],
    '硬件工程师': ['技术类'],
    '技术售后': ['技术类'],
    '测试开发': ['技术类'],
    '测试工程师': ['技术类'],
    '质量管理': ['职能类'],
    '技术运营': ['技术类'],
    '前端开发': ['技术类'],
    '产品策划': ['产品类'],
    '产品管理': ['产品类'],
    '产品设计': ['设计类', '产品类'],
    '产品运营': ['产品类'],
    '战略分析': ['产品类'],
    '战略投资': ['产品类'],
    '投资分析': ['产品类'],
    '投资': ['产品类'],
    'UI设计': ['设计类'],
    '视觉设计': ['设计类'],
    'UI/交互设计': ['设计类'],
    '用户体验': ['设计类'],
    '交互设计': ['设计类'],
    '用户研究': ['设计类', '产品类'],
    '游戏策划': ['产品类'],
    '游戏运营': ['产品类'],
    '项目管理': ['产品类', '技术类'],
    '技术管理': ['技术类'],
    '市场营销': ['产品类'],
    '市场推广': ['产品类'],
    '市场公关': ['产品类'],
    '品牌营销': ['产品类'],
    '商务拓展': ['产品类'],
    '商务运营': ['产品类'],
    '销售管理': ['产品类'],
    'HR/招聘': ['职能类'],
    'HR/组织发展': ['职能类'],
    'HR/行政': ['职能类'],
    '人力资源': ['职能类'],
    '内容策划': ['产品类'],
    '内容运营': ['产品类'],
    '内容创作': ['产品类'],
    '活动策划': ['产品类'],
    '活动运营': ['产品类'],
    '直播运营': ['产品类'],
    '社群运营': ['产品类'],
    '用户增长': ['产品类'],
    '客户运营': ['产品类'],
    '客户成功': ['产品类'],
    '公关': ['产品类'],
    '雇主品牌': ['职能类'],
    '企业文化': ['职能类'],
    '财务': ['职能类'],
    '供应链管理': ['职能类'],
    '视频创作': ['设计类'],
  }

  // 检查是否有 careerDirection 匹配到当前岗位的 category
  for (const dir of directions) {
    const matchedCategories = dirToCategory[dir] || []
    if (matchedCategories.includes(category)) return 70
  }

  // 岗位 title 部分匹配
  for (const dir of directions) {
    if (jobTitle.includes(dir.substring(0, 2)) || dir.includes(jobTitle.substring(0, 2))) return 60
  }

  return 40
}

// ==================== 兴趣方向匹配度 (满分 100) ====================
function calcInterestScore(job: JobPosition, interestedFields: string[]): number {
  if (interestedFields.length === 0) return 50 // 未填写兴趣，给中等分

  for (const field of interestedFields) {
    const categories = interestToCategory[field]
    if (categories && categories.includes(job.category)) return 90
  }

  // 部分兴趣与岗位类型有较弱关联
  for (const field of interestedFields) {
    if (field === 'product' && job.category === '设计类') return 65
    if (field === 'design' && job.category === '产品类') return 65
  }

  return 30
}

// ==================== 生成个性化推荐理由 ====================
function generateMatchReason(
  job: JobPosition,
  grade: string,
  major: string,
  mbtiType: string,
  interestedFields: string[],
  scores: { majorScore: number; mbtiScore: number; interestScore: number; gradeScore: number }
): string {
  const reasons: string[] = []

  const gradeMap: Record<string, string> = {
    freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四', graduate: '研究生',
  }
  const gradeLabel = gradeMap[grade] || grade

  // 专业匹配理由
  if (scores.majorScore >= 80) {
    reasons.push(`你的「${major}」专业与这个岗位高度对口`)
  } else if (scores.majorScore >= 60) {
    reasons.push(`你的「${major}」专业背景为此岗位提供了良好基础`)
  }

  // MBTI 性格匹配理由
  const careerInfo = mbtiCareerMap[mbtiType]
  if (scores.mbtiScore >= 80) {
    reasons.push(`你的${mbtiType}性格特质（${careerInfo?.traits.slice(0, 2).join('、') || ''}）在这个岗位上非常有优势`)
  } else if (scores.mbtiScore >= 60) {
    reasons.push(`你的${mbtiType}性格在某些维度上与这个岗位相契合`)
  }

  // 兴趣匹配理由
  if (scores.interestScore >= 80 && interestedFields.length > 0) {
    const fieldLabels: Record<string, string> = {
      tech: '技术', product: '产品', design: '设计',
      operation: '运营', market: '市场', function: '职能',
    }
    const interestLabel = interestedFields.map(f => fieldLabels[f] || f).join('、')
    reasons.push(`你对「${interestLabel}」的兴趣与此岗位方向一致`)
  }

  // 年级匹配理由
  if (scores.gradeScore >= 85) {
    reasons.push(`${gradeLabel}正是准备这个方向的好时机`)
  }

  // 如果没有生成任何理由，使用默认
  if (reasons.length === 0) {
    return `${gradeLabel}的${major}专业同学也可以探索这个方向，说不定有意外惊喜呢！`
  }

  return reasons.join('，') + '✨'
}

// ==================== 主推荐函数：多维个性化推荐 ====================
export function getPersonalizedRecommendedJobs(
  grade: string,
  major: string,
  mbtiType: string,
  interestedFields: string[]
): JobPosition[] {
  return jobPositions
    .map((job) => {
      const majorScore = calcMajorScore(job, major)
      const mbtiScore = calcMBTIScore(job, mbtiType)
      const interestScore = calcInterestScore(job, interestedFields)
      const gradeScore = calcGradeScore(job, grade)

      // 综合加权计算 matchScore
      const matchScore = Math.round(
        majorScore * 0.30 + mbtiScore * 0.30 + interestScore * 0.25 + gradeScore * 0.15
      )

      return {
        ...job,
        matchScore,
        matchType: (mbtiScore >= majorScore ? 'personality' : 'professional') as 'professional' | 'personality',
        matchReason: generateMatchReason(job, grade, major, mbtiType, interestedFields, {
          majorScore, mbtiScore, interestScore, gradeScore,
        }),
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

// ==================== 兼容旧版推荐函数 ====================
export function getProfessionalRecommendedJobs(
  grade: string,
  major: string,
  mbtiType: string,
  interestedFields: string[]
): JobPosition[] {
  return getPersonalizedRecommendedJobs(grade, major, mbtiType, interestedFields)
    .filter(j => j.matchType === 'professional' || (j.matchType === 'personality' && j.matchScore >= 75))
    .slice(0, 3)
}

export function getPersonalityRecommendedJobs(
  grade: string,
  major: string,
  mbtiType: string,
  interestedFields: string[]
): JobPosition[] {
  return getPersonalizedRecommendedJobs(grade, major, mbtiType, interestedFields)
    .filter(j => j.matchType === 'personality')
    .slice(0, 3)
}
