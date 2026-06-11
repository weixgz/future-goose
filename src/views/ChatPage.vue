<template>
  <div class="page-container chat-page">
    <!-- 顶部导航栏 -->
    <div class="chat-navbar">
      <button class="nav-back" @click="$router.back()">
        <span>← 返回</span>
      </button>
      <div class="nav-title">
        <div class="agent-dot"></div>
        <span>鹅学姐</span>
      </div>
      <div class="nav-placeholder"></div>
    </div>

    <!-- 岗位上下文 -->
    <div class="context-bar" v-if="store.selectedJob">
      <div class="context-inner">
        <span class="context-icon">📌</span>
        <span>{{ store.selectedJob.title }}</span>
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="chat-body" ref="messagesContainer">
      <!-- 欢迎消息 -->
      <div class="msg-group">
        <div class="msg-avatar-row">
          <div class="avatar avatar-goose">🐧</div>
          <span class="avatar-name">鹅学姐</span>
        </div>
        <div class="msg-bubble assistant">
          <p>嗨～我是鹅学姐！👋</p>
          <p>根据你的信息：<strong>{{ store.mbtiType }}</strong> 型人格，{{ store.major }}专业{{ gradeLabel }}的同学～</p>
          <p v-if="store.selectedJob">我看到你在关注 <strong>{{ store.selectedJob.title }}</strong>，这个岗位很适合你的性格呢！想了解什么？😊</p>
          <p v-else>有什么职业规划上的困惑，随时可以问我哦～我会用学姐的视角帮你分析！</p>
        </div>
      </div>

      <!-- 聊天记录 -->
      <div v-for="(msg, idx) in chatHistory" :key="idx">
        <!-- 用户消息 -->
        <div v-if="msg.role === 'user'" class="msg-group user-group">
          <div class="msg-bubble user">{{ msg.content }}</div>
        </div>

        <!-- AI 消息 -->
        <div v-else class="msg-group">
          <div class="msg-avatar-row">
            <div class="avatar avatar-goose">🐧</div>
            <span class="avatar-name">鹅学姐</span>
          </div>
          <div
            class="msg-bubble assistant"
            v-html="idx === chatHistory.length - 1 && isTyping
              ? renderStreamingText(msg.content, streamingIndex)
              : renderMarkdown(msg.content)"
          ></div>
        </div>
      </div>

      <!-- 打字指示器 -->
      <div v-if="isTyping && chatHistory.length === 0" class="msg-group">
        <div class="msg-avatar-row">
          <div class="avatar avatar-goose">🐧</div>
          <span class="avatar-name">鹅学姐</span>
        </div>
        <div class="msg-bubble assistant typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>

    <!-- 快捷问题 -->
    <div class="quick-bar" v-if="chatHistory.length <= 1">
      <div class="quick-scroll">
        <button
          v-for="q in quickQuestions"
          :key="q"
          class="quick-chip"
          @click="sendQuickQuestion(q)"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-bar">
      <div class="input-wrapper">
        <input
          ref="inputRef"
          v-model="inputMessage"
          class="text-input"
          placeholder="想问鹅学姐什么..."
          @keyup.enter="sendMessage"
          :disabled="isTyping"
        />
        <button
          class="send-icon-btn"
          :class="{ active: inputMessage.trim() && !isTyping }"
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isTyping"
        >
          ↑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { useUserStore } from '../stores/userProfile'
import { sendChatMessage, type ChatMessage, type SelectedJobInfo } from '../utils/api'

const store = useUserStore()
const messagesContainer = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const chatHistory = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const inputMessage = ref('')
const isTyping = ref(false)
const streamingIndex = ref(0)
let streamTimer: ReturnType<typeof setInterval> | null = null

const quickQuestions = computed(() => {
  const base = [
    '这个岗位具体做什么？',
    '我需要学习哪些技能？',
    '面试一般问什么问题？',
    '大二现在应该做什么？',
  ]
  if (store.selectedJob) {
    return [
      `${store.selectedJob.title}的一天是怎样的？`,
      '需要准备哪些硬技能？',
      '有什么推荐的书籍或课程？',
      '转行到这个方向难吗？',
    ]
  }
  return base
})

const gradeLabel = computed(() => {
  const labels: Record<string, string> = {
    freshman: '大一', sophomore: '大二', junior: '大三',
    senior: '大四', graduate: '研究生',
  }
  return labels[store.grade] || store.grade
})

// 简易 Markdown 渲染
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// 流式渲染（打字机效果）
function renderStreamingText(text: string, idx: number): string {
  return renderMarkdown(text.slice(0, idx)) + '<span class="cursor-blink">|</span>'
}

function startStreaming(text: string) {
  streamingIndex.value = 0
  const chars = text.length
  let i = 0
  const speed = Math.max(15, Math.min(30, Math.floor(8000 / chars))) // 自适应速度

  streamTimer = setInterval(() => {
    i++
    streamingIndex.value = i
    scrollToBottom()
    if (i >= chars) {
      stopStreaming()
      isTyping.value = false
    }
  }, speed)
}

