# Dockerfile cho API service - đặt ở thư mục gốc monorepo
# để đảm bảo Docker build context luôn là toàn bộ workspace

# Stage 0: Base image
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV TURBO_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Stage 1: Pruner - Trích xuất các package cần thiết cho 'api'
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Stage 2: Builder - Cài đặt dependencies và build
FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm build --filter=api

# Stage 3: Runner - Chạy ứng dụng
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
