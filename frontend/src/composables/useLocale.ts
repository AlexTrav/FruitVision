import { computed } from 'vue'
import { i18n, SUPPORTED_LOCALES, type AppLocale } from '../i18n'

const STORAGE_KEY = 'fruitvision-locale'

// обёртка над реактивным locale из vue-i18n: добавляет сохранение выбора в localStorage
// и обновление атрибута <html lang> (важно для доступности и SEO)
export function useLocale() {
  const locale = computed<AppLocale>({
    get: () => i18n.global.locale.value as AppLocale,
    set: (value) => {
      i18n.global.locale.value = value
      document.documentElement.lang = value
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch {
        // не критично – язык просто не запомнится между визитами
      }
    },
  })

  return { locale, locales: SUPPORTED_LOCALES }
}
