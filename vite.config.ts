import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import pluginPurgeCss from 'vite-plugin-purgecss-updated-v5'

export default defineConfig({
  plugins: [svelte(), pluginPurgeCss()],
  build: {
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      compress: {
        unsafe: true,
        drop_console: true
      },
      format: {
        ascii_only: true
      }
    }
  }
})
