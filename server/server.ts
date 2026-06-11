import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// ==================== 岗位数据加载 ====================
// 从编译后的 JS 文件读取岗位数据（运行时 import 支持 ESM）
// 如果直接 import 失败，则定义内联数据
let jobPositions: any[] = []

try {
  // 尝试从 src 目录的 ts 源文件读取（开发模式 tsx 运行）
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const jobDataPath = resolve(__dirname, '../src/data/job-positions.ts')
  const raw = readFileSync(jobDataPath, 'utf-8')
  // 从 TS 源码中提取 jobPositions 数组（简化解析）
  const match = raw.match(/export const jobPositions: JobPosition\[\] = (\[[\s\S]*?\]);/)
  if (match) {
    // 基本的数据提取：从 TS 导出中解析 JSON-like 结构
    jobPositions = extractJobPositions(raw)
  }
} catch {
  console.log('⚠️ 无法读取岗位源码，使用内联快照数据')
}

// 简易 TS 数据提取器（解析 export const jobPositions = [...]）
function extractJobPositions(raw: string): any[] {
  try {
    // 找到数组起始位置
    const startIdx = raw.indexOf('export const jobPositions: JobPosition[] = [')
    if (startIdx === -1) return []

    // 提取数组内容（简化处理：找到匹配的 ] 结尾）
    let braceCount = 0
    let inString = false
    let escape = false
    let content = ''
    let foundStart = false

    for (let i = startIdx + raw.substring(startIdx).indexOf('['); i < raw.length; i++) {
      const ch = raw[i]
      content += ch

      if (escape) { escape = false; continue }
      if (ch === '\\') { escape = true; continue }
      if (ch === '"' || ch === "'" || ch === '`') {
        if (!inString) { inString = true } else { inString = false }
      }
      if (inString) continue

      if (ch === '{') braceCount++
      if (ch === '}') braceCount--
      if (ch === ']' && braceCount === 0) break
    }

    // 将 TS 对象字面量转为 JSON（简化处理）
    const jsonStr = content
      .replace(/'/g, '"')                           // 单引号 → 双引号
      .replace(/(\w+):/g, '"$1":')                    // 无引号 key → 带引号 key
      .replace(/,\s*}/g, '}')                         // 移除尾随逗号
      .replace(/,\s*\]/g, ']')
      .replace(/\/\/.*$/gm, '')                       // 移除行注释

    return JSON.parse(jsonStr)
  } catch (e) {
    console.log('⚠️ 岗位数据解析失败，使用内联数据', e)
    return []
  }
}

