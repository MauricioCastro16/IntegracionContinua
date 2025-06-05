import axios from 'axios';
import simpleGit from 'simple-git';
import dotenv from 'dotenv';
dotenv.config();

const JIRA_DOMAIN = 'integracioncontinua.atlassian.net';

const client = axios.create({
  baseURL: `https://${JIRA_DOMAIN}/rest/api/3`,
  auth: {
    username: process.env.JIRA_USER,
    password: process.env.JIRA_TOKEN
  }
});

const git = simpleGit();

const getIssueKeyFromCommit = (msg) => {
  const match = msg.match(/\b[A-Z]+-\d+\b/);
  return match ? match[0] : null;
};

const commitIncludesDone = (msg) => msg.toLowerCase().includes('#done');

const getIssueStatus = async (issueKey) => {
  const res = await client.get(`/issue/${issueKey}`);
  return res.data.fields.status.name;
};

const getTransitions = async (issueKey) => {
  const res = await client.get(`/issue/${issueKey}/transitions`);
  return res.data.transitions;
};

const transitionIssue = async (issueKey, transitionName) => {
  const transitions = await getTransitions(issueKey);
  const transition = transitions.find((t) =>
    t.name.toLowerCase() === transitionName.toLowerCase()
  );

  if (!transition) {
    console.error(`❌ Transición "${transitionName}" no encontrada`);
    return;
  }

  await client.post(`/issue/${issueKey}/transitions`, {
    transition: { id: transition.id }
  });

  console.log(`✅ ${issueKey} movida a "${transitionName}"`);
};

const run = async () => {
  // Obtené todos los commits no pusheados (o si estás en Jenkins: entre el último push y HEAD)
  const log = await git.log();
  const commits = log.all;

  const processed = new Set();

  for (const commit of commits) {
    const msg = `${commit.message}\n${commit.body}`;
    const keys = getIssueKeysFromCommit(msg);

    for (const key of keys) {
      if (processed.has(key)) continue;
      processed.add(key);

      try {
        const status = await getIssueStatus(key);
        const isDone = commitIncludesDone(msg);

        if (isDone && status !== 'Listo') {
          await transitionIssue(key, 'Listo');
        } else if (!isDone && status === 'Tareas por hacer') {
          await transitionIssue(key, 'En curso');
        } else {
          console.log(`ℹ️ ${key}: No se requiere transición (estado actual: ${status})`);
        }
      } catch (e) {
        console.error(`❌ Error al procesar ${key}:`, e.response?.data || e.message);
      }
    }
  }

  if (processed.size === 0) {
    console.log('⚠️ No se encontraron claves Jira en los commits recientes.');
  }
};

run().catch(console.error);