function stopStreaming() {
  if (streamTimer) {
    clearInterval(streamTimer)
    streamTimer = null
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || isTyping.value) return

  chatHistory.value.push({ role: 'user', content: text })
  inputMessage.value = ''
  scrollToBottom()

  isTyping.value = true

  try {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `我是${store.major}专业${gradeLabel.value}的学生，MBTI是${store.mbtiType}。${
          store.selectedJob ? `我正在了解${store.selectedJob.title}岗位。` : ''
        }`,
      },
      ...chatHistory.value.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    // 构建 selectedJob 信息传递给后端
    const selectedJobInfo: SelectedJobInfo | null = store.selectedJob ? {
      id: store.selectedJob.id,
      title: store.selectedJob.title,
      category: store.selectedJob.category,
      department: store.selectedJob.department,
    } : null

    const reply = await sendChatMessage(messages, {
      grade: store.grade,
      major: store.major,
      mbtiType: store.mbtiType,
      interestedFields: store.interestedFields,
    }, selectedJobInfo)

    chatHistory.value.push({ role: 'assistant', content: reply })
    scrollToBottom()

    // 启动打字机流式效果
    startStreaming(reply)
  } catch {
    stopStreaming()
    isTyping.value = false
    chatHistory.value.push({
      role: 'assistant',
      content: '哎呀，网络有点不稳定～不过没关系，你可以继续问我关于岗位和职业规划的问题哦！😊',
    })
    scrollToBottom()
  }
}

function sendQuickQuestion(q: string) {
  inputMessage.value = q
  sendMessage()
}

onMounted(() => {
  scrollToBottom()
  nextTick(() => inputRef.value?.focus())
})

onUnmounted(() => stopStreaming())
watch(chatHistory, scrollToBottom, { deep: true })
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
  max-width: 480px;
  background: #f5f7fa;
}

/* 顶部导航 */
.chat-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e5e6eb;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.nav-back {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--primary);
  cursor: pointer;
  padding: 4px 0;
}

.nav-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.agent-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00A870;
  box-shadow: 0 0 0 3px rgba(0, 168, 112, 0.15);
}

.nav-placeholder {
  width: 40px;
}

/* 岗位上下文 */
.context-bar {
  padding: 8px 16px;
  flex-shrink: 0;
}

.context-inner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f0fe;
  color: #0052D9;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.context-icon {
  font-size: 14px;
}

/* 消息主体 */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-group {
  align-items: flex-end;
}

.msg-avatar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.avatar-goose {
  background: linear-gradient(135deg, #0052D9 0%, #0073e6 100%);
}

.avatar-name {
  font-size: 12px;
  color: #86909c;
  font-weight: 500;
}

/* 消息气泡 */
.msg-bubble {
  max-width: 82%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.msg-bubble.assistant {
  background: white;
  color: var(--text-primary);
  border-top-left-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  margin-left: 40px;
}

.msg-bubble.user {
  background: linear-gradient(135deg, #0052D9 0%, #0073e6 100%);
  color: white;
  border-top-right-radius: 6px;
}

.msg-bubble :deep(p) {
  margin: 0;
}

.msg-bubble :deep(p + p) {
  margin-top: 10px;
}

.msg-bubble :deep(strong) {
  font-weight: 600;
}

/* 光标闪烁 */
:deep(.cursor-blink) {
  animation: blink 1s step-end infinite;
  color: var(--primary);
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 打字动画 */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px !important;
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c0c4cc;
  animation: dotBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
  30% { transform: translateY(-8px); opacity: 1; }
}

/* 快捷问题 */
.quick-bar {
  padding: 0 16px 12px;
  flex-shrink: 0;
}

.quick-scroll {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-chip {
  font-size: 12px;
  padding: 7px 15px;
  border: 1px solid #e5e6eb;
  border-radius: 20px;
  background: white;
  color: #4e5969;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.quick-chip:hover {
  border-color: #0052D9;
  color: #0052D9;
  background: #e8f0fe;
}

/* 输入栏 */
.input-bar {
  padding: 10px 16px 20px;
  flex-shrink: 0;
  background: linear-gradient(to top, #f5f7fa 80%, transparent);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 24px;
  padding: 4px 4px 4px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 2px solid #e5e6eb;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.input-wrapper:focus-within {
  border-color: #0052D9;
  box-shadow: 0 2px 16px rgba(0, 82, 217, 0.12);
}

.text-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1d2129;
  background: transparent;
  padding: 10px 0;
  min-width: 0;
}

.text-input::placeholder {
  color: #c0c4cc;
}

.send-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #e5e6eb;
  color: #c0c4cc;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.send-icon-btn.active {
  background: #0052D9;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.3);
}

.send-icon-btn.active:hover {
  background: #0044b0;
  transform: scale(1.05);
}

.send-icon-btn:disabled {
  cursor: not-allowed;
}
</style>
