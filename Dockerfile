# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Ejecuta la aplicación
CMD ["npm", "run", "start"]

# Expone el puerto de la aplicación
EXPOSE 3000