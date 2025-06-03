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
  const log = await git.log({ maxCount: 1 });
  const msg = `${log.latest.message}\n${log.latest.body}`;
  const issueKey = getIssueKeyFromCommit(msg);

  if (!issueKey) {
    console.log('⚠️ No se encontró código de tarjeta en el commit');
    return;
  }

  const status = await getIssueStatus(issueKey);
  const isDone = commitIncludesDone(msg);

  if (isDone && status !== 'Listo') {
    await transitionIssue(issueKey, 'Listo');
  } else if (!isDone && status === 'Por hacer') {
    await transitionIssue(issueKey, 'En curso');
  } else {
    console.log(`ℹ️ No se requiere transición. Estado actual: ${status}`);
  }
};

run().catch(console.error);
