FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN npm install

RUN npx turbo run build --filter=super-admin-app

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/super-admin-app ./super-admin-app
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/super-admin-app
EXPOSE 3001

CMD ["npm", "run", "start"]
