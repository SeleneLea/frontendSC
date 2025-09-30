// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Necesitamos importar 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aquí le decimos a Vite que "@" significa "la carpeta src"
      "@": path.resolve(__dirname, "./src"),
    },
  },
})