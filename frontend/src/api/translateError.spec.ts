import { describe, expect, it } from 'vitest'
import { translateApiError } from './translateError'

describe('translateApiError', () => {
  it('returns the original text unchanged for the ru locale', () => {
    expect(translateApiError('Файл должен быть изображением', 'ru')).toBe('Файл должен быть изображением')
  })

  it('translates a known backend message to English', () => {
    expect(translateApiError('Файл должен быть изображением', 'en')).toBe('The file must be an image')
  })

  it('translates a known backend message to Kazakh', () => {
    expect(translateApiError('Файл должен быть изображением', 'kk')).toBe('Файл сурет болуы керек')
  })

  it('falls back to the original text for a message with no translation', () => {
    const unknown = 'Что-то пошло не так'
    expect(translateApiError(unknown, 'en')).toBe(unknown)
    expect(translateApiError(unknown, 'kk')).toBe(unknown)
  })
})
