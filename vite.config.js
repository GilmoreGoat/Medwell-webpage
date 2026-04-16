import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: `base` must match your GitHub Pages repo name.
// If this site is served at https://<user>.github.io/Medwell-webpage/
// keep `/Medwell-webpage/`. If you deploy to a root/custom domain, set base to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/Medwell-webpage/',
});
