FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY packages/providers/package.json packages/providers/
RUN npm install --workspace=@pms/api --workspace=@pms/providers || npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build || true

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/server.js"]
