import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // 只预缓存必要的静态资源，不包含背景图片
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 排除背景图片目录
        globIgnores: ['**/images/背景图片/**'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // ✅ 增加到 10 MB
        // 运行时缓存策略：按需加载背景图片
        runtimeCaching: [
          {
            // 匹配背景图片路径
            urlPattern: /\/images\/背景图片\/.*\.png$/,
            handler: 'CacheFirst', // 优先使用缓存，如果没有则从网络获取
            options: {
              cacheName: 'background-images-cache',
              expiration: {
                maxEntries: 30, // 最多缓存30张图片
                maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存30天
              },
              cacheableResponse: {
                statuses: [0, 200], // 只缓存成功的响应
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Seltopia - The Book of Answers',
        short_name: 'Seltopia',
        description: 'A mystical H5 experience with NFC integration',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/assets': resolve(__dirname, 'src/assets'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/types': resolve(__dirname, 'src/types'),
    },
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
