import { readFileSync, writeFileSync } from 'fs';
import { config, configDotenv } from 'dotenv';
config(); // Cargar las variables de entorno existentes desde el .env

// Leer el parámetro pasado en la línea de comandos
const args = process.argv.slice(2);
const environment = args[0] || 'local'; // 'local' o 'render'
console.log(`Configurando BASE_URL_E2E para el entorno: ${environment}`);
let baseURLE2E;

// Configurar la URL dependiendo del parámetro
if (environment === 'render') {
	// URL de Render (sustituye esto con la URL real de tu despliegue en Render)
	baseURLE2E = 'https://integracioncontinua-opr1.onrender.com'; // Sustituir con tu URL de Render
} else {
	// Usar localhost para pruebas locales
	baseURLE2E = 'http://localhost:3005'; // Sustituir con tu URL local
}

// Leer el archivo .env existente
const envConfig = readFileSync('.env', 'utf8');

// Agregar o actualizar la variable BASE_URL en el archivo .env
let newEnvConfig;
if (envConfig.includes('BASE_URL_E2E=')) {
	// Si ya existe BASE_URL, lo reemplazamos
	newEnvConfig = envConfig.replace(/BASE_URL_E2E=.*/, `BASE_URL_E2E=${baseURLE2E}`);
} else {
	// Si no existe BASE_URL, lo agregamos al final del archivo
	newEnvConfig = `${envConfig}\BASE_URL_E2E=${baseURLE2E}`; // eslint-disable-line
}

// Escribir de nuevo el archivo .env sin eliminar el resto de las variables
writeFileSync('.env', newEnvConfig, 'utf8');
configDotenv();
console.log(`Configuración de BASE_URL_E2E actualizada a: ${baseURLE2E}`);
