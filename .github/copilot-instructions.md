# Copilot coding agent instructions for `layoutit-grid`

## Project quick facts
- App type: Vue 3 + Vite CSS Grid layout generator.
- Main code is in `src/` (`components/`, `composables/`, `utils/`, `styles/`, `store.js`).
- End-to-end tests are in `cypress/`.

## Fastest reliable workflow
1. Install dependencies: `npm install`.
2. For local development: `npm start` (runs Vite at `http://localhost:3000`).
3. Lint changes: `npm run lint`.
4. Build output quickly: `npm run build-no-typing`.
5. Run Cypress tests only with dev server already running on port 3000:
   - Terminal A: `npm start`
   - Terminal B: `npm test`

## Important repo-specific conventions
- `vue-global-api` is loaded globally (`src/main.ts`), so Composition API macros like `$`, `$ref`, `$computed` and lifecycle functions are used without importing in many SFCs.
- `unplugin-vue-components` is enabled in `vite.config.ts`, so many components are auto-registered and used without explicit imports.
- `GridEditor` and `FlexEditor` are globally registered in `src/main.ts` (and via `registerLayoutEditorGlobals` in `src/index.js`) to avoid circular reference issues with area editing components.
- Embeddable workspace/controls views import shared styling from `src/styles/layout-editor-shared.css`; keep this import intact when editing those files.

## Errors encountered in this repo and workarounds
- **`pnpm: command not found`** in this environment.
  - **Workaround:** use `npm install` and `npm run <script>` equivalents.
- **`npm run build` fails in `vue-tsc --noEmit`** with many template/macro symbol errors (for example unresolved `$`, `$computed`, `modelValue`, etc.).
  - **Workaround for functional verification:** use `npm run build-no-typing` to validate bundling until type-checking setup is addressed.
- **`npm test` fails with `ECONNREFUSED 127.0.0.1:3000`** if Cypress runs without a live dev server.
  - **Workaround:** start `npm start` first, then run `npm test` in a separate terminal.

## Change guidance
- Keep edits minimal and scoped; avoid broad refactors.
- Prefer matching existing patterns in nearby files (script setup, store/composable usage, CSS style patterns).
- If you touch Cypress tests, remember they rely on `cy.openApp()` (`cypress/support/commands.js`) which targets `http://localhost:3000`.
