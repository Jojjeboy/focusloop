import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

// Get git info
const commitMessage = execSync('git log -1 --format=%s').toString().trim()
const commitDate = execSync('git log -1 --format=%cd').toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_MESSAGE__: JSON.stringify(commitMessage),
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'FocusLoop - Timer Combinations',
        short_name: 'FocusLoop',
        description: 'A productivity app with customizable timer combinations',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/focusloop/',
        start_url: '/focusloop/',
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
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/focusloop/', // Base URL for GitHub Pages
  build: {
    chunkSizeWarningLimit: 1300,
  },
})
