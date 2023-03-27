import postcss from './postcss.config.js'
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `5173-${host}`

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
});