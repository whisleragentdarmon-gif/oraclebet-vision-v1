import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Cette ligne est cruciale pour éviter les écrans blancs sur certains hébergeurs
    base: './', 
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // On s'assure que les variables d'env ne font pas planter le build si elles manquent
      'process.env': JSON.stringify(env) 
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true, // Permet de voir les vraies erreurs dans la console du navigateur en prod
    }
  };
});
