import axios from 'axios';
import simpleGit from 'simple-git';
import dotenv from 'dotenv';
dotenv.config();
import 'dotenv/config';


const JIRA_DOMAIN = 'integracioncontinua.atlassian.net';

const auth = {
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN
};

const client = axios.create({
  baseURL: 'https://integracioncontinua.atlassian.net/rest/api/3',
  auth
});

const git = simpleGit();

const getIssueKeyFromCommit = (msg) => {
  const match = msg.match(/\b[A-Z]+-\d+\b/);
  return match ? match[0] : null;
};

const commitIncludesDone = (msg) => msg.includes('#done');

const getIssueStatus = async (issueKey) => {
  const res = await axios.get(`https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}`, { auth });
  return res.data.fields.status.name;
};

const getTransitions = async (issueKey) => {
  const res = await axios.get(`https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}/transitions`, { auth });
  return res.data.transitions;
};

const transitionIssue = async (issueKey, transitionName) => {
  const transitions = await getTransitions(issueKey);
  const transition = transitions.find((t) => t.name.toLowerCase() === transitionName.toLowerCase());

  if (!transition) {
    console.error(`❌ Transición "${transitionName}" no encontrada`);
    return;
  }

  await axios.post(`https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}/transitions`, {
    transition: { id: transition.id },
  }, { auth });

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

  if (isDone && status !== 'Done') {
    await transitionIssue(issueKey, 'Done');
  } else if (!isDone && status === 'To Do') {
    await transitionIssue(issueKey, 'Doing');
  } else {
    console.log(`ℹ️ No se requiere transición. Estado actual: ${status}`);
  }
};

run().catch(console.error);