// 内联岗位快照（当文件读取失败时使用）
const inlineJobPositions: any[] = [
  {
    id: 'backend-dev', title: '后台开发工程师', category: '技术类', department: '微信事业群',
    description: '负责腾讯核心产品的后端服务架构设计与开发，支撑亿级用户的高并发场景。',
    jd: {
      responsibilities: ['负责后台服务的架构设计、开发与维护', '参与高并发、高可用系统的设计与优化', '编写高质量代码，进行代码审查', '与产品、前端团队紧密协作，推动项目落地'],
      hardSkills: ['Go/C++/Java至少精通一门', '数据结构与算法', '数据库(MySQL/Redis)', '分布式系统设计', 'Linux操作系统'],
      softSkills: ['逻辑分析能力', '问题拆解能力', '团队协作', '技术文档编写'],
      bonusPoints: ['有个人开源项目', 'ACM/数学建模竞赛经历', '了解微服务架构', '有实习经验'],
    },
    growthPath: [
      { phase: 1, title: '基础能力积累期', targetGrade: '大一', tasks: ['学习一门编程语言（推荐Go或Python）', '掌握基础数据结构与算法', '完成LeetCode 50题', '加入校内技术社团/实验室'], resources: ['《Go语言程序设计》', 'LeetCode官网', 'B站-尚硅谷Go教程'], estimatedTime: '3-6个月' },
      { phase: 2, title: '进阶提升期', targetGrade: '大二', tasks: ['学习数据库（MySQL + Redis）', '完成一个完整的Web后端项目', '学习Linux基本操作和Shell脚本', '参加校内外编程比赛（如ACM）'], resources: ['《高性能MySQL》', 'GitHub开源项目', '腾讯云免费云服务'], estimatedTime: '6-12个月' },
      { phase: 3, title: '实战冲刺期', targetGrade: '大三/大四', tasks: ['找一份技术实习（优先大厂）', '系统学习分布式系统设计', '阅读优秀开源项目源码', '准备技术面试（八股文+系统设计）'], resources: ['《设计数据密集型应用》', '牛客网面经', '各大厂技术博客'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'product-manager', title: '产品策划', category: '产品类', department: 'PCG平台与内容事业群',
    description: '负责腾讯社交、内容、工具等产品的功能策划与迭代，定义产品方向和用户体验。',
    jd: {
      responsibilities: ['深入理解用户需求，进行产品功能策划', '撰写PRD文档，推动设计、开发落地', '跟踪产品数据，持续优化产品体验', '竞品分析与行业趋势研究'],
      hardSkills: ['需求分析', '原型设计(Figma/Axure)', '数据分析(SQL/Excel)', '项目推进能力'],
      softSkills: ['用户共情能力', '逻辑表达与沟通', '跨团队协作', '创新思维'],
      bonusPoints: ['有产品相关实习', '独立完成过产品分析报告', '了解互联网商业模式', '会简单的编程'],
    },
    growthPath: [
      { phase: 1, title: '产品思维启蒙期', targetGrade: '大一', tasks: ['每周深度体验一款APP并写分析笔记', '阅读产品经理经典书籍', '学习Figma基础操作', '关注互联网行业动态'], resources: ['《人人都是产品经理》', '《俞军产品方法论》', '36氪/虎嗅等科技媒体'], estimatedTime: '3-6个月' },
      { phase: 2, title: '能力锻造期', targetGrade: '大二', tasks: ['独立完成一份完整的产品分析报告', '学习SQL进行数据分析', '参加产品类比赛或Hackathon', '尝试运营一个小的产品/社群'], resources: ['woshipm.com 人人都是产品经理社区', 'ProcessOn流程图工具', '腾讯大学公开课'], estimatedTime: '6-12个月' },
      { phase: 3, title: '求职准备期', targetGrade: '大三/大四', tasks: ['找一份产品实习（互联网公司优先）', '准备产品面试作品集', '练习产品case分析', '建立自己的产品方法论框架'], resources: ['牛客网产品面经', '《幕后产品》', '各大厂产品公众号'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'frontend-dev', title: '前端开发工程师', category: '技术类', department: 'CDG企业发展事业群',
    description: '负责腾讯Web端、小程序等产品的前端架构设计、性能优化和用户体验打磨。',
    jd: {
      responsibilities: ['负责Web/小程序前端功能开发', '前端性能优化和用户体验提升', '参与前端工程化建设和组件库维护', '与设计、后端团队紧密协作'],
      hardSkills: ['HTML/CSS/JavaScript', 'React/Vue至少精通一个', 'TypeScript', '前端构建工具(Webpack/Vite)', '浏览器原理'],
      softSkills: ['设计审美', '用户导向思维', '技术热情', '沟通协作'],
      bonusPoints: ['有个人博客/技术分享', 'GitHub活跃贡献', '了解Node.js', '有移动端开发经验'],
    },
    growthPath: [
      { phase: 1, title: '前端入门期', targetGrade: '大一', tasks: ['学习HTML/CSS/JavaScript基础', '完成一个静态页面模仿练习', '学习Git版本管理', '加入前端技术社区'], resources: ['MDN Web Docs', 'freeCodeCamp', '《JavaScript高级程序设计》'], estimatedTime: '3-6个月' },
      { phase: 2, title: '框架进阶期', targetGrade: '大二', tasks: ['深入学习React或Vue框架', '学习TypeScript', '完成一个全栈个人项目', '了解前端性能优化'], resources: ['Vue/React官方文档', '掘金社区', 'GitHub优秀项目'], estimatedTime: '6-12个月' },
      { phase: 3, title: '工程化实战期', targetGrade: '大三/大四', tasks: ['找一份前端实习', '学习前端工程化（CI/CD/测试）', '深入理解浏览器渲染原理', '准备技术面试'], resources: ['各大厂前端技术博客', '前端早早聊大会', 'LeetCode前端专题'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'game-planner', title: '游戏策划', category: '产品类', department: 'IEG互动娱乐事业群',
    description: '参与腾讯游戏的玩法设计、数值体系搭建和用户体验打磨，打造好玩的游戏。',
    jd: {
      responsibilities: ['设计游戏核心玩法和系统功能', '搭建游戏数值体系和经济系统', '撰写策划文档，跟进开发实现', '分析玩家数据，迭代优化游戏体验'],
      hardSkills: ['游戏设计理论', '数值策划与平衡', '文档撰写能力', 'Excel高级应用'],
      softSkills: ['创造力与想象力', '逻辑思维', '玩家共情', '沟通表达'],
      bonusPoints: ['游戏深度玩家', '独立制作过游戏Demo', '了解游戏引擎(Unity/UE)', '有游戏分析文章'],
    },
    growthPath: [
      { phase: 1, title: '游戏认知积累期', targetGrade: '大一', tasks: ['每周深度体验一款游戏并写分析', '学习游戏设计基础理论', '学习Excel数据分析和可视化', '关注游戏行业动态'], resources: ['《游戏设计梦工厂》', '《体验引擎》', 'GDC演讲视频', '游戏陀螺/GameLook'], estimatedTime: '3-6个月' },
      { phase: 2, title: '策划能力锻造期', targetGrade: '大二', tasks: ['完成一份完整的游戏反策划案', '学习Unity基础，尝试做个小Demo', '参加GameJam比赛', '分析热门游戏的数值体系'], resources: ['Unity官方教程', 'indienova独立游戏社区', '《游戏数值设计》'], estimatedTime: '6-12个月' },
      { phase: 3, title: '求职冲刺期', targetGrade: '大三/大四', tasks: ['找一份游戏公司实习', '准备游戏策划作品集', '深入研究目标品类的游戏', '准备策划面试题'], resources: ['牛客网游戏策划面经', '腾讯游戏学院', '各大厂游戏策划博客'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'algorithm-engineer', title: '算法工程师', category: '技术类', department: 'TEG技术工程事业群',
    description: '负责腾讯AI算法研究与应用落地，覆盖推荐系统、NLP、CV等方向。',
    jd: {
      responsibilities: ['参与机器学习/深度学习算法研发与优化', '负责推荐系统/NLP/CV等方向的技术攻关', '将算法模型部署到生产环境', '跟踪前沿技术并进行技术预研'],
      hardSkills: ['Python/C++', '机器学习/深度学习理论', 'PyTorch/TensorFlow', '数据处理与分析', '数学基础(概率论/线代/优化)'],
      softSkills: ['研究创新能力', '论文阅读能力', '技术写作', '团队协作'],
      bonusPoints: ['有顶会论文发表', 'Kaggle竞赛获奖', '有相关项目经验', '博士/硕士学历'],
    },
    growthPath: [
      { phase: 1, title: '数学与编程基础期', targetGrade: '大一', tasks: ['扎实学习高等数学/线性代数/概率论', '掌握Python编程', '学习数据结构与算法', '参加数学建模竞赛'], resources: ['吴恩达《Machine Learning》', 'LeetCode', 'Kaggle入门竞赛'], estimatedTime: '6-12个月' },
      { phase: 2, title: '深度学习进阶期', targetGrade: '大二', tasks: ['系统学习机器学习/深度学习课程', '掌握PyTorch框架', '复现经典论文', '参与实验室科研项目'], resources: ['李宏毅机器学习课程', 'CS231n/CS224n', 'Papers with Code'], estimatedTime: '6-12个月' },
      { phase: 3, title: '研究方向深耕期', targetGrade: '大三/大四', tasks: ['确定研究方向(NLP/CV/推荐等)', '尝试发表论文', '找算法实习', '参加Kaggle竞赛冲奖'], resources: ['arXiv每日论文', '各大AI Lab技术博客', '顶会论文解读'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'ui-designer', title: '交互/UI设计师', category: '设计类', department: 'CSIG云与智慧产业事业群',
    description: '负责腾讯B端和C端产品的界面设计、交互设计和视觉规范制定。',
    jd: {
      responsibilities: ['负责产品的交互设计和UI视觉设计', '参与设计规范的制定和维护', '输出高保真原型和设计稿', '与产品、开发团队协作推进落地'],
      hardSkills: ['Figma/Sketch', '交互设计理论', '用户研究方法', '设计系统搭建'],
      softSkills: ['审美能力', '同理心', '沟通表达', '细节把控'],
      bonusPoints: ['有完整的设计作品集', '了解前端开发', '有动效设计能力', '有设计奖项'],
    },
    growthPath: [
      { phase: 1, title: '设计基础积累期', targetGrade: '大一', tasks: ['学习设计基础（色彩/排版/构图）', '掌握Figma基础操作', '每天临摹一个优秀设计', '建立设计灵感库'], resources: ['Dribbble/Behance', '《写给大家看的设计书》', 'B站设计教程'], estimatedTime: '3-6个月' },
      { phase: 2, title: '交互设计进阶期', targetGrade: '大二', tasks: ['系统学习交互设计方法论', '完成3个完整的APP/Web设计项目', '学习用户研究和可用性测试', '参加设计比赛'], resources: ['《About Face 4》', 'Nielsen Norman Group', '各大厂设计公众号'], estimatedTime: '6-12个月' },
      { phase: 3, title: '求职准备期', targetGrade: '大三/大四', tasks: ['找一份设计实习', '打磨设计作品集（重中之重）', '学习设计系统搭建', '准备设计面试'], resources: ['站酷/UI中国', '各厂设计团队博客', 'Design+Code'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'product-ops', title: '产品运营', category: '产品类', department: 'PCG平台与内容事业群',
    description: '负责腾讯产品的用户增长、内容运营、活动策划和用户社群维护。',
    jd: {
      responsibilities: ['策划和执行产品运营活动，提升用户活跃', '分析用户数据，优化运营策略', '管理用户社群，维护用户关系', '内容策划与传播推广'],
      hardSkills: ['数据分析(SQL/Excel)', '活动策划与执行', '内容创作', '用户调研'],
      softSkills: ['创意策划能力', '执行力和抗压能力', '用户共情', '沟通协调'],
      bonusPoints: ['有新媒体运营经验', '熟悉各大社交平台玩法', '有社群运营经验', '会简单的PS/视频剪辑'],
    },
    growthPath: [
      { phase: 1, title: '运营入门期', targetGrade: '大一', tasks: ['运营一个自己的社交账号或社群', '学习基础数据分析（Excel+SQL）', '关注热门互联网产品玩法', '阅读运营经典书籍'], resources: ['《运营之光》', '《增长黑客》', '鸟哥笔记', '运营研究社'], estimatedTime: '3-6个月' },
      { phase: 2, title: '专项能力提升期', targetGrade: '大二', tasks: ['独立策划并执行一个运营活动', '深入学习用户增长方法论', '学习基础设计工具(Canva/稿定)', '参与校内大型活动策划'], resources: ['腾讯大学运营课程', '三节课运营课程', '各大厂运营公众号'], estimatedTime: '6-12个月' },
      { phase: 3, title: '实战冲刺期', targetGrade: '大三/大四', tasks: ['找一份互联网运营实习', '建立自己的运营方法论体系', '积累可量化的运营成果数据', '准备运营面试（case+数据题）'], resources: ['牛客网运营面经', '人人都是产品经理', '运营深度精选'], estimatedTime: '6-12个月' },
    ],
  },
  {
    id: 'hr', title: '人力资源', category: '职能类', department: 'S3职能系统',
    description: '负责腾讯人才招聘、组织发展、员工关系、培训发展等人力资源管理工作。',
    jd: {
      responsibilities: ['参与招聘全流程，包括需求对接、人才寻访、面试跟进', '协助组织发展和人才盘点项目', '参与员工关系管理和文化建设', '支持培训项目的策划与落地'],
      hardSkills: ['招聘全流程管理', '数据分析(Excel/PPT)', '劳动法基础知识', '项目策划与执行'],
      softSkills: ['沟通亲和力', '组织协调能力', '职业敏感度', '服务意识'],
      bonusPoints: ['有HR相关实习', '有人力资源相关证书', '了解互联网行业', '有活动组织经验'],
    },
    growthPath: [
      { phase: 1, title: '认知启蒙期', targetGrade: '大一', tasks: ['了解HR六大模块和三支柱模型', '学习基础劳动法知识', '参与校内社团/学生组织管理', '培养沟通和倾听能力'], resources: ['《人力资源转型》', '三茅人力资源网', 'HRoot'], estimatedTime: '3-6个月' },
      { phase: 2, title: '专项能力积累期', targetGrade: '大二', tasks: ['深入学习招聘/培训等1-2个模块', '参与企业HR相关项目或比赛', '学习HR数据分析', '了解互联网行业组织特点'], resources: ['《联盟》', '领英学习HR课程', '各大厂HR公众号'], estimatedTime: '6-12个月' },
      { phase: 3, title: '实战冲刺期', targetGrade: '大三/大四', tasks: ['找一份HR实习（互联网优先）', '建立HR专业方法论', '了解腾讯组织文化', '准备HR面试'], resources: ['牛客网HR面经', 'HRGO', '人力资源开发网'], estimatedTime: '6-12个月' },
    ],
  },
]

// 合并数据源
if (jobPositions.length === 0) {
  jobPositions = inlineJobPositions
}

// ==================== 类型定义 ====================

interface UserProfile {
  grade: string
  major: string
  mbtiType: string
  interestedFields: string[]
}

interface SelectedJob {
  id: string
  title: string
  category: string
  department: string
}

const gradeMap: Record<string, string> = {
  freshman: '大一', sophomore: '大二', junior: '大三',
  senior: '大四', graduate: '研究生',
}

// ==================== 岗位关键词匹配 ====================
// 别名映射，支持多种称呼匹配到同一岗位
const jobAliasMap: Record<string, string> = {
  '后台开发': 'backend-dev',
  '后台': 'backend-dev',
  '后端开发': 'backend-dev',
  '后端': 'backend-dev',
  '服务端': 'backend-dev',
  '产品策划': 'product-manager',
  '产品经理': 'product-manager',
  '产品': 'product-manager',
  'pm': 'product-manager',
  '前端开发': 'frontend-dev',
  '前端': 'frontend-dev',
  'web前端': 'frontend-dev',
  '游戏策划': 'game-planner',
  '游戏': 'game-planner',
  '算法工程师': 'algorithm-engineer',
  '算法': 'algorithm-engineer',
  'ai工程师': 'algorithm-engineer',
  '机器学习': 'algorithm-engineer',
  '交互设计': 'ui-designer',
  'ui设计': 'ui-designer',
  'ui设计师': 'ui-designer',
  '设计': 'ui-designer',
  '产品运营': 'product-ops',
  '运营': 'product-ops',
  '人力资源': 'hr',
  'hr': 'hr',
  '招聘': 'hr',
}

function findJobByMessage(message: string): any | null {
  const msg = message.toLowerCase()

  // 先尝试精确匹配岗位名
  for (const job of jobPositions) {
    if (msg.includes(job.title.toLowerCase()) || msg.includes(job.title.substring(0, 2).toLowerCase())) {
      return job
    }
  }

  // 别名匹配
  for (const [alias, jobId] of Object.entries(jobAliasMap)) {
    if (msg.includes(alias.toLowerCase())) {
      return jobPositions.find(j => j.id === jobId) || null
    }
  }

  return null
}

// ==================== 构建岗位详情回复 ====================
function buildJobDetailReply(job: any, profile: UserProfile): string {
  const grade = gradeMap[profile.grade] || profile.grade

  // 找到适配当前年级的成长阶段
  const relevantPhase = job.growthPath?.find((p: any) =>
    p.targetGrade.includes(grade.substring(0, 2)) || p.targetGrade.includes(gradeLabelMatch(profile.grade))
  )

  let reply = `来啦～关于 **${job.title}** 这个岗位，我给你细细拆解一下 📋\n\n`

  // 岗位职责
  reply += `### 🎯 工作职责\n`
  if (job.jd?.responsibilities) {
    job.jd.responsibilities.forEach((r: string) => {
      reply += `• ${r}\n`
    })
  }
  reply += `\n`

  // 硬技能
  reply += `### 💻 硬技能要求\n`
  if (job.jd?.hardSkills) {
    job.jd.hardSkills.forEach((s: string) => {
      reply += `• ${s}\n`
    })
  }
  reply += `\n`

  // 软技能
  reply += `### 🧠 软技能要求\n`
  if (job.jd?.softSkills) {
    job.jd.softSkills.forEach((s: string) => {
      reply += `• ${s}\n`
    })
  }
  reply += `\n`

  // 加分项
  reply += `### ⭐ 加分项\n`
  if (job.jd?.bonusPoints) {
    job.jd.bonusPoints.forEach((b: string) => {
      reply += `• ${b}\n`
    })
  }
  reply += `\n`

  // 针对当前年级的成长路径
  if (relevantPhase) {
    reply += `### 🌱 ${grade}的你，现在可以这样做\n`
    reply += `**📌 ${relevantPhase.title}**（预计 ${relevantPhase.estimatedTime}）\n`
    if (relevantPhase.tasks) {
      relevantPhase.tasks.forEach((t: string) => {
        reply += `• ${t}\n`
      })
    }
    reply += `\n📚 **推荐资源：**\n`
    if (relevantPhase.resources) {
      relevantPhase.resources.forEach((r: string) => {
        reply += `• ${r}\n`
      })
    }
    reply += `\n`
  }

  // 描述
  reply += `---\n${job.description}\n`

  // 个性化结语
  reply += `\n作为 ${profile.major} 专业的 ${profile.mbtiType} 型同学，`
  if (job.recommendedMBTI?.includes(profile.mbtiType)) {
    reply += `这个岗位和你的性格特质很匹配哦～`
  } else {
    reply += `这个方向也很值得探索呢～`
  }
  reply += `有什么具体想深入了解的，随时问我！💙`

  return reply
}

function gradeLabelMatch(grade: string): string {
  return gradeMap[grade] || grade
}

// ==================== 上下文感知回复 ====================
function generateReply(userMessage: string, profile: UserProfile, selectedJob?: SelectedJob | null): string {
  const grade = gradeMap[profile.grade] || profile.grade
  const msg = userMessage.toLowerCase()

  // ===== 优先检测：用户提到了具体岗位 =====
  const matchedJob = findJobByMessage(userMessage)
  if (matchedJob) {
    // 检测是否在询问岗位详情
    if (msg.includes('做什么') || msg.includes('职责') || msg.includes('一天') ||
        msg.includes('技能') || msg.includes('准备') || msg.includes('学习') ||
        msg.includes('怎么') || msg.includes('如何') || msg.includes('需要') ||
        msg.includes('面试') || msg.includes('jd') || msg.includes('要求') ||
        msg.includes('成长') || msg.includes('发展') || msg.includes('规划')) {
      return buildJobDetailReply(matchedJob, profile)
    }
  }

  // ===== 如果上下文中有 selectedJob =====
  const contextJob = selectedJob || (matchedJob && !msg.includes('推荐') && !msg.includes('其他'))

  // 岗位相关 — 做什么
  if (msg.includes('岗位') || msg.includes('做什么') || msg.includes('一天') || msg.includes('职责')) {
    if (contextJob) {
      return buildJobDetailReply(
        jobPositions.find(j => j.id === contextJob.id) || contextJob,
        profile
      )
    }
    return `好问题！让我来给你讲讲真实的情况～ 😊

以${profile.interestedFields.includes('tech') ? '技术岗' : '产品岗'}为例，在腾讯的一天大概是这样：

🌅 **上午 9:30-10:00** 到工位，先看邮件和消息，确认今天的优先级
📋 **上午 10:00-12:00** 站会同步进度，然后进入深度工作时间
🍜 **中午 12:00-14:00** 午休，很多团队会一起吃饭聊天
💻 **下午 14:00-17:00** 协作讨论、代码Review/需求评审
🎯 **下午 17:00-19:00** 集中处理手头任务
🌙 **弹性** 大部分团队不强制加班，但版本发布期会忙一些

对于${grade}的同学来说，现在最重要的是打好基础，不用太焦虑～\n\n💡 提示：你可以直接问具体岗位，比如\"后台开发工程师需要准备什么？\"，我会给你该岗位的详细JD和成长路径哦～`
  }

  // 技能/准备/学习
  if (msg.includes('技能') || msg.includes('准备') || msg.includes('学习')) {
    if (contextJob) {
      return buildJobDetailReply(
        jobPositions.find(j => j.id === contextJob.id) || contextJob,
        profile
      )
    }
    const skillMap: Record<string, string> = {
      tech: '💻 硬技能：数据结构与算法、至少一门编程语言(Go/Python)、数据库基础\n🧠 软技能：逻辑分析、问题拆解、团队协作',
      product: '📝 硬技能：需求分析、原型设计(Figma)、数据分析(SQL)\n💡 软技能：用户共情、逻辑表达、项目推动',
      design: '🎨 硬技能：Figma/Sketch、交互设计理论、设计系统\n✨ 软技能：审美能力、用户研究、细节把控',
    }
    const field = profile.interestedFields[0] || 'tech'
    const skills = skillMap[field] || skillMap.tech

    return `针对${grade}的你，需要重点准备的技能是：

${skills}

📅 **时间规划建议：**
${grade === '大一' ? '• 这学期先入门1-2项核心技能\n• 暑假做一个练手项目\n• 大二开始找第一份实习' : ''}
${grade === '大二' ? '• 这学期完成一个完整的项目\n• 准备大三暑假的暑期实习面试\n• 多参加校内比赛积累经验' : ''}
${grade === '大三' ? '• 重点准备暑期实习面试\n• 系统刷LeetCode/练case\n• 完善简历和项目经历' : ''}
${grade === '大四' || grade === '研究生' ? '• 针对性准备目标岗位面试\n• 复盘过往实习/项目经验\n• 建立行业人脉和认知' : ''}

需要我帮你制定更详细的学习路线吗？可以告诉我你具体想了解哪个岗位～`
  }

  // 面试/笔试/简历
  if (msg.includes('面试') || msg.includes('笔试') || msg.includes('简历')) {
    if (contextJob) {
      const job = jobPositions.find(j => j.id === contextJob.id) || contextJob
      return `关于 **${job.title}** 的面试准备，我来给你分享经验 📝

**📄 简历建议：**
• 突出与${job.category}相关的项目经验而非课程列表
• 用数据量化成果（如"优化后性能提升30%"）
• 控制在1页以内

**📝 笔试准备：**
${job.category === '技术类' ? '• LeetCode中等难度至少刷100题\n• 重点：数据结构、算法、系统设计\n• 关注各大厂笔试真题' : ''}
${job.category === '产品类' ? '• 多练case分析，建立框架思维\n• 关注互联网行业热点和产品分析\n• 练习群面中的角色定位' : ''}
${job.category === '设计类' ? '• 准备3-5个完整作品集项目\n• 练习限时设计挑战\n• 关注大厂设计规范和趋势' : ''}
${job.category === '职能类' ? '• 准备HR相关case分析\n• 了解腾讯的组织文化和价值观\n• 准备行为面试题目' : ''}

**🎤 面试流程（腾讯校招）：**
• 笔试 → 2-3轮专业面 → HR面
• 重点是项目深挖和基础考察
• 面试官更看重潜力和学习能力

作为${profile.mbtiType}型人格，你的${profile.mbtiType.includes('E') ? '外向表达' : '深度思考'}特质在面试中其实是优势！关键是要扬长避短～`
    }
    return `面试这块我很熟！作为过来人给你分享经验 📝

**📄 简历建议：**
• 突出项目经验而非课程列表
• 用数据量化成果（如"优化后性能提升30%"）
• 控制在1页以内

**📝 笔试准备：**
• 技术岗：LeetCode中等难度至少刷100题
• 产品岗：多练case分析，建立框架思维
• 设计岗：准备3-5个完整作品集项目

**🎤 面试流程（腾讯校招）：**
• 笔试 → 2-3轮技术面 → HR面
• 重点是项目深挖和基础考察
• 面试官更看重潜力和学习能力

作为${profile.mbtiType}型人格，你的${profile.mbtiType.includes('E') ? '外向表达' : '深度思考'}特质在面试中其实是优势！关键是要扬长避短～\n\n💡 想了解具体岗位的面试准备？告诉我岗位名称就行～`
  }

  // 实习/经验
  if (msg.includes('实习') || msg.includes('经验')) {
    return `关于实习，我的建议是 📌

对于${grade}的你：
${grade === '大一' ? '• 大一可以先参加校内项目和比赛\n• 暑假可以做远程小项目或开源贡献\n• 不一定非要大厂实习，经验积累最重要' : ''}
${grade === '大二' ? '• 这是找第一份实习的好时机\n• 可以从中小厂开始，积累经验再冲大厂\n• 参加腾讯的暑期实习项目是个好选择' : ''}
${grade === '大三' ? '• 暑假实习至关重要，尽量争取大厂\n• 腾讯暑期实习转正率很高\n• 关注"腾讯校园招聘"官网和公众号' : ''}
${grade === '大四' || grade === '研究生' ? '• 可以同时准备秋招和实习\n• 如果已经有实习，重点复盘和包装经验\n• 关注腾讯校招公众号获取最新信息' : ''}

💡 腾讯的实习分为暑期实习（3-6月投递）和日常实习（全年），暑期实习含金量最高！`
  }

  // 推荐/适合/方向/迷茫
  if (msg.includes('推荐') || msg.includes('适合') || msg.includes('方向') || msg.includes('迷茫')) {
    return `理解你的迷茫～其实这很正常 🌱

根据你的MBTI **${profile.mbtiType}** 和 **${profile.major}** 专业，我建议你关注几个方向：

🎯 **专业对口方向：**
你的专业在互联网行业非常受欢迎，可以考虑${profile.interestedFields.includes('tech') ? '技术研发、算法工程' : profile.interestedFields.includes('product') ? '产品策划、技术产品' : '相关核心岗位'}

🌟 **性格惊喜方向（跨专业）：**
${profile.mbtiType.includes('N') ? '• 你的直觉型思维很适合战略规划类岗位\n• 产品策划和游戏策划也值得考虑' : ''}${profile.mbtiType.includes('T') ? '• 理性分析的特性在数据分析、商业分析中很有优势' : '• 你对他人的敏感度在HR、用户研究等领域很加分'}${profile.mbtiType.includes('J') ? '• 计划性强的人在项目管理、技术管理方向会很出色' : '• 灵活性是运营、市场类岗位的核心竞争力'}

建议你回到岗位推荐页面，看看有没有你之前没想过的选项～ 😉`
  }

  // 打招呼
  if (msg.includes('你好') || msg.includes('嗨') || msg.includes('hello')) {
    let reply = `嗨～你好呀！👋

我是鹅学姐，在腾讯工作了3年，经历过和你一样的迷茫时期。

关于你的情况：
• 🎓 ${grade} | ${profile.major}专业
• 🧠 MBTI: ${profile.mbtiType}`

    if (contextJob) {
      reply += `\n\n我看到你在关注 **${contextJob.title}**，这个岗位挺适合你的～关于这个岗位，想知道哪些方面呢？比如：
• 具体工作职责是什么？
• 需要准备哪些硬技能？
• 面试一般会问什么？
• ${grade}的我该怎么规划学习路线？`
    } else {
      reply += `\n\n有什么职业规划上的问题尽管问我！可以是：
• 岗位选择、技能准备
• 面试经验、实习建议
• 行业认知、职业方向
• 或者只是想聊聊你的困惑\n\n💡 你也可以直接问我具体岗位，比如"后台开发工程师的JD是什么？"，我会给你详细解答！`

      reply += `\n\n这里有 8 个腾讯校招热门岗位可以了解：
${jobPositions.map(j => `• ${j.title}（${j.category} - ${j.department}）`).join('\n')}

放心，这里没有标准答案，只有学姐的真实分享～ 💙`
    }

    return reply
  }

  // 默认回复
  return `嗯，这是个好问题！🤔

作为${grade}的${profile.major}专业同学，你的${profile.mbtiType}型人格其实挺适合在互联网行业的～

${contextJob ? `关于 **${contextJob.title}**，你可以问我：\n• 具体做什么工作？\n• 需要学习哪些技能？\n• 面试怎么准备？\n• ${grade}的我该怎么规划？` : `要聊这个话题的话，可能需要你稍微具体一点～比如：\n• 你想了解具体的岗位？\n• 想知道现在该准备什么？\n• 还是对未来的方向有些不确定？`}

告诉我更多，我才能给你更有针对性的建议哦～ 💙`
}

// ==================== API 路由 ====================

// POST /api/chat - AI 对话
app.post('/api/chat', (req, res) => {
  const { messages, userProfile, selectedJob } = req.body

  // 模拟延迟，更像真实AI应答
  const delay = 800 + Math.random() * 1200

  setTimeout(() => {
    const lastUserMsg = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || ''

    const reply = generateReply(lastUserMsg, userProfile, selectedJob || null)
    res.json({ reply })
  }, delay)
})

// GET /api/health - 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ==================== 生产环境：托管前端静态文件 ====================
const staticDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
try {
  const { statSync } = await import('fs')
  if (statSync(staticDir).isDirectory()) {
    console.log(`📦 生产模式：托管静态文件 ${staticDir}`)
    app.use(express.static(staticDir))
    // SPA fallback: 所有非 API 路由返回 index.html
    app.get('*', (_req, res) => {
      res.sendFile(resolve(staticDir, 'index.html'))
    })
  }
} catch {
  console.log('💡 开发模式：未找到 dist 目录，仅提供 API 服务')
}

app.listen(PORT, () => {
  console.log(`🐧 未来鹅后端服务已启动: http://localhost:${PORT}`)
  console.log(`   API地址: http://localhost:${PORT}/api`)
  console.log(`   健康检查: http://localhost:${PORT}/api/health`)
  console.log(`   已加载 ${jobPositions.length} 个岗位数据`)
})
