import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('axios') || id.includes('sweetalert2')) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
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

