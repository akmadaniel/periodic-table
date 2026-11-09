import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/periodic-table/', // GitHub Pages project path
  plugins: [react()],
})
