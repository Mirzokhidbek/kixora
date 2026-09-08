import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 8080,
    strictPort: true,
    allowedHosts: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    allowedHosts: true,
  },
})
