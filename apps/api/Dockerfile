# Stage 0: Base image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Stage 1: Pruner - Trích xuất các package cần thiết cho 'api'
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
# Tạo ra một thư mục 'out' chỉ chứa các file cần thiết cho app 'api'
RUN turbo prune api --docker

# Stage 2: Builder - Cài đặt dependencies và build
FROM base AS builder
WORKDIR /app

# Copy các file package.json và lockfile đã được lọc từ stage pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Cài đặt dependencies (tận dụng cache nếu lockfile không đổi)
RUN pnpm install --frozen-lockfile

# Copy toàn bộ code đã được lọc và build
COPY --from=pruner /app/out/full/ .
# Lưu ý: Cần generate prisma client trước khi build nếu app phụ thuộc vào nó
RUN pnpm build --filter=api

# Stage 3: Runner - Chạy ứng dụng
FROM base AS runner
WORKDIR /app

# Tạo user để không chạy app bằng quyền root (bảo mật)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Copy kết quả build và node_modules cần thiết
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
# Copy các package nội bộ nếu có
COPY --from=builder /app/packages ./packages 

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
