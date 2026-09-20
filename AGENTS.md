# AGENTS.md

## Project layout

- pnpm monorepo (`pnpm-workspace.yaml` → `apps/*`). All app packages live under `apps/`; the workspace is currently empty, so new apps are scaffolded there.
- Package manager is pinned via `packageManager: pnpm@10.34.4` — use pnpm (corepack), never npm/yarn.

## Commands (run from repo root)

- `pnpm format` — Prettier write over the whole repo.
- `pnpm lint` — ESLint with `--fix` (flat config in `eslint.config.ts`, loaded via jiti), then recursively runs each app's own `lint` script (`pnpm -r --if-present lint`; apps without a `lint` script are skipped).
- No `dev`/`build`/`test`/`typecheck` scripts exist yet at root; there is no test framework installed. App-level scripts live in `apps/*/package.json` and should be run per-package (`pnpm -F <name> <script>` or from the app dir).
- Every commit triggers husky `pre-commit` → `lint-staged`. Note the `"*": "prettier . --write"` rule formats the whole repo, not just staged files, so a commit can rewrite unrelated files.

## Style (enforced, match it)

- Prettier: 4-space indent, no semicolons, single quotes, `trailingComma: es5`.
- ESLint allows unused variables/args/destructured elements prefixed with `_` (ignore pattern `^_`).
- Omit explicit return type annotations when TypeScript can infer them from the `return` expression (e.g. `function f() { return promiseFn() }` instead of `: Promise<...>`).
- Formatting and linting are checked on commit; always run `pnpm format` and `pnpm lint` before finishing.

## Language / 语言偏好

- Reply to the user in Simplified Chinese (中文) for chat responses. Keep code comments, identifiers, and commit messages in English.

## Git commit conventions

- Use Conventional Commits: `<type>(<scope>): <subject>` — types like `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `build`, `ci`, `revert`; scope names the affected area (e.g. `config`, `lint`, `app/<name>`), omitted when not applicable.
- Subject in English, lowercase, imperative mood, no trailing period.
- When a commit covers several distinct changes, list them itemized below the subject (blank line, then bullet points enumerating each specific change).
- Only commit when explicitly asked. Never commit secrets; stage only intended files; the husky `pre-commit` hook formats/lints before each commit.
- Do not push or create PRs unless asked.

## Environment ops

- `.env` is gitignored; only `.env.example` may be committed.
