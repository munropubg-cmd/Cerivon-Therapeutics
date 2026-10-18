import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Polling: the project lives in a OneDrive folder, where native file events are unreliable
  // host: true listens on 127.0.0.1 and ::1, so localhost works in every browser
  server: { port: 5282, host: true, watch: { usePolling: true, interval: 300 } },
});
