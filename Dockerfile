# 多阶段构建：减小最终镜像体积
FROM node:20-alpine AS builder

WORKDIR /app

# 1. 先复制依赖描述文件，利用 Docker 缓存层
COPY package*.json ./
RUN npm ci

# 2. 复制全部源码并构建
COPY . .
RUN npx prisma generate
RUN npm run build

# ============================================
# 运行阶段：仅包含生产所需文件
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 复制构建产物与依赖
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 安装生产依赖并重新生成 Prisma Client（确保运行时可用）
RUN npm ci --omit=dev && npx prisma generate

# 创建数据目录（用于 Docker Compose 卷挂载）
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
