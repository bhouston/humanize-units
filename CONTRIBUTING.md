## Contributing Guidelines

Thank you for your interest in improving `humanize-units`! Follow these guidelines to keep contributions easy to review and ship.

### Getting Started

- Use Node.js 18 or newer and `pnpm` (see `package.json` for the expected version).
- Install dependencies with:
  ```bash
  pnpm install
  ```

### Development Workflow

- Format and lint your code before opening a pull request:
  ```bash
  pnpm format
  pnpm lint
  ```
- Run tests to ensure nothing regresses:
  ```bash
  pnpm test
  ```
- Build locally to verify the published output:
  ```bash
  pnpm build
  ```

### Pull Requests

- Create feature branches from `main`.
- Keep commits focused and include helpful commit messages.
- Update documentation and tests alongside code changes when relevant.
- Describe the change and any testing notes in the PR description.

### Reporting Issues

- Provide clear reproduction steps, expected vs. actual behavior, and environment details.
- If you have a fix in mind, mention it so others can collaborate.

We appreciate your contributions!

