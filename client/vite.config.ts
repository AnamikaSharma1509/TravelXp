import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Supports deployment at GitHub Pages root or subpath /TravelXp/
  base: process.env.VITE_BASE_PATH || './',
});
