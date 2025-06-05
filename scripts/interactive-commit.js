import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

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
  const toDoIssues = await fetchIssuesByStatus('10000', 3);   // Tareas por hacer
  const doingIssues = await fetchIssuesByStatus('10001', 3);  // En curso

  return {
    'Tareas por hacer': toDoIssues,
    'En curso': doingIssues
  };
};

const run = async () => {
  await git.add('./*');
  const status = await git.status();

  if (status.staged.length === 0) {
    console.log(chalk.yellow('⚠️ No hay archivos staged para commitear.'));
    return;
  }

  const grouped = await getGroupedIssues();
  console.log('✅ Consulta exitosa a Jira. Issues encontrados.');

  const issueChoices = [];

  Object.entries(grouped).forEach(([section, issues]) => {
    if (issues.length > 0) {
      issueChoices.push(new inquirer.Separator(chalk.bold(section)));
      issues.forEach(issue => {
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
    { name: 'title', message: 'Título del commit:' },
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