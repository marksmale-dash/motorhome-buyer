import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'source',
  base: '/motorhome-buyer/',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
})
