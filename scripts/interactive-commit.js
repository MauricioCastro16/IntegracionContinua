import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { exec } from 'child_process'; // Asegúrate de importar exec
import util from 'util'; // Asegúrate de importar util
dotenv.config();

// Convertimos exec en una función que devuelve una promesa
const execPromise = util.promisify(exec);

const JIRA_DOMAIN = 'integracioncontinua.atlassian.net';
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const PROJECT_KEY = 'SCRUM';

const git = simpleGit();

const client = axios.create({
	baseURL: `https://${JIRA_DOMAIN}/rest/api/3`,
	auth: {
		username: JIRA_USER,
		password: JIRA_TOKEN
	}
});

const fetchIssuesByStatus = async (statusId, limit = 3) => {
	const res = await client.get(`/search`, {
		params: {
			jql: `project=${PROJECT_KEY} AND status = ${statusId} ORDER BY created DESC`,
			maxResults: limit
		}
	});
	return res.data.issues || [];
};

const getGroupedIssues = async () => {
	const toDoIssues = await fetchIssuesByStatus('10000', 3); // Tareas por hacer
	const doingIssues = await fetchIssuesByStatus('10001', 3); // En curso

	return {
		'Tareas por hacer': toDoIssues,
		'En curso': doingIssues
	};
};

// Función para ejecutar comandos y capturar su salida (stdout y stderr)
const runCommand = async (command) => {
	try {
		const { stdout, stderr } = await execPromise(command);
		return { stdout, stderr, success: true };
	} catch (error) {
		// Si ocurre un error, capturamos la salida del error
		return { stdout: error.stdout, stderr: error.stderr, success: false };
	}
};

const run = async () => {
	await git.add('./*');
	const status = await git.status();

	if (status.staged.length === 0) {
		console.log(chalk.yellow('⚠️ No hay archivos staged para commitear.'));
		return;
	}

	// Ejecutamos `npm run format` y `npm run lint` de forma secuencial
	const formatResult = await runCommand('npm run format');
	if (!formatResult.success) {
		console.log(chalk.red('❌ Error en `npm run format`:'));
		console.log(formatResult.stderr || formatResult.stdout); // Mostramos el error detallado
		return; // Si format falla, detenemos el flujo
	}

	const lintResult = await runCommand('npm run lint');
	if (!lintResult.success) {
		console.log(chalk.red('❌ Error en `npm run lint`:'));
		console.log(lintResult.stderr || lintResult.stdout); // Mostramos el error detallado
		return; // Si lint falla, detenemos el flujo
	}

	// Mientras tanto, realizamos la conexión con Jira en paralelo
	const jiraFetchPromise = getGroupedIssues();

	console.log('✅ Esperando la respuesta de Jira...');

	const grouped = await jiraFetchPromise; // Esperamos la respuesta de Jira
	console.log('✅ Consulta exitosa a Jira. Issues encontrados.');

	const issueChoices = [];

	Object.entries(grouped).forEach(([section, issues]) => {
		if (issues.length > 0) {
			issueChoices.push(new inquirer.Separator(chalk.bold(section)));
			issues.forEach((issue) => {
				issueChoices.push({
					name: `${issue.key} - ${issue.fields.summary}`,
					value: issue.key
				});
			});
		}
	});

	issueChoices.push(
		new inquirer.Separator(chalk.gray('Otros')),
		{ name: 'Ingresar tarjeta manualmente', value: '__manual__' },
		{ name: 'Es un bugfix', value: '__bugfix__' },
		{ name: 'No hay tarjeta relacionada', value: '__none__' }
	);

	const answers = await inquirer.prompt([
		{
			name: 'title',
			message: 'Título del commit:',
			validate: function (input) {
				if (input.trim() === '') {
					return 'El título no puede estar vacío. Por favor ingresa un título válido.';
				}
				return true; // Si la entrada es válida, continúa
			}
		},
		{ name: 'description', message: 'Descripción (opcional):' },
		{
			type: 'rawlist',
			name: 'issueKey',
			message: 'Seleccioná la tarjeta relacionada:',
			choices: issueChoices
		},
		{
			type: 'confirm',
			name: 'done',
			message: '¿Está terminada la tarea?',
			default: false,
			when: (answers) => !['__bugfix__', '__none__'].includes(answers.issueKey)
		}
	]);

	let finalIssueKey = answers.issueKey;
	let finalDone = answers.done;

	if (answers.issueKey === '__manual__') {
		const { customKey } = await inquirer.prompt([
			{ name: 'customKey', message: 'Ingresá el código de la tarjeta Jira:' }
		]);
		finalIssueKey = customKey;
	} else if (answers.issueKey === '__bugfix__') {
		finalIssueKey = '#bugfix';
		finalDone = false;
	} else if (answers.issueKey === '__none__') {
		finalIssueKey = '';
		finalDone = false;
	}

	const fullDescription = [answers.description, finalIssueKey, finalDone ? '#done' : '']
		.filter(Boolean)
		.join('\n\n')
		.trim();

	await git.commit(answers.title, undefined, { '--message': fullDescription });

	console.log(chalk.green(`✅ Commit creado con mensaje:`));
	console.log(`${chalk.blue(answers.title)}\n${fullDescription}`);
};

run().catch((err) => {
	if (err.response) {
		console.error('❌ Error:', err.response.status, err.response.data);
	} else {
		console.error('❌ Error:', err.message || err);
	}
});
