import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup-vitest.ts'],
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    restoreMocks: true,
  },
})
