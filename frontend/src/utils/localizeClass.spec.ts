import { describe, expect, it } from 'vitest'
import { pickByLocale } from './localizeClass'

describe('pickByLocale', () => {
  const names = { ru: 'Яблоко', en: 'apple', kk: 'Алма' }

  it('returns the Russian name by default', () => {
    expect(pickByLocale(names, 'ru')).toBe('Яблоко')
  })

  it('returns the English name for en', () => {
    expect(pickByLocale(names, 'en')).toBe('apple')
  })

  it('returns the Kazakh name for kk', () => {
    expect(pickByLocale(names, 'kk')).toBe('Алма')
  })
})
