import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    // e2e/ is Playwright's, not Vitest's — both otherwise match *.spec.js by default.
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
