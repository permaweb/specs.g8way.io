import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import postcss from './postcss.config.js'

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `5173-${host}`
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'dist',
  },
  css: {
    postcss
  },
  server: {
    hmr: {
      clientPort: host ? 443 : 5173,
      host: host
        ? publicUrl
        : "localhost",
    }
  },
  base: '.'
});