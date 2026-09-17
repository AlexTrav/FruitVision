import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { predictImage } from '../api/client'
import type { PredictionResponse } from '../types'
import { createThumbnail } from '../utils/thumbnail'
import { usePredictionHistory } from './usePredictionHistory'

// отправка файла на /api/predict + запись результата в локальную историю
export function usePrediction() {
  const { t } = useI18n()
  const { addEntry } = usePredictionHistory()

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<PredictionResponse | null>(null)

  async function predict(file: File) {
    isLoading.value = true
    error.value = null
    result.value = null

    try {
      const prediction = await predictImage(file)
      result.value = prediction

      const thumbnail = await createThumbnail(file)
      addEntry({
        thumbnail,
        classRu: prediction.predicted.class_ru,
        classEn: prediction.predicted.class_en,
        classKk: prediction.predicted.class_kk,
        confidence: prediction.predicted.confidence,
        isRecognized: prediction.is_recognized,
        timestamp: Date.now(),
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('classifier.predictFallbackError')
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    result.value = null
    error.value = null
  }

  return { isLoading, error, result, predict, reset }
}
