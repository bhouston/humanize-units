## Publishing humanize-units

Follow this checklist when publishing a new version to npm.

1. Ensure you have publish rights on the `humanize-units` package and that you are authenticated with `pnpm login`.
2. Update the version in `package.json` following semantic versioning and document changes in `README.md` (or your changelog if added).
3. Run quality gates:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`
4. Review the contents of `dist/` to confirm only expected build artifacts are present.
5. Publish using the scripted workflow:
   ```bash
   pnpm run publish
   ```
   The script cleans existing artifacts, rebuilds the project, and publishes with `--access public`.
6. Tag the release in git once published:
   ```bash
   git tag v<version>
   git push origin v<version>
   ```

If the publish fails, inspect the npm error output, fix the issue, and rerun the publish script.

