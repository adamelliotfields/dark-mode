import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    base: '/',
    build: { target: 'esnext' },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  }
})
