# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos necesarios
COPY package*.json ./
COPY . .

# Instalamos dependencias y construimos
RUN npm install
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiamos solo el resultado del build
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.svelte-kit /app/.svelte-kit
COPY --from=builder /app/node_modules /app/node_modules

# Comando de inicio
CMD ["node", "./build"]
