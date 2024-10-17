import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { VITE_HOMEPAGE } = loadEnv(mode, process.cwd())
  const base = VITE_HOMEPAGE ? new URL(VITE_HOMEPAGE).pathname : '/'

  return {
    base: mode === 'production' ? base : '/',
    build: { target: 'esnext' },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  }
})
