FROM node:22-alpine AS builder
WORKDIR /app

# Install turbo and other global dependencies if needed
RUN npm install -g turbo

# Copy all files for monorepo analysis
COPY . .

# Install dependencies for the whole monorepo
RUN npm install

# Build the school-app and its dependencies
RUN npx turbo run build --filter=school-app

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/school-app ./school-app
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/school-app
EXPOSE 3000

CMD ["npm", "run", "start"]
