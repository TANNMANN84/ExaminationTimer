import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ExaminationTimer/', // Make sure this matches your GitHub repo name
  plugins: [
    react(),
    VitePWA({ // 2. Add the plugin configuration
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Examination Timer',
        short_name: 'ExamTimer',
        description: 'A tool for managing and displaying examination timers.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})