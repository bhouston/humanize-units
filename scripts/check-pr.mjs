import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const { pull_request: pr } = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const fail = (message) => {
  console.error(message);
  process.exit(1);
};
if (pr.base.ref !== 'main') {
  fail('Open pull requests against main.');
}
const match = /^(?:feature|fix|docs|chore|refactor|test)\/(\d+)-[a-z0-9-]+$/.exec(pr.head.ref);
if (!match) fail('Use an issue branch such as feature/42-batch-export.');
const closes = new RegExp(`\\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\\s+#${match[1]}\\b`, 'i');
if (!closes.test(pr.body ?? '')) fail(`Include Closes #${match[1]} in the PR description.`);
const result = spawnSync('pnpm', ['exec', 'commitlint'], {
  input: pr.title,
  encoding: 'utf8',
  stdio: ['pipe', 'inherit', 'inherit'],
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
