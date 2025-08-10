import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173, // Changed to match Playwright config
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext' // Ensure modern ES modules
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
});
