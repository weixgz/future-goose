<template>
  <div class="page-container home-page">
    <div class="home-content">
      <!-- Hero -->
      <div class="hero-section">
        <div class="hero-icon">🐧</div>
        <h1 class="hero-title">未来鹅</h1>
        <p class="hero-subtitle">大学生职业成长 AI 陪伴体</p>
        <p class="hero-desc">迷茫是成长的开始<br />让我陪你找到方向</p>
      </div>

      <!-- Features -->
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">📊</span>
          <div>
            <div class="feature-title">性格测评</div>
            <div class="feature-desc">12题MBTI快速了解自己</div>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <div>
            <div class="feature-title">岗位推荐</div>
            <div class="feature-desc">专业匹配 + 性格泛化推荐</div>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📋</span>
          <div>
            <div class="feature-title">JD拆解</div>
            <div class="feature-desc">岗位要求清单化可视化</div>
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💬</span>
          <div>
            <div class="feature-title">AI学姐陪伴</div>
            <div class="feature-desc">1v1职业成长对话</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">10,000+</span>
          <span class="stat-label">同学已体验</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">5分钟</span>
          <span class="stat-label">完成测评</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">15+</span>
          <span class="stat-label">腾讯真实岗位</span>
        </div>
      </div>

      <!-- CTA -->
      <button class="btn-primary btn-start" @click="startJourney">
        ✨ 开始探索
      </button>

      <p class="bottom-note">🐧 腾讯雇主品牌 · 由AI驱动的职业成长陪伴</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userProfile'

const router = useRouter()
const store = useUserStore()

function startJourney() {
  store.reset()
  router.push('/profile')
}
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-content {
  width: 100%;
}

.hero-section {
  margin-bottom: 40px;
}

.hero-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #0052D9 0%, #0073e6 50%, #00a0e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 15px;
  color: var(--text-tertiary);
  line-height: 1.8;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: var(--radius);
  padding: 14px;
  text-align: left;
  box-shadow: var(--shadow-sm);
}

.feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.feature-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 16px;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

.btn-start {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  margin-bottom: 20px;
}

.bottom-note {
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>
