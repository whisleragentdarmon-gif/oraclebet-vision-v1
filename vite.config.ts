import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // On s'assure que le serveur écoute bien partout (utile pour le debug)
  server: {
    host: true
  }
});
