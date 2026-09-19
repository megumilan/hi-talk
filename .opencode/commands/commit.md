---
description: Commit staged changes following the repo's Conventional Commits convention.
---

Review `git status` and `git diff` before committing. Stage only the intended files (never secrets). Commit with a Conventional Commits message — `<type>(<scope>): <subject>`, type from `feat|fix|chore|docs|refactor|test|style|perf|build|ci|revert`, scope naming the affected area (omitted when not applicable), subject in English lowercase. When the commit covers several distinct changes, add a blank line after the subject and list each specific change as a bullet point. Use $ARGUMENTS as the subject if given. Do not push or create a PR unless asked.
