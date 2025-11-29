import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // Ne PAS mettre base: './' si vous utilisez react-router et vercel rewrites
    // base: '/', // Valeur par défaut, c'est ce qu'on veut avec les rewrites
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env': JSON.stringify(env)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets', // Dossier par défaut pour les js/css
      sourcemap: true,
    }
  };
});
