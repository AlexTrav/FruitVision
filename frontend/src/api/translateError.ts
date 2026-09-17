import en from '../locales/en'
import kk from '../locales/kk'
import ru from '../locales/ru'
import type { AppLocale } from '../i18n'

const DICTIONARIES: Record<AppLocale, Record<string, string>> = { ru: ru.apiErrors, en: en.apiErrors, kk: kk.apiErrors }

// бэкенд всегда возвращает detail на русском (см. backend/app/main.py) – переводим известные
// сообщения на выбранный язык интерфейса; незнакомый текст возвращаем как есть (безопасный фолбэк)
export function translateApiError(detail: string, locale: AppLocale): string {
  return DICTIONARIES[locale][detail] ?? detail
}
