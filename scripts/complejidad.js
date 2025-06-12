import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import tscomplex from 'ts-complex';

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');

function getAllFiles(dirPath, arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			getAllFiles(fullPath, arrayOfFiles);
		} else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.svelte')) {
			arrayOfFiles.push(fullPath);
		}
	}
	return arrayOfFiles;
}

const files = getAllFiles(SRC_DIR);
console.log(`📄 Analizando ${files.length} archivos...`);

for (const file of files) {
	const cyclomatic = tscomplex.calculateCyclomaticComplexity(file);
	console.log(`\n📁 ${file}`);
	for (const [fnName, value] of Object.entries(cyclomatic)) {
		console.log(`  🔹 Función: ${fnName} => Complejidad ciclomática: ${value}`);
	}

	const maintainability = tscomplex.calculateMaintainability(file);
	console.log(
		`  📊 Maintainability: avg ${maintainability.averageMaintainability.toFixed(2)} | min ${maintainability.minMaintainability.toFixed(2)}`
	);
}
