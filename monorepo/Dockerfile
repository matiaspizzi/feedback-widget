# Stage 1: Pruning
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @repo/web --docker

# Stage 2: Installer
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable && pnpm install

# Stage 3: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Ejecutamos el build
RUN corepack enable && pnpm turbo build

# Stage 4: Runner (Next.js Web App)
FROM node:20-alpine AS web-runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo lo esencial para el runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Iniciamos la aplicación directamente con Node
CMD ["node", "apps/web/server.js"]

# Stage 5: Runner (SDK CDN)
FROM nginx:stable-alpine AS sdk-cdn
# Based on your image, the built files are in packages/sdk/dist
COPY --from=builder /app/packages/sdk/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]