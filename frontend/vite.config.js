import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use React 17+ automatic JSX transform
      jsxRuntime: 'automatic',
      // Enable fast refresh
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['smart-lost-found-frontend.onrender.com']
  },
  // Clear the build directory on each build
  build: {
    emptyOutDir: true,
  },
  // Ensure proper module resolution
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
})
