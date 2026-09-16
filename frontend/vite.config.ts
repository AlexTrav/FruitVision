import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// конфигурация Vite: подключаем Vue и Tailwind CSS v4 как плагины
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
  },
})
