import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/kavach-ml': {
        target: 'https://kavach-ml-y38n.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kavach-ml/, ''),
        secure: true,
      },
    },
  },
})
