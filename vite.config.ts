import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Polling: the project lives in a OneDrive folder, where native file events are unreliable
  server: { port: 5282, watch: { usePolling: true, interval: 300 } },
});
