# ==================== 阶段1: 前端构建 ====================
FROM node:22-alpine AS builder

WORKDIR /app

# 复制项目根配置文件
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./

# 安装根依赖 (Vue, Vite, TDesign 等)
RUN npm install

# 复制前端源码
COPY src/ ./src

# 构建前端生产包（忽略 vue-tsc 类型检查，只构建）
RUN npx vite build

# ==================== 阶段2: 生产运行 ====================
FROM node:22-alpine

WORKDIR /app

# 复制服务端 package.json 并安装依赖
COPY server/package.json ./server/
RUN cd server && npm install

# 复制服务端源码
COPY server/server.ts ./server/
COPY server/tsconfig.json ./server/

# 从构建阶段复制前端 dist
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3001

# 启动服务端 (通过 tsx 运行 TypeScript)
CMD ["npx", "tsx", "server/server.ts"]
