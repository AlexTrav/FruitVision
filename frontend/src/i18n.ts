import { createI18n } from 'vue-i18n'
import en from './locales/en'
import kk from './locales/kk'
import ru from './locales/ru'

export type AppLocale = 'ru' | 'en' | 'kk'

export const SUPPORTED_LOCALES: { code: AppLocale; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'ҚАЗ' },
  { code: 'en', label: 'EN' },
]

const STORAGE_KEY = 'fruitvision-locale'

function isAppLocale(value: string | null): value is AppLocale {
  return value === 'ru' || value === 'en' || value === 'kk'
}

// сначала – выбор пользователя из прошлого визита, иначе – язык браузера, иначе – русский
// (исходный язык проекта)
function detectInitialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isAppLocale(saved)) return saved
  } catch {
    // localStorage недоступен (приватный режим и т.п.)
  }

  const browserLang = navigator.language.slice(0, 2).toLowerCase()
  if (isAppLocale(browserLang)) return browserLang

  return 'ru'
}

export const initialLocale = detectInitialLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'ru',
  messages: { ru, en, kk },
})
