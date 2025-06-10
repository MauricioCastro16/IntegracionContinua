# Stage 1: Build the SvelteKit application
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de definición de paquetes primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos todas las dependencias, incluidas las de desarrollo
RUN npm ci  # Usamos `npm ci` para instalaciones limpias (ideal para CI/CD)

# Copiamos el resto de los archivos del proyecto (src, tests, config, etc.)
COPY . .

# Ejecutamos el comando para sincronizar SvelteKit antes de la construcción
RUN npx svelte-kit sync

# Construimos la aplicación SvelteKit (esto genera la salida en la carpeta build)
RUN npm run build

# Stage 2: Crear la imagen lista para producción
FROM node:20-alpine AS production

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo las dependencias de producción desde el stage de construcción
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev  # Instalamos solo las dependencias de producción

# Copiar los archivos de construcción desde el stage de construcción
COPY --from=build /app/build ./build
COPY --from=build /app/src ./src
COPY --from=build /app/vite.config.ts ./vite.config.ts
COPY --from=build /app/svelte.config.js ./svelte.config.js

# Copiar el archivo de entrada del adaptador (si corresponde)
COPY --from=build /app/build/index.js ./build/index.js

# Exponer el puerto 3000 para la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["node", "build/index.js"]
