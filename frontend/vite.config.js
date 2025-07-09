// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Add your deployed domain to allowedHosts array
    allowedHosts: ['smart-lost-found-frontend.onrender.com/']
  }
});
