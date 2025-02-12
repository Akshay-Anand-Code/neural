import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: './dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs']
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    fs: {
      allow: ['..']
    },
    hmr: {
      overlay: false
    },
    proxy: {
      '/api/venice': {
        target: 'https://api.venice.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/venice/, '/api/v1'),
        secure: true,
        headers: {
          'Connection': 'keep-alive'
        }
      }
    }
  }
});