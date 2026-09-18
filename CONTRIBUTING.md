# Contributing

This is the shared workflow standard for people, Claude, and Codex. Agent entry files point here; keep the rules in this file.

## Issue, branch, commit, pull request

1. Before starting a feature or fix, open or reuse a GitHub issue. Include a description (what and why), acceptance criteria, and constraints, following the **Feature or fix** issue template. Agents should use `gh issue create` with the same sections.
2. Fetch origin and create a branch from `origin/main`. Branch names are not restricted to any naming convention. Never commit directly to `main`.
3. Implement the issue and update tests and documentation as needed. Every commit must use Conventional Commits: `type(scope): description`, with an optional scope. Use `feat` for a minor release, `fix` for a patch, and `!` or a `BREAKING CHANGE:` footer for a major release. `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, and `revert` are also valid; the conventionalcommits preset treats `perf` as a patch. Other non-breaking maintenance commits do not release. Reference the issue in the commit body when useful.
4. Run `pnpm check`. Push the branch and open a PR against **main** with a Conventional Commit title and `Closes #<issue-number>` in the description. Describe resulting behavior and validation. CI validates the title and issue reference. Husky validates local commit messages. Hooks can be bypassed, so commit messages must always be reviewed.
5. PRs are merged into `main` with merge commits; do not squash or rebase-merge. Every commit must already carry a Conventional Commit message and any breaking-change footer, since Semantic Release reads the merged commits. Merging into `main` closes the linked issue.
6. When ready to release, run `gh workflow run release.yml --ref main`. The `Release` workflow only accepts manual dispatch on `main`; it repeats quality checks, then publishes through npm trusted publishing if releasable commits exist since the last release. Merging PRs never publishes by itself. Add `-f dry_run=true` to preview without publishing.

## Local setup and checks

Use the development Node version in `.nvmrc` and the pnpm version in `package.json` (currently Node 26 and pnpm 11). The package runtime engine declaration is separate from the development toolchain.

```sh
pnpm install
pnpm check
```

`pnpm check` checks formatting and lint, cleans and builds TypeScript declarations, runs tests with **100% statements, branches, functions, and lines coverage**, enforces a **2 kB compressed bundle limit** with size-limit, and audits all dependencies for high or critical vulnerabilities. Lower-severity audit findings remain visible. Change thresholds only with a justified PR. `pnpm format`, `pnpm lint:fix`, and `pnpm test:watch` support development.

CI reports size-limit results in its logs and uploads coverage as an artifact. Codecov receives `coverage/lcov.info`; configure the `CODECOV_TOKEN` Actions secret for badge updates. Codecov upload failures are nonblocking; the local coverage gate is mandatory.

## Release setup for maintainers

On npm, open **humanize-units → Settings → Trusted publishing**, choose GitHub Actions, and enter:

| Field                | Value                                             |
| -------------------- | ------------------------------------------------- |
| Organization or user | `bhouston`                                        |
| Repository           | `humanize-units`                                  |
| Workflow filename    | `release.yml`                                     |
| Environment          | Leave blank (the job does not use an environment) |

Configure this before dispatching the release workflow. Publishing uses GitHub-hosted runners with `id-token: write`, the pinned pnpm CLI (via `@anolilab/semantic-release-pnpm`, which runs `pnpm publish` under the hood), and no `NPM_TOKEN` or `NODE_AUTH_TOKEN`. Do not add `registry-url` to setup-node. See the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) and [Semantic Release GitHub Actions guide](https://semantic-release.org/recipes/ci-configurations/github-actions/).

The existing npm release `2.0.4` records git commit `e34af8c44669600a5c33a9fdcaf0c6a4b4c1830b`. The missing `v2.0.4` tag has been restored at that exact commit. The release workflow verifies a `v<version>` tag matching the current `package.json` version exists before publishing (dynamically, not a hardcoded version), to catch this class of missing-tag problem again. Never move existing release tags.

Semantic Release determines the version from tags and commits, updates the package version in the publish workspace, generates a per-release `CHANGELOG.md`, and publishes to npm with provenance via `pnpm publish` (through `@anolilab/semantic-release-pnpm`) plus a GitHub Release containing release notes, the changelog, and the package archive. GitHub Releases are the cumulative changelog. The repository's `package.json` version stays at the bootstrap value; it is not the published version source of truth. Release automation does not push version/changelog commits to protected branches. Never manually bump versions or use the removed manual publish script.

Enable branch protection/rulesets for `main`: require PRs, require the `ci` check, and block direct pushes, force pushes, and deletion. The release workflow only runs on manual dispatch, so its `checks / ci` status never gates ordinary PRs. Enable merge commits only; disable squash and rebase merging. These GitHub settings are separate from the workflow files.

A dry run (`pnpm release --dry-run`) needs GitHub authentication and must run on `main` to produce a meaningful release preview; on a feature branch it will skip releasing. Full OIDC verification requires a GitHub Actions run after npm trust is configured. Setup does not publish anything.

## Rollout to other repositories

Validate this pilot's issue → branch → PR flow and first trusted release before extracting a template repository. Copy `CONTRIBUTING.md`, the agent pointers, commitlint configuration, Husky commit-msg hook, issue/PR templates, security policy, workflow files, PR validation script, and release configuration. Merge package scripts/dependencies and coverage/size settings into each target rather than overwriting its package manifest. Adapt repository URLs, npm package, release baseline, Node/pnpm versions, thresholds, and security contact; preserve each repository's license. A template repository and copy script should follow the successful pilot, not precede it.
