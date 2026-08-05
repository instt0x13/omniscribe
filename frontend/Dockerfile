# 1. Зависимости (базовый слой)
FROM node:22-alpine AS base
WORKDIR /app
COPY config/package*.json ./
RUN npm ci

# 2. DEV: Режим разработки (Node.js + HMR)
FROM base AS development
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# 3. PROD (Сборка): Компиляция статики
FROM base AS builder
COPY . .
RUN npm run build

# 4. PROD (Финал): Раздача статики через Nginx
FROM nginx:alpine-slim AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]