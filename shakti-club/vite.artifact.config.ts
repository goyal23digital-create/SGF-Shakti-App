import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/* Single-file build: everything (JS, CSS, fonts, images) inlined into one
   HTML document. Used for hosts that only accept a self-contained page.
   Usage: npx vite build --config vite.artifact.config.ts */
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    rollupOptions: { input: 'artifact.html' },
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 10_000,
  },
});
