import { execFileSync } from 'node:child_process';

// Run after semantic-release-pnpm updates the publish workspace version.
// Its tarballDir implementation passes a positional directory that pnpm 12 rejects.
export function prepare(_config, { cwd, env }) {
  execFileSync('pnpm', ['pack', '--pack-destination', 'release'], { cwd, env, stdio: 'inherit' });
}
