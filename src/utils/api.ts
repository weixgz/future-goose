import axios from 'axios'
import { generateReply } from './chat-engine'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SelectedJobInfo {
  id: string
  title: string
  category: string
  department: string
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userProfile: {
    grade: string
    major: string
    mbtiType: string
    interestedFields: string[]
  },
  selectedJob?: SelectedJobInfo | null
): Promise<string> {
  try {
    const res = await api.post('/chat', { messages, userProfile, selectedJob })
    return res.data.reply
  } catch {
    // Fallback: 后端不可用时使用客户端聊天引擎（GitHub Pages 场景）
    const lastUserMsg = messages
      .filter((m) => m.role === 'user')
      .pop()?.content || ''
    return generateReply(lastUserMsg, userProfile, selectedJob)
  }
}
