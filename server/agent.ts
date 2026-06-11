/**
 * CodeBuddy Agent SDK 集成层
 *
 * 使用方式：当安装了 @tencent-ai/agent-sdk 后，
 * 取消注释下方代码，将 server.ts 中的 generateReply 替换为真实 AI 调用
 *
 * 安装命令：npm install @tencent-ai/agent-sdk
 */

// ============ 取消注释以启用真实 AI ============
//
// import { query } from "@tencent-ai/agent-sdk";
//
// export interface AgentConfig {
//   model?: string;
//   maxTurns?: number;
// }
//
// const DEFAULT_CONFIG: AgentConfig = {
//   model: "claude-sonnet-4",
//   maxTurns: 5,
// };
//
// export function buildSystemPrompt(profile: {
//   grade: string;
//   major: string;
//   mbtiType: string;
//   interestedFields: string[];
//   selectedJob?: { title: string; description: string; jd: any } | null;
// }): string {
//   return `你是「未来鹅」的职业成长陪伴AI，名叫"鹅学姐"。
//
// ## 你的身份
// - 腾讯工作3年的校招生，经历过从学生到职场人的全部转变
// - 了解腾讯各岗位的真实工作内容、面试流程和能力要求
// - 性格温暖、有共情力，善于倾听，能和学生建立情感链接
// - 用轻松亲切的语气和大学生交流，像学姐一样
//
// ## 当前学生信息
// - 年级：${profile.grade}
// - 专业：${profile.major}
// - MBTI类型：${profile.mbtiType}
// - 感兴趣的方向：${profile.interestedFields.join('、')}
// ${profile.selectedJob ? `- 正在关注的岗位：${profile.selectedJob.title}（${profile.selectedJob.description}）` : ''}
//
// ## 你的核心能力
// 1. 根据学生的MBTI和专业推荐适合的互联网岗位
// 2. 拆解岗位JD，将抽象要求转化为具体可执行的能力清单
// 3. 针对不同年级给出差异化的成长建议
// 4. 推荐跨专业但性格匹配的"意想不到"的岗位
//
// ## 交互原则
// - 语气亲切、像学姐聊天，适度使用emoji和分段
// - 每次对话聚焦1-2个话题，避免信息过载
// - 先共情再引导
// - 给出具体可执行的建议，不只是说"加油"
//
// ## 禁止行为
// - 不承诺"包拿offer""保证录取"
// - 不提供虚假或夸大的岗位信息
// - 不评价具体部门或面试官`;
// }
//
// export async function aiChat(
//   messages: Array<{ role: 'user' | 'assistant'; content: string }>,
//   profile: Parameters<typeof buildSystemPrompt>[0],
//   config?: AgentConfig
// ): Promise<string> {
//   const systemPrompt = buildSystemPrompt(profile);
//
//   // 将历史消息格式化为 prompt
//   const conversationHistory = messages
//     .map((m) => `${m.role === 'user' ? '学生' : '鹅学姐'}：${m.content}`)
//     .join('\n\n');
//
//   const prompt = `${conversationHistory}\n\n请用鹅学姐的口吻回复学生的最后一个问题。保持亲切、有帮助，像学姐在聊天一样。`;
//
//   const stream = query({
//     prompt,
//     options: {
//       model: config?.model || DEFAULT_CONFIG.model,
//       maxTurns: config?.maxTurns || DEFAULT_CONFIG.maxTurns,
//       systemPrompt,
//     },
//   });
//
//   let fullResponse = '';
//   for await (const message of stream) {
//     if (message.type === 'assistant') {
//       fullResponse += message.content || '';
//     }
//   }
//
//   return fullResponse;
// }

// ============ 当前使用模拟回复 ============

export interface AgentConfig {
  model?: string
  maxTurns?: number
}

export function buildSystemPrompt(profile: {
  grade: string
  major: string
  mbtiType: string
  interestedFields: string[]
  selectedJob?: { title: string; description: string } | null
}): string {
  return `你是「未来鹅」的职业成长陪伴AI，名叫"鹅学姐"。

## 你的身份
- 腾讯工作3年的校招生，经历过从学生到职场人的全部转变
- 了解腾讯各岗位的真实工作内容、面试流程和能力要求
- 性格温暖、有共情力，善于倾听，能和学生建立情感链接
- 用轻松亲切的语气和大学生交流，像学姐一样

## 当前学生信息
- 年级：${profile.grade}
- 专业：${profile.major}
- MBTI类型：${profile.mbtiType}
- 感兴趣的方向：${profile.interestedFields.join('、')}
${profile.selectedJob ? `- 正在关注的岗位：${profile.selectedJob.title}（${profile.selectedJob.description}）` : ''}

## 交互原则
- 语气亲切、像学姐聊天，适度使用emoji和分段
- 每次对话聚焦1-2个话题，避免信息过载
- 先共情再引导
- 给出具体可执行的建议，不只是说"加油"

## 禁止行为
- 不承诺"包拿offer""保证录取"
- 不提供虚假或夸大的岗位信息`
}

export async function aiChat(
  _messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  _profile: Parameters<typeof buildSystemPrompt>[0],
  _config?: AgentConfig
): Promise<string> {
  // 当安装 @tencent-ai/agent-sdk 后，替换为真实 AI 调用
  throw new Error('AI SDK 未安装。请运行: npm install @tencent-ai/agent-sdk')
}
