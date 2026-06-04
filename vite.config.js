import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true,   // exposes on local network IP (e.g. 192.168.x.x)
    port: 5173,
  },
})
