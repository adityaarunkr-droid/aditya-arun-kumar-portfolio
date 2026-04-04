import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* ESM has no `__dirname`; without this, `@` → `src` breaks and Vite returns 500 on files using `@/…`. */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* Pin core entry points so pre-bundles don’t go stale across React / Vite upgrades. */
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react-router-dom'],
  },
  server: {
    hmr: { overlay: true },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    /* Smaller deploy; use host/source maps if you need production debugging */
    sourcemap: false,
    target: 'es2022',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@ark-ui') || id.includes('@zag-js')) return 'ark-ui'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('lucide-react')) return 'icons'
          if (
            id.includes('/react-dom/') ||
            id.includes('/node_modules/react/') ||
            id.includes('react-router') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
