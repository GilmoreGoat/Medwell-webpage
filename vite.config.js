import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// NOTE: `base` must match your GitHub Pages repo name.
// If this site is served at https://<user>.github.io/Medwell-webpage/
// keep `/Medwell-webpage/`. If you deploy to a root/custom domain, set base to '/'.
export default defineConfig({
  plugins: [
    react(),
    {
      // GitHub Pages serves 404.html on unknown paths — mirror index.html so
      // client-side routes (and direct deep links) still boot the SPA.
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        const dist = resolve(__dirname, 'dist');
        const index = resolve(dist, 'index.html');
        const notFound = resolve(dist, '404.html');
        if (existsSync(index)) copyFileSync(index, notFound);
      },
    },
  ],
  base: '/Medwell-webpage/',
});
