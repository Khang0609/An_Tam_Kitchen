# Stage 0: Base image
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV TURBO_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Stage 1: Pruner
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .

RUN turbo prune --scope=api --docker

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm build --filter=api

# Stage 3: Runner
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy pruned json and lockfile to install prod deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma Client again in the runner stage
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma

# Copy built code and other necessary folders
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages ./packages 

USER expressjs

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD pnpm --filter @repo/database db:push && node apps/api/dist/index.js || (echo "Failed to start. Check DATABASE_URL and Prisma logs." && exit 1)

