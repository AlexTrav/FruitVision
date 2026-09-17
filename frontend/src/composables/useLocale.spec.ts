import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const originalLanguage = window.navigator.language

function stubBrowserLanguage(lang: string) {
  Object.defineProperty(window.navigator, 'language', { value: lang, configurable: true })
}

describe('useLocale', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    stubBrowserLanguage(originalLanguage)
  })

  it('falls back to ru when there is no saved preference and the browser language is unsupported', async () => {
    stubBrowserLanguage('fr-FR')
    const { useLocale } = await import('./useLocale')
    const { locale } = useLocale()

    expect(locale.value).toBe('ru')
  })

  it('detects a supported browser language when there is no saved preference', async () => {
    stubBrowserLanguage('kk-KZ')
    const { useLocale } = await import('./useLocale')
    const { locale } = useLocale()

    expect(locale.value).toBe('kk')
  })

  it('a previously saved locale takes priority over the browser language', async () => {
    localStorage.setItem('fruitvision-locale', 'en')
    stubBrowserLanguage('kk-KZ')
    const { useLocale } = await import('./useLocale')
    const { locale } = useLocale()

    expect(locale.value).toBe('en')
  })

  it('changing the locale updates <html lang> and persists the choice', async () => {
    stubBrowserLanguage('fr-FR')
    const { useLocale } = await import('./useLocale')
    const { locale } = useLocale()

    locale.value = 'kk'

    expect(document.documentElement.lang).toBe('kk')
    expect(localStorage.getItem('fruitvision-locale')).toBe('kk')
  })

  it('exposes all three supported locales for the switcher', async () => {
    const { useLocale } = await import('./useLocale')
    const { locales } = useLocale()

    expect(locales.map((l) => l.code).sort()).toEqual(['en', 'kk', 'ru'])
  })
})
