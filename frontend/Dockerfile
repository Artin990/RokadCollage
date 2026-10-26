# ==========================================
# Base Image
# ==========================================
FROM node:22-alpine AS base

# Install libc6-compat for native optimizations
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# ==========================================
# Development Target (Hot Reload via next dev)
# ==========================================
FROM base AS development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Install all dependencies
RUN npm install

# Copy application source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# ==========================================
# Builder Target (Build Standalone Next.js)
# ==========================================
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies required for building the app
RUN npm install --include=dev

# Copy source code
COPY . .

# Build production bundle with standalone output
RUN npm run build

# ==========================================
# Production Target (Multi-Stage with Nginx)
# ==========================================
FROM node:22-alpine AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="127.0.0.1"

# Install Nginx and curl for healthchecks
RUN apk add --no-cache nginx curl

WORKDIR /app

# Copy standalone output from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy container entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 --start-period=10s \
  CMD curl -f http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
