import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { HistoryItem } from './usePredictionHistory'

const entry: HistoryItem = {
  thumbnail: 'data:image/jpeg;base64,xxx',
  classRu: 'Яблоко',
  classEn: 'apple',
  classKk: 'Алма',
  confidence: 0.95,
  isRecognized: true,
  timestamp: 1,
}

describe('usePredictionHistory', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  // usePredictionHistory() вызывается из нескольких мест (usePrediction.ts и сам список в
  // ClassifierView.vue) – если бы history не был модульным singleton'ом, эти места видели бы
  // разные копии состояния и список бы не обновлялся при добавлении записи
  it('two separate calls share the same reactive history', async () => {
    const { usePredictionHistory } = await import('./usePredictionHistory')
    const a = usePredictionHistory()
    const b = usePredictionHistory()

    a.addEntry(entry)

    expect(b.history.value).toHaveLength(1)
    expect(b.history.value[0]).toEqual(entry)
  })

  it('keeps only the 8 most recent entries, newest first', async () => {
    const { usePredictionHistory } = await import('./usePredictionHistory')
    const { addEntry, history } = usePredictionHistory()

    for (let i = 0; i < 10; i++) {
      addEntry({ ...entry, timestamp: i })
    }

    expect(history.value).toHaveLength(8)
    expect(history.value[0].timestamp).toBe(9)
    expect(history.value.at(-1)?.timestamp).toBe(2)
  })

  it('persists entries to localStorage', async () => {
    const { usePredictionHistory } = await import('./usePredictionHistory')
    const { addEntry } = usePredictionHistory()

    addEntry(entry)

    const stored = JSON.parse(localStorage.getItem('fruitvision-history') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].classEn).toBe('apple')
  })

  it('loads previously saved history on next import', async () => {
    localStorage.setItem('fruitvision-history', JSON.stringify([entry]))
    const { usePredictionHistory } = await import('./usePredictionHistory')
    const { history } = usePredictionHistory()

    expect(history.value).toHaveLength(1)
    expect(history.value[0].classEn).toBe('apple')
  })

  it('clearHistory empties the list and localStorage', async () => {
    const { usePredictionHistory } = await import('./usePredictionHistory')
    const { addEntry, clearHistory, history } = usePredictionHistory()

    addEntry(entry)
    clearHistory()

    expect(history.value).toHaveLength(0)
    expect(localStorage.getItem('fruitvision-history')).toBe('[]')
  })
})
