import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable the new JSX transform
      jsxImportSource: 'react',
      // Enable fast refresh
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['smart-lost-found-frontend.onrender.com']
  },
  // Ensure proper JSX runtime configuration
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
