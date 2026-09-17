import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { i18n } from '../i18n'
import type { PredictionResponse } from '../types'
import ResultCard from './ResultCard.vue'

function makeResult(overrides: Partial<PredictionResponse> = {}): PredictionResponse {
  return {
    predicted: { class_en: 'apple', class_ru: 'Яблоко', class_kk: 'Алма', confidence: 0.92 },
    top3: [
      { class_en: 'apple', class_ru: 'Яблоко', class_kk: 'Алма', confidence: 0.92 },
      { class_en: 'pear', class_ru: 'Груша', class_kk: 'Алмұрт', confidence: 0.05 },
      { class_en: 'orange', class_ru: 'Апельсин', class_kk: 'Апельсин', confidence: 0.03 },
    ],
    is_recognized: true,
    ...overrides,
  }
}

describe('ResultCard', () => {
  // locale задаётся явно, чтобы тест не зависел от языка окружения (navigator.language в jsdom)
  beforeEach(() => {
    i18n.global.locale.value = 'ru'
  })

  it('shows the predicted class and confidence when recognized, without a warning', () => {
    const wrapper = mount(ResultCard, {
      global: { plugins: [i18n] },
      props: { result: makeResult() },
    })

    expect(wrapper.text()).toContain('Яблоко')
    expect(wrapper.text()).toContain('92%')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('shows a warning banner when the model is not confident', () => {
    const wrapper = mount(ResultCard, {
      global: { plugins: [i18n] },
      props: { result: makeResult({ is_recognized: false }) },
    })

    expect(wrapper.text()).toContain('не уверена')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('lists the top-3 alternatives in the current locale', () => {
    const wrapper = mount(ResultCard, {
      global: { plugins: [i18n] },
      props: { result: makeResult() },
    })

    expect(wrapper.text()).toContain('Груша')
    expect(wrapper.text()).toContain('Апельсин')
  })
})
