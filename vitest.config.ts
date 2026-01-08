import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import type { ConfigEnv } from 'vite'

// Lade die Vite-Konfiguration dynamisch per ESM (Top-level await),
// weil `vite.config.ts` ein ESM-Modul mit einem async-export sein kann.
const viteModule = await import('./vite.config')
const viteConfig = typeof viteModule.default === 'function'
  ? await viteModule.default({ command: 'serve', mode: 'test' } as ConfigEnv)
  : viteModule.default || {}

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
        globals: true, // 👉 Aktiviert globale Testfunktionen wie describe, it, expect ohne Import
    },
  }),
)
