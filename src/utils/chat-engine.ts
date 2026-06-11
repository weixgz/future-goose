/**
 * 客户端聊天引擎 — 将服务端 generateReply 逻辑移植到前端
 * 当后端 API 不可用时（如 GitHub Pages 静态部署），自动回退到此引擎
 */
import { jobPositions } from '../data/job-positions'

// ==================== 类型 ====================
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

// ==================== 岗位别名映射 ====================
const jobAliasMap: Record<string, string> = {
  '后台开发': 'backend-dev', '后台': 'backend-dev', '后端开发': 'backend-dev',
  '后端': 'backend-dev', '服务端': 'backend-dev',
  '产品策划': 'product-manager', '产品经理': 'product-manager',
  '产品': 'product-manager', 'pm': 'product-manager',
  '前端开发': 'frontend-dev', '前端': 'frontend-dev', 'web前端': 'frontend-dev',
  '游戏策划': 'game-planner', '游戏': 'game-planner',
  '算法工程师': 'algorithm-engineer', '算法': 'algorithm-engineer',
  'ai工程师': 'algorithm-engineer', '机器学习': 'algorithm-engineer',
  '交互设计': 'ui-designer', 'ui设计': 'ui-designer', 'ui设计师': 'ui-designer',
  '设计': 'ui-designer',
  '产品运营': 'product-ops', '运营': 'product-ops',
  '人力资源': 'hr', 'hr': 'hr', '招聘': 'hr',
}

// ==================== 岗位匹配 ====================
function findJobByMessage(message: string) {
  const msg = message.toLowerCase()
  for (const job of jobPositions) {
    if (msg.includes(job.title.substring(0, 2))) return job
  }
  for (const [alias, jobId] of Object.entries(jobAliasMap)) {
    if (msg.includes(alias)) return jobPositions.find(j => j.id === jobId) || null
  }
  return null
}

// ==================== 构建岗位详情回复 ====================
function buildJobDetailReply(job: any, profile: UserProfile): string {
  const grade = gradeMap[profile.grade] || profile.grade
  const relevantPhase = job.growthPath?.find((p: any) =>
    p.targetGrade.includes(grade.substring(0, 2)) || p.targetGrade.includes(gradeLabelMatch(profile.grade))
  )

  let reply = `来啦～关于 **${job.title}** 这个岗位，我给你细细拆解一下 📋\n\n`

  reply += `### 🎯 工作职责\n`
  job.jd?.responsibilities?.forEach((r: string) => { reply += `• ${r}\n` })
  reply += `\n`

  reply += `### 💻 硬技能要求\n`
  job.jd?.hardSkills?.forEach((s: string) => { reply += `• ${s}\n` })
  reply += `\n`

  reply += `### 🧠 软技能要求\n`
  job.jd?.softSkills?.forEach((s: string) => { reply += `• ${s}\n` })
  reply += `\n`

  reply += `### ⭐ 加分项\n`
  job.jd?.bonusPoints?.forEach((b: string) => { reply += `• ${b}\n` })
  reply += `\n`

  if (relevantPhase) {
    reply += `### 🌱 ${grade}的你，现在可以这样做\n`
    reply += `**📌 ${relevantPhase.title}**（预计 ${relevantPhase.estimatedTime}）\n`
    relevantPhase.tasks?.forEach((t: string) => { reply += `• ${t}\n` })
    reply += `\n📚 **推荐资源：**\n`
    relevantPhase.resources?.forEach((r: string) => { reply += `• ${r}\n` })
    reply += `\n`
  }

  reply += `---\n${job.description}\n\n`
  reply += `作为 ${profile.major} 专业的 ${profile.mbtiType} 型同学，`
  reply += job.recommendedMBTI?.includes(profile.mbtiType)
    ? `这个岗位和你的性格特质很匹配哦～`
    : `这个方向也很值得探索呢～`
  reply += `有什么具体想深入了解的，随时问我！💙`

  return reply
}

function gradeLabelMatch(grade: string): string {
  return gradeMap[grade] || grade
}

