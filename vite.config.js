import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
    rollupOptions: {
      external: ['@huggingface/transformers'],
    },
  },
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
  server: {
    historyApiFallback: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
