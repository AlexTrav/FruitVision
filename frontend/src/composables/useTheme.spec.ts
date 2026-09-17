import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.resetModules()
  })

  it('defaults to light when there is no saved preference', async () => {
    const { useTheme } = await import('./useTheme')
    const { theme } = useTheme()

    expect(theme.value).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('reads a previously saved theme', async () => {
    localStorage.setItem('fruitvision-theme', 'dark')
    const { useTheme } = await import('./useTheme')
    const { theme } = useTheme()

    expect(theme.value).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggling switches the theme, updates <html> class and persists to localStorage', async () => {
    const { useTheme } = await import('./useTheme')
    const { theme, toggleTheme } = useTheme()

    toggleTheme()
    await nextTick() // побочный эффект watchEffect (DOM-класс, localStorage) применяется на следующем тике
    expect(theme.value).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('fruitvision-theme')).toBe('dark')

    toggleTheme()
    await nextTick()
    expect(theme.value).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('fruitvision-theme')).toBe('light')
  })
})
