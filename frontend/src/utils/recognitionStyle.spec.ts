import { describe, expect, it } from 'vitest'
import { recognitionCardClass } from './recognitionStyle'

describe('recognitionCardClass', () => {
  it('uses neutral styling when the model is confident', () => {
    const classes = recognitionCardClass(true)
    expect(classes).toContain('bg-white')
    expect(classes).not.toContain('amber')
  })

  it('uses amber warning styling when the model is not confident', () => {
    expect(recognitionCardClass(false)).toContain('amber')
  })
})
