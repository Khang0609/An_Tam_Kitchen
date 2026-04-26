FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set up the pruning stage
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# Set up the builder stage
FROM base AS builder
WORKDIR /app

# Copy pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Copy source code
COPY --from=pruner /app/out/full/ .
RUN pnpm build --filter=api

# Set up the runner stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
