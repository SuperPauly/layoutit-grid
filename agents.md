# Agent runbook for `layoutit-grid`

## Scope
These instructions apply to the repository root and all subdirectories.

## Stack and layout
- Vue 3 + Vite app.
- Core source: `src/`.
- End-to-end coverage: `cypress/`.

## Development commands
- Install deps: `pnpm install` (fallback: `npm install`).
- Start app: `pnpm start` (serves at `http://localhost:3000`).
- Lint: `pnpm run lint`.
- Build without type-check gate: `pnpm run build-no-typing`.

## Cypress execution
- Standard run (requires dev server already running):
  - `pnpm run test -- --spec cypress/integration/basic_render_page.spec.js`
- Linux/CI run using wrapper script:
  - `pnpm run test:ci -- --spec cypress/integration/basic_render_page.spec.js`
  - This calls `./scripts/run-cypress-ci.sh`, which:
    - installs Linux runtime deps (when `apt-get` + root are available),
    - verifies/installs Cypress binary if missing,
    - runs `cypress run` under `xvfb-run -a`.

## Repository-specific implementation notes
- `vue-global-api` is imported in `src/main.ts`; many SFCs depend on global composition APIs/macros.
- Auto component registration is enabled through `unplugin-vue-components` in `vite.config.ts`.
- `GridEditor` and `FlexEditor` are globally registered to avoid circular dependency issues.

## Guardrails
- Keep changes minimal and localized.
- Match existing code patterns and naming in neighboring files.
- For embeddable UI changes, preserve workspace visibility and mobile accessibility behavior covered by Cypress tests.
