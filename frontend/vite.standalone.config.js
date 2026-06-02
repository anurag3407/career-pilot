import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite config for building the standalone portfolio app.
 * 
 * This produces a self-contained React app in dist-portfolio/ that bundles
 * all 5 complete templates. At deploy time, the backend injects user data
 * into the HTML and deploys the entire bundle.
 * 
 * Usage: npm run build:portfolio
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-portfolio',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'standalone.html'),
    },
    // Inline small assets to reduce number of files to deploy
    assetsInlineLimit: 8192,
  },
})
