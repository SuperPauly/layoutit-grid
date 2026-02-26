import { defineConfig } from 'vitest/config'
<<<<<<< codex/2026-02-26/15-04-49/add-unit-tests-for-state-mutations
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.spec.{js,ts}'],
=======

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-vitest.ts'],
    include: ['tests/unit/**/*.test.{js,ts}'],
    restoreMocks: true,
>>>>>>> main
  },
})
