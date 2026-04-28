# Stage 0: Base image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Stage 1: Pruner - Trích xuất các package cần thiết cho 'api'
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
# Copy toàn bộ vào để turbo có đủ ngữ cảnh monorepo
COPY . .
# Debug: Kiểm tra xem các file quan trọng có tồn tại không
RUN ls -la pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json

# Chạy prune cho package tên là 'api'
RUN turbo prune api --docker

# Stage 2: Builder - Cài đặt dependencies và build
FROM base AS builder
WORKDIR /app

# Copy các file package.json và lockfile đã được lọc từ stage pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Cài đặt dependencies
RUN pnpm install --frozen-lockfile

# Copy toàn bộ code đã được lọc và build
COPY --from=pruner /app/out/full/ .

# Nếu có Prisma, cần generate client trước khi build
# RUN pnpm --filter @repo/database build 

RUN pnpm build --filter=api

# Stage 3: Runner - Chạy ứng dụng
FROM base AS runner
WORKDIR /app

# Bảo mật: không chạy quyền root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy kết quả build
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages 

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
