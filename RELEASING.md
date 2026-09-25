# Releases

## Running a release

Releases are never triggered by pushes or merges to `main`. When ready to publish, the maintainer dispatches the workflow:

```sh
gh workflow run release.yml --ref main
```

Add `-f dry_run=true` to preview versioning, the changelog, and the release without publishing or tagging. The workflow only accepts manual dispatch on `main`; it repeats the quality checks, then publishes through npm trusted publishing if releasable commits exist since the last release. A dry run needs GitHub authentication and must run on `main` to produce a meaningful preview; on a feature branch it will skip releasing.

## One-time activation

The workflow is installed in `.github/workflows/release.yml`.

1. On npmjs.com, open **humanize-units → Settings → Trusted publishing**, choose GitHub Actions, and enter:

   | Field                | Value                                             |
   | -------------------- | ------------------------------------------------- |
   | Organization or user | `bhouston`                                        |
   | Repository           | `humanize-units`                                  |
   | Workflow filename    | `release.yml`                                     |
   | Environment          | Leave blank (the job does not use an environment) |

   This is a package setting, not a repository secret. Publishing uses GitHub-hosted runners with `id-token: write`, the pinned pnpm CLI (via `@anolilab/semantic-release-pnpm`, which runs `pnpm publish` under the hood), and no `NPM_TOKEN` or `NODE_AUTH_TOKEN`. Do not add `registry-url` to setup-node. See the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) and [Semantic Release GitHub Actions guide](https://semantic-release.org/recipes/ci-configurations/github-actions/).

2. The existing npm release `2.0.4` records git commit `e34af8c44669600a5c33a9fdcaf0c6a4b4c1830b`; the `v2.0.4` tag is pinned at that exact commit. The release workflow verifies a `v<version>` tag matching the current `package.json` version exists before publishing (dynamically, not a hardcoded version), to catch this class of missing-tag problem again. Never move existing release tags.
3. Enable branch protection/rulesets for `main`: require PRs, require the `ci` check, and block direct pushes, force pushes, and deletion. The release workflow only runs on manual dispatch, so its status never gates ordinary PRs. Enable merge commits only; disable squash and rebase merging.
4. Configure the npm trusted publisher before dispatching the release workflow.
5. Configure the repository `CODECOV_TOKEN` secret from Codecov for reliable coverage publishing; coverage thresholds themselves do not depend on Codecov.

## Versioning and artifacts

Semantic Release determines the version from tags and Conventional Commits since the last release, updates the package version in the publish workspace, generates a per-release `CHANGELOG.md`, and publishes to npm with provenance via `pnpm publish` (through `@anolilab/semantic-release-pnpm`) plus a GitHub Release containing release notes, the changelog, and the package archive. GitHub Releases are the cumulative changelog. The repository's `package.json` version stays at the bootstrap value; it is not the published version source of truth. Release automation does not push version/changelog commits to protected branches.

## Development thresholds

`pnpm check` (also run in CI) enforces:

- **100%** statements, branches, functions, and lines coverage.
- A **2 kB** compressed bundle limit via size-limit (`pnpm size`).
- A dependency audit at `high`/`critical` severity (`pnpm audit --audit-level=high`); lower-severity findings remain visible but non-blocking.

Change any of these thresholds only with a justified explanation in the PR.
