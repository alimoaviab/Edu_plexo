# Multi-stage build for the public landing site (React + Vite).
FROM node:22-slim AS builder

WORKDIR /app

# Cache npm install on its own layer.
COPY package.json ./
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000 \
    NPM_CONFIG_REGISTRY=https://registry.yarnpkg.com/ \
    NODE_OPTIONS="--dns-result-order=ipv4first"
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

# Vite build
ENV NODE_ENV=production

# Default the school SPA URL to the local docker port. Override at
# build time with --build-arg APP_URL=https://app.example.com.
ARG APP_URL=http://localhost:3000
ENV VITE_APP_URL=$APP_URL

RUN npm run build

# ──────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
