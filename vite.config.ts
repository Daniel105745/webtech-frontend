import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(async ({ mode }) => {
  const isDev = mode === 'development' || process.env.NODE_ENV === 'development'

  const plugins: Plugin[] = [vue() as unknown as Plugin, tailwindcss() as unknown as Plugin]

  if (isDev) {
    try {
      const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
      plugins.push(vueDevTools() as unknown as Plugin)
      console.log('✅ Vue Devtools aktiviert (Development Mode)')
    } catch (err) {
      console.warn('⚠️ Konnte vite-plugin-vue-devtools nicht laden:', err)
    }
  } else {
    console.log('🚀 Production-Build: Devtools deaktiviert')
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
