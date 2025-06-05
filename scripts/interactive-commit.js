import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

const JIRA_DOMAIN = 'integracioncontinua.atlassian.net';
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const PROJECT_KEY = 'SCRUM'
const STATUS_IDS = ['10000', '10001'];

const git = simpleGit();

const client = axios.create({
  baseURL: `https://${JIRA_DOMAIN}/rest/api/3`,
  auth: {
    username: JIRA_USER,
    password: JIRA_TOKEN
  }
});

const getIssues = async () => {
  try {
    const res = await client.get(`/search`, {
    params: {
        jql: `project=${PROJECT_KEY} AND status in (${STATUS_IDS.join(',')}) ORDER BY created DESC`,
        maxResults: 6
    }
    });

    console.log('✅ Consulta exitosa a Jira. Issues encontrados:');
    return res
  } catch (err) {
    console.error('❌ Error al consultar Jira:', err.response?.data || err.message);
  }
};

const run = async () => {
  const res = await getIssues();
  const issues = res.data.issues;
  if (!Array.isArray(issues)) {
    console.error('❌ No se pudieron obtener los issues desde Jira.');
    process.exit(1);
    }

  const { title, description, issueKey, done } = await inquirer.prompt([
    { name: 'title', message: 'Título del commit:' },
    { name: 'description', message: 'Descripción (opcional):' },
    {
        type: 'list',
        name: 'issueKey',
        message: 'Seleccioná la tarjeta relacionada:',
        choices: issues.map(issue => ({
        name: `${issue.key} - ${issue.fields.summary}`,
        value: issue.key
        }))
    },
    { type: 'confirm', name: 'done', message: '¿Está terminada la tarea?', default: false }
    ]);

    const fullDescription = `${description}\n\n${issueKey}${done ? ' #done' : ''}`.trim();

  await git.add('./*'); // Asegura que haya algo para comittear
  const status = await git.status();

  if (status.staged.length === 0) {
    console.log(chalk.yellow('⚠️ No hay archivos staged para commitear.'));
    return;
  }
  
  await git.commit(title, undefined, { '--message': fullDescription });

  console.log(chalk.green(`✅ Commit creado con mensaje:`));
  console.log(`${chalk.blue(title)}\n${fullDescription}`);
};

run().catch((err) => {
  if (err.response) {
    console.error('❌ Error al hacer el commit:', err.response.status, err.response.data);
  } else {
    console.error('❌ Error al hacer el commit:', err.message || err);
  }
});
