import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'fruitvision-theme'

// то же самое, что инлайн-скрипт в index.html – переиспользуем логику, а не значение,
// чтобы после первой отрисовки состояние Vue совпадало с уже применённым классом на <html>
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage недоступен (приватный режим и т.п.) – используем системную тему
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// модульный singleton – переключатель темы в шапке и любой другой компонент
// всегда видят одно и то же состояние
const theme = ref<Theme>(getInitialTheme())

watchEffect(() => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  document.documentElement.style.colorScheme = theme.value
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    // не критично – просто не запомнится между визитами
  }
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
