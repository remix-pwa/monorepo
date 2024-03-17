/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    snapshotFormat: {
      escapeString: true,
    },
    testTimeout: 10_000,
  },
})