# Copilot coding agent instructions for `layoutit-grid`

## Project quick facts
- App type: Vue 3 + Vite CSS Grid layout generator.
- Main code is in `src/` (`components/`, `composables/`, `utils/`, `styles/`, `store.js`).
- End-to-end tests are in `cypress/`.

## Fastest reliable workflow
1. Install dependencies: `pnpm install` (or `npm install`).
2. Local development server: `pnpm start` (or `npm start`) at `http://localhost:3000`.
3. Lint changes: `pnpm run lint`.
4. Build output quickly: `pnpm run build-no-typing`.
5. Run Cypress spec(s) with the app already running on port 3000:
   - Terminal A: `pnpm start`
   - Terminal B: `pnpm run test -- --spec cypress/integration/basic_render_page.spec.js`
6. Linux/CI-friendly Cypress wrapper (installs runtime deps when possible):
   - `pnpm run test:ci -- --spec cypress/integration/basic_render_page.spec.js`

## Important repo-specific conventions
- `vue-global-api` is loaded globally (`src/main.ts`), so Composition APIs and lifecycle hooks are used without explicit imports in many SFCs.
- `unplugin-vue-components` is enabled in `vite.config.ts`, so many components are auto-registered.
- `GridEditor` and `FlexEditor` are globally registered in `src/main.ts` (and via `src/index.js`) to avoid circular reference issues.
- Embeddable workspace/controls views import shared styling from `src/styles/layout-editor-shared.css`; keep this import intact.

## Current known constraints and workarounds
- `pnpm run build` may fail at `vue-tsc --noEmit` due to existing macro/template typing issues in this repo.
  - Workaround for bundling validation: use `pnpm run build-no-typing`.
- Cypress fails if no app server is available on `http://localhost:3000`.
  - Workaround: start `pnpm start` first, then run Cypress in another terminal.

## Change guidance
- Keep edits minimal and scoped; avoid broad refactors.
- Prefer existing patterns in nearby files (script setup, store/composable usage, CSS style patterns).
- Cypress tests rely on `cy.openApp()` (`cypress/support/commands.js`) which targets `http://localhost:3000`.


## Mandatory Cypress execution order
For any task that changes behavior, tests, or runtime logic, run Cypress through the repository wrapper script in this order:

1. Install Node dependencies (`pnpm install` or `npm install`).
2. **Immediately after dependency installation**, run `pnpm run test:ci` (or `npm run test:ci`).
   - This first run is required because `scripts/run-cypress-ci.sh` ensures Cypress and Linux runtime dependencies are present before execution.
3. During implementation, write/update tests as code is added, removed, or refactored.
4. After all code/test edits are complete, run `pnpm run test:ci` (or `npm run test:ci`) again.
   - This final run validates the complete updated code and test set together.

## Testing expectations for code changes
- New behavior: add tests.
- Removed behavior: remove/adjust obsolete tests.
- Refactored behavior: keep equivalent or improved test coverage.
