import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          const pkgPath = id.split('node_modules/').pop() || ''
          if (/^(react|react-dom|scheduler)\//.test(pkgPath)) return 'vendor-react'
          if (pkgPath.startsWith('react-router') || pkgPath.startsWith('@remix-run/')) return 'vendor-router'
          if (pkgPath.startsWith('lucide-react/')) return 'vendor-icons'
          if (pkgPath.startsWith('recharts/') || pkgPath.startsWith('d3-')) return 'vendor-charts'
          if (pkgPath.startsWith('dompurify/')) return 'vendor-sanitize'
          return 'vendor-misc'
        },
      },
    },
  },
})
