import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
plugins: [react()],
server: {
allowedHosts: true,
host: true,
strictPort: true,
port: 5173
}})