# AGENTS.md

## Purpose
This guide gives AI coding agents (including Codex) a reliable, repo-specific operating procedure for making precise, safe, and verifiable changes in `layoutit-grid`.

## Repository Snapshot
- Stack: Vue 3 + Vite single-page app for CSS Grid layout generation.
- Package manager in docs: `pnpm` (preferred), while `npm` equivalents are also available in `package.json`.
- Primary code: `src/` (components, composables, store, utils, styles).
- E2E tests: `cypress/`.
- No GitHub Actions workflows currently exist under `.github/workflows`.
- No `Dockerfile` or `docker-compose.yml` currently exist in this repository.
- Agent-facing guidance also lives in `.github/copilot-instructions.md`.

## Source Layout (high-value paths)
- `src/main.ts`: app bootstrapping and global editor component registration.
- `src/App.vue`: main app container.
- `src/components/`: UI/editor views and controls.
- `src/composables/`: composition helpers for area/line naming logic.
- `src/store.js`: main entry point for app state management.
- `src/store/`: individual app state management modules.
- `src/generateCode.js`: generated output logic.
- `src/styles/layout-editor-shared.css`: shared styles used by embeddable workspace/control views.
- `cypress/`: browser tests and support commands.
- `vite.config.ts`: Vite + Vue + PWA + custom plugin configuration.

## Required Working Style
1. Keep changes minimal and scoped to the requested outcome.
2. Match local code patterns and naming conventions used near edited code.
3. Do not remove or bypass existing lint/build/test steps.
4. Prefer incremental edits over broad refactors.
5. When changing behavior, update/add tests where the repo already has coverage patterns.

## Build, Lint, and Test Commands
Use these commands as first-line validation:
- Install deps: `pnpm install` (fallback: `npm install`)
- Dev server: `pnpm start` (fallback: `npm start`)
- Lint: `pnpm run lint` (fallback: `npm run lint`)
- Build (with type checking): `pnpm run build` (fallback: `npm run build`)
- Build (without type checking): `pnpm run build-no-typing` (fallback: `npm run build-no-typing`)
- Cypress tests: `pnpm test` (fallback: `npm test`) with dev server running on `http://localhost:3000`
- Preferred Linux/CI Cypress path: `pnpm run test:ci` (fallback: `npm run test:ci`), which calls `scripts/run-cypress-ci.sh`.


## Mandatory Cypress Execution Order
When working on testable code paths, follow this exact sequence:
1. Install Node dependencies (`pnpm install` / `npm install`).
2. Immediately run the Cypress wrapper once dependencies are present: `pnpm run test:ci` (or `npm run test:ci`). This is mandatory because `scripts/run-cypress-ci.sh` installs/verifies Cypress and system packages first.
3. Implement code edits and add/update tests as behavior changes are introduced (new, removed, or refactored logic must receive matching tests during development).
4. Run the same wrapper again after all edits to validate the final code + test set: `pnpm run test:ci` (or `npm run test:ci`).

## CI/CD and Runtime Compatibility Rules
Because this repository may evolve, agents must always verify infra files before coding:
1. Inspect `.github/workflows/` for required build/test/deploy jobs and environment variables.
2. Inspect `Dockerfile` and `docker-compose.yml` (if present) for runtime assumptions, ports, and service dependencies.
3. Ensure any new env vars, scripts, ports, or build steps are reflected consistently across:
   - source code,
   - docs,
   - tests,
   - workflow/container configs.

Current state at time of writing:
- `.github/workflows/` missing
- `Dockerfile` missing
- `docker-compose.yml` missing

If these files are added later, this section must be updated immediately.

## Repo-Specific Implementation Notes
- `vue-global-api` is used, so macros/lifecycle helpers can appear without explicit imports.
- Components may be auto-registered through `unplugin-vue-components`.
- `GridEditor` and `FlexEditor` are globally registered to avoid circular component issues.
- Keep shared style imports intact for embeddable editor views.
- Cypress helpers rely on local app URL conventions in `cypress/support`.

## Change Checklist (execute in order)
1. Read this `AGENTS.md` and any nested `AGENTS.md` files in target directories.
2. Verify current infra reality (`.github/workflows`, Docker-related files, scripts).
3. Implement code changes incrementally.
4. Add/update tests while coding (covering new, removed, and refactored behavior as changes are written).
5. Run lint/build/tests appropriate to the scope, including a final `pnpm run test:ci` / `npm run test:ci` pass after all edits.
6. Update docs/config affected by the change.
7. **Final mandatory step:** update this `AGENTS.md` to reflect:
   - newly added files/processes/config,
   - edited workflows/commands,
   - removed/deleted files,
   - obsolete instructions that are no longer valid.
8. Ensure no stale references remain (especially to deleted or renamed files).

## AGENTS.md Maintenance Policy (Mandatory)
After every task that changes repository structure, configuration, commands, workflow, or conventions, the agent must revise this file before finishing work. Specifically:
- Add new sections/entries for newly introduced systems.
- Remove references to files or commands that no longer exist.
- Rewrite outdated steps to match current behavior.
- Keep instructions actionable and concise.
- Treat this update as the **last step** after all code/config/test edits are complete.

Failure to update this file when repository realities change is considered an incomplete task.
