import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: '/MI-NUR/',
  plugins: [react()],
  define: {
    // Webpack used to polyfill these Node globals; Vite does not
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
}))
