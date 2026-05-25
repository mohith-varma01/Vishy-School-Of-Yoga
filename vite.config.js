import { defineConfig } from 'vite';

export default defineConfig({
  // tells Vite your entry point is index.html at the root
  root: '.',
  build: {
    outDir: 'dist'
  }
});