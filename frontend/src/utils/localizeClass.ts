import type { AppLocale } from '../i18n'

// выбирает нужную языковую версию названия класса; ru – язык проекта по умолчанию
export function pickByLocale(ru: string, en: string, kk: string, locale: AppLocale): string {
  if (locale === 'kk') return kk
  if (locale === 'en') return en
  return ru
}
