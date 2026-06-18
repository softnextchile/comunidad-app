# ===========================================
# Multi-stage build for Nuxt 3
# ===========================================

# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends openssl curl wget && rm -rf /var/lib/apt/lists/*
RUN npm install --ignore-scripts

# Stage 2: Build - Prisma needs OpenSSL for query engine
FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl curl wget && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install curl and wget for healthcheck (Coolify needs wget)
RUN apt-get update && apt-get install -y --no-install-recommends curl wget && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nuxtjs

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# Run migrations (idempotent), seed, then start server

CMD ["sh", "-c", "npx prisma migrate resolve --rolled-back 20240618000000_init || true && npx prisma migrate deploy && npx prisma db seed && node .output/server/index.mjs"]
