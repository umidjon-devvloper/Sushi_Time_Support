import { defineConfig } from 'vite';

// Standalone help center. Runs on its own port so it can be developed
// alongside the web client (3001) and admin panel without clashing.
export default defineConfig({
  server: {
    port: 3002,
    open: true,
  },
  preview: {
    port: 3002,
  },
});
