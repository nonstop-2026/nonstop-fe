/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // 개발 서버가 처음부터 미리 묶어 둘 라이브러리. 화면을 옮기다 새로 발견되면 React가 두 벌 로드되는 문제가 생긴다
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      'react-router',
      'motion/react',
      'zustand',
      'zustand/middleware',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      'msw',
      'msw/browser',
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
