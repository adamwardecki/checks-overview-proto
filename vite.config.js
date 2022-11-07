import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/checks-overview-proto/',
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.vue', 'src/*.vue'],
    }),
  ],
  resolve: {
    // configure the path alias
    alias: {
      '@': '/src',
    },
  },
})