// ==================== 生成回复 ====================
export function generateReply(
  userMessage: string,
  profile: UserProfile,
  selectedJob?: SelectedJob | null
): string {
  const grade = gradeMap[profile.grade] || profile.grade
  const msg = userMessage.toLowerCase()

  // 优先检测：用户提到了具体岗位
  const matchedJob = findJobByMessage(userMessage)
  if (matchedJob) {
    if (msg.includes('做什么') || msg.includes('职责') || msg.includes('一天') ||
        msg.includes('技能') || msg.includes('准备') || msg.includes('学习') ||
        msg.includes('怎么') || msg.includes('如何') || msg.includes('需要') ||
        msg.includes('面试') || msg.includes('jd') || msg.includes('要求') ||
        msg.includes('成长') || msg.includes('发展') || msg.includes('规划')) {
      return buildJobDetailReply(matchedJob, profile)
    }
  }

  const contextJob = selectedJob || (matchedJob && !msg.includes('推荐') && !msg.includes('其他'))

  // 岗位相关 — 做什么
  if (msg.includes('岗位') || msg.includes('做什么') || msg.includes('一天') || msg.includes('职责')) {
    if (contextJob) {
      return buildJobDetailReply(
        jobPositions.find(j => j.id === contextJob.id) || jobPositions[0],
        profile
      )
    }
    return `好问题！让我来给你讲讲真实的情况～ 😊\n\n以${profile.interestedFields.includes('tech') ? '技术岗' : '产品岗'}为例，在腾讯的一天大概是这样：\n\n🌅 **上午 9:30-10:00** 到工位，先看邮件和消息\n📋 **上午 10:00-12:00** 站会同步进度，深度工作\n🍜 **中午 12:00-14:00** 午休，团队聚餐\n💻 **下午 14:00-17:00** 协作讨论、代码Review/需求评审\n🎯 **下午 17:00-19:00** 集中处理手头任务\n🌙 **弹性** 版本发布期会忙一些\n\n对于${grade}的同学来说，现在最重要的是打好基础～\n\n💡 提示：直接问我具体岗位，比如"后台开发工程师需要准备什么？"～`
  }

  // 技能/准备/学习
  if (msg.includes('技能') || msg.includes('准备') || msg.includes('学习')) {
    if (contextJob) {
      return buildJobDetailReply(
        jobPositions.find(j => j.id === contextJob.id) || jobPositions[0],
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
    return `针对${grade}的你，需要重点准备的技能是：\n\n${skills}\n\n📅 **时间规划建议：**\n${grade === '大一' ? '• 这学期先入门1-2项核心技能\n• 暑假做一个练手项目\n• 大二开始找第一份实习' : ''}${grade === '大二' ? '• 这学期完成一个完整的项目\n• 准备大三暑假的暑期实习面试\n• 多参加校内比赛积累经验' : ''}${grade === '大三' ? '• 重点准备暑期实习面试\n• 系统刷LeetCode/练case\n• 完善简历和项目经历' : ''}${grade === '大四' || grade === '研究生' ? '• 针对性准备目标岗位面试\n• 复盘过往实习/项目经验\n• 建立行业人脉和认知' : ''}\n\n需要我帮你制定更详细的学习路线吗？告诉我你具体想了解哪个岗位～`
  }

  // 面试/笔试/简历
  if (msg.includes('面试') || msg.includes('笔试') || msg.includes('简历')) {
    if (contextJob) {
      const job = jobPositions.find(j => j.id === contextJob.id)
      if (job) {
        return `关于 **${job.title}** 的面试准备 📝\n\n**📄 简历建议：**\n• 突出与${job.category}相关的项目经验\n• 用数据量化成果\n• 控制在1页以内\n\n**📝 笔试准备：**\n${job.category === '技术类' ? '• LeetCode中等难度至少刷100题\n• 重点：数据结构、算法、系统设计' : ''}${job.category === '产品类' ? '• 多练case分析，建立框架思维\n• 关注互联网行业热点' : ''}${job.category === '设计类' ? '• 准备3-5个完整作品集项目\n• 练习限时设计挑战' : ''}${job.category === '职能类' ? '• 准备HR相关case分析\n• 了解腾讯的组织文化' : ''}\n\n**🎤 面试流程（腾讯校招）：**\n• 笔试 → 2-3轮专业面 → HR面\n• 重点是项目深挖和基础考察\n\n作为${profile.mbtiType}型人格，你的${profile.mbtiType.includes('E') ? '外向表达' : '深度思考'}特质在面试中是优势！💙`
      }
    }
    return `面试这块我很熟！📝\n\n**📄 简历建议：**\n• 突出项目经验而非课程列表\n• 用数据量化成果\n• 控制在1页以内\n\n**📝 笔试准备：**\n• 技术岗：LeetCode中等难度至少刷100题\n• 产品岗：多练case分析\n• 设计岗：准备3-5个作品集项目\n\n**🎤 面试流程（腾讯校招）：**\n• 笔试 → 2-3轮技术面 → HR面\n\n作为${profile.mbtiType}型人格，你的${profile.mbtiType.includes('E') ? '外向表达' : '深度思考'}特质在面试中是优势！\n\n💡 想了解具体岗位的面试准备？告诉我岗位名称！`
  }

  // 实习/经验
  if (msg.includes('实习') || msg.includes('经验')) {
    return `关于实习 📌\n\n对于${grade}的你：\n${grade === '大一' ? '• 大一可以先参加校内项目和比赛\n• 暑假可以做远程小项目或开源贡献' : ''}${grade === '大二' ? '• 这是找第一份实习的好时机\n• 可以从中小厂开始积累经验\n• 参加腾讯暑期实习项目' : ''}${grade === '大三' ? '• 暑假实习至关重要，尽量争取大厂\n• 腾讯暑期实习转正率很高\n• 关注"腾讯校园招聘"官网' : ''}${grade === '大四' || grade === '研究生' ? '• 同时准备秋招和实习\n• 重点复盘和包装过往经验' : ''}\n\n💡 腾讯实习分暑期实习（3-6月投递）和日常实习（全年），暑期含金量最高！`
  }

  // 推荐/方向/迷茫
  if (msg.includes('推荐') || msg.includes('适合') || msg.includes('方向') || msg.includes('迷茫')) {
    return `理解你的迷茫～其实这很正常 🌱\n\n根据你的MBTI **${profile.mbtiType}** 和 **${profile.major}** 专业：\n\n🎯 **专业对口方向：**\n你的专业在互联网行业很受欢迎\n\n🌟 **性格惊喜方向：**\n${profile.mbtiType.includes('N') ? '• 直觉型思维适合战略规划\n' : ''}${profile.mbtiType.includes('T') ? '• 理性分析在数据分析、商分中很有优势\n' : '• 你对他人的敏感度在HR、用户研究中很加分\n'}${profile.mbtiType.includes('J') ? '• 计划性强在项目管理方向会很出色\n' : '• 灵活性是运营、市场类的核心竞争力\n'}\n建议你回到岗位推荐页面，看看有没有之前没想过的选项～ 😉`
  }

  // 打招呼
  if (msg.includes('你好') || msg.includes('嗨') || msg.includes('hello')) {
    let reply = `嗨～你好呀！👋\n\n我是鹅学姐，在腾讯工作了3年，经历过和你一样的迷茫时期。\n\n关于你的情况：\n• 🎓 ${grade} | ${profile.major}专业\n• 🧠 MBTI: ${profile.mbtiType}`
    if (contextJob) {
      reply += `\n\n我看到你在关注 **${contextJob.title}**：
• 想知道具体工作职责吗？
• 需要准备哪些硬技能？
• 面试一般会问什么？
• ${grade}的我该怎么规划？`
    } else {
      reply += `\n\n有什么职业规划上的问题尽管问我！\n\n💡 你也可以直接问我具体岗位，我会给你详细解答！\n\n这里有 8 个腾讯校招热门岗位：\n${jobPositions.map(j => `• ${j.title}（${j.category} - ${j.department}）`).join('\n')}\n\n放心，这里没有标准答案，只有学姐的真实分享～ 💙`
    }
    return reply
  }

  // 默认回复
  return `嗯，这是个好问题！🤔\n\n作为${grade}的${profile.major}专业同学，你的${profile.mbtiType}型人格其实挺适合在互联网行业的～\n\n${contextJob ? `关于 **${contextJob.title}**，你可以问我：\n• 具体做什么工作？\n• 需要学习哪些技能？\n• 面试怎么准备？\n• ${grade}的我该怎么规划？` : `要聊这个话题的话，可能需要你稍微具体一点～比如：\n• 你想了解具体的岗位？\n• 想知道现在该准备什么？\n• 还是对未来的方向不确定？`}\n\n告诉我更多，我才能给你更有针对性的建议哦～ 💙`
}
