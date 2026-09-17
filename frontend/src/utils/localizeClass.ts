import type { AppLocale } from '../i18n'

export interface LocalizedNames {
  ru: string
  en: string
  kk: string
}

// выбирает нужную языковую версию названия класса; ru – язык проекта по умолчанию.
// принимает объект с именованными полями (а не позиционные строки), чтобы порядок
// ru/en/kk нельзя было случайно перепутать местами на месте вызова
export function pickByLocale(names: LocalizedNames, locale: AppLocale): string {
  if (locale === 'kk') return names.kk
  if (locale === 'en') return names.en
  return names.ru
}
