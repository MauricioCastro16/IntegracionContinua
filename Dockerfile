# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Producción
FROM node:20

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.svelte-kit /app/.svelte-kit
COPY --from=builder /app/node_modules /app/node_modules

CMD ["node", "./build"]
