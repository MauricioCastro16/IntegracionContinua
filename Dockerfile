# Stage 1: Build the SvelteKit application
# Usamos una imagen de Node.js con la versión LTS recomendada y Alpine para un tamaño de imagen más pequeño.
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de definición de paquetes y de bloqueo primero para aprovechar la caché de Docker.
# Esto asegura que las dependencias se instalen solo si package.json o package-lock.json cambian.
COPY package*.json ./

# Instalamos las dependencias de producción y desarrollo
# Usamos --omit=dev para la instalación final, pero para la construcción necesitamos las devDependencies
RUN npm ci

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Construimos la aplicación SvelteKit
# Asegúrate de que tu script "build" en package.json sea `vite build`
RUN npm run build

# Stage 2: Create the production-ready image
# Usamos una imagen Node.js más ligera para la ejecución en producción
FROM node:20-alpine AS production

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo las dependencias de producción desde el stage de construcción
# Esto evita copiar node_modules que no son necesarios en producción y reduce el tamaño de la imagen
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copiamos los archivos de construcción (la aplicación SvelteKit compilada) desde el stage de construcción
COPY --from=build /app/build ./build
COPY --from=build /app/src ./src 
# Si necesitas archivos de la src para la ejecución en server-side rendering (SSR)
COPY --from=build /app/vite.config.ts ./
COPY --from=build /app/svelte.config.js ./

# Opcional: Si tu aplicación SvelteKit usa un adaptador que requiere un servidor Node.js (ej. @sveltejs/adapter-node),
# puedes copiar el archivo de entrada generado por el adaptador.
# Por ejemplo, si usas adapter-node, el archivo de entrada puede ser `index.js` en tu directorio 'build'.
# Verifica la documentación de tu adaptador.
COPY --from=build /app/build/index.js ./build/index.js 
# Ajusta según tu adaptador

# Expone el puerto que la aplicación escuchará (normalmente 3000 para SvelteKit)
EXPOSE 3000

# Comando para iniciar la aplicación
# Asegúrate de que tu script "start" en package.json inicie la aplicación construida.
# Por ejemplo, si usas `@sveltejs/adapter-node`, tu start script podría ser `node build/index.js`.
# Si usas `@sveltejs/adapter-static` o `@sveltejs/adapter-vercel`, `npm run preview` es más para testing local
# de la build estática o serverless. Para Docker, querrás usar un servidor web para la build estática
# (ej. Nginx o serve) o el punto de entrada de tu adaptador Node.js.
CMD ["node", "build/index.js"]