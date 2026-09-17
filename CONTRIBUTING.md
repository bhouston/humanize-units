# Contributing

This is the shared workflow standard for people, Claude, and Codex. Agent entry files point here; keep the rules in this file.

## Issue, branch, commit, pull request

1. Before starting a feature or fix, open or reuse a GitHub issue. Include a description (what and why), acceptance criteria, and constraints, following the **Feature or fix** issue template. Agents should use `gh issue create` with the same sections.
2. Fetch origin and create a branch from `origin/dev`: `<type>/<issue-number>-<short-description>`, for example `feature/42-batch-export`. Allowed branch types are `feature`, `fix`, `docs`, `chore`, `refactor`, and `test`. Never commit directly to `main` or `dev`.
3. Implement the issue and update tests and documentation as needed. Every commit must use Conventional Commits: `type(scope): description`, with an optional scope. Use `feat` for a minor release, `fix` for a patch, and `!` or a `BREAKING CHANGE:` footer for a major release. `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, and `revert` are also valid; the conventionalcommits preset treats `perf` as a patch. Other non-breaking maintenance commits do not release. Reference the issue in the commit body when useful.
4. Run `pnpm check`. Push the branch and open a PR against **dev** with a Conventional Commit title and `Closes #<issue-number>` in the description. Describe resulting behavior and validation. CI validates the title, branch name, and matching issue reference. Husky validates local commit messages. Hooks can be bypassed, so the final squash message must always be reviewed.
5. Squash feature PRs into `dev`, preserving the Conventional Commit title and any breaking-change footer in the squash message. CI checks the title; reviewers must preserve breaking-change details from the body. GitHub only auto-closes linked issues when changes reach the default branch (`main`); merging into `dev` alone does not close them.
6. When ready to release, open a PR from this repository's **dev** branch into **main**, titled `chore(release): promote dev to main`. Use a **merge commit**, never squash or rebase this promotion: Semantic Release needs the original feature commits. The `Release` workflow runs only on pushes to `main`, repeats quality checks, then publishes if releasable commits exist. Sync `main` back into `dev` by merging it after release.

The initial workflow PR branches from current `main` because `dev` was 26 commits behind. Merge that bootstrap PR into `dev` with a merge commit to preserve existing history; subsequent feature PRs follow the squash policy above.

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

Configure this before promoting the setup to `main`. Publishing uses GitHub-hosted runners with `id-token: write`, Node 26's compatible npm CLI, and no `NPM_TOKEN` or `NODE_AUTH_TOKEN`. Do not add `registry-url` to setup-node. See the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) and [Semantic Release GitHub Actions guide](https://semantic-release.org/recipes/ci-configurations/github-actions/).

The existing npm release `2.0.4` records git commit `e34af8c44669600a5c33a9fdcaf0c6a4b4c1830b`. The missing `v2.0.4` tag has been restored at that exact commit. The workflow fails if the baseline tag is missing. Never move existing release tags.

Semantic Release determines the version from tags and commits, updates the package version in the publish workspace, generates a per-release `CHANGELOG.md`, and publishes npm with provenance plus a GitHub Release containing release notes, the changelog, and the package archive. GitHub Releases are the cumulative changelog. The repository's `package.json` version stays at the bootstrap value; it is not the published version source of truth. Release automation does not push version/changelog commits to protected branches. Never manually bump versions or use the removed manual publish script.

Enable branch protection/rulesets for `dev` and `main`: require PRs, require the `ci` check, and block direct pushes, force pushes, and deletion. Do not require the release workflow's `checks / ci` status for PRs: it runs only after a push to `main`. Keep squash and merge commits enabled, disable rebase merging, and use PR titles for squash messages. These GitHub settings are separate from the workflow files. Only `dev` may be the source of a PR into `main`.

A dry run (`pnpm release --dry-run`) needs GitHub authentication and must run on `main` to produce a meaningful release preview; on a feature branch it will skip releasing. Full OIDC verification requires a GitHub Actions run after npm trust is configured. Setup does not publish anything.

## Rollout to other repositories

Validate this pilot's issue → branch → PR flow and first trusted release before extracting a template repository. Copy `CONTRIBUTING.md`, the agent pointers, commitlint configuration, Husky commit-msg hook, issue/PR templates, security policy, workflow files, PR validation script, and release configuration. Merge package scripts/dependencies and coverage/size settings into each target rather than overwriting its package manifest. Adapt repository URLs, npm package, release baseline, Node/pnpm versions, thresholds, and security contact; preserve each repository's license. A template repository and copy script should follow the successful pilot, not precede it.
