import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { explainImage } from '../api/client'

// строит Grad-CAM тепловую карту (PNG) по уже загруженному изображению
export function useGradcam() {
  const { t } = useI18n()

  const heatmapUrl = ref<string | null>(null) // blob-URL Grad-CAM тепловой карты
  const isExplaining = ref(false)
  const error = ref<string | null>(null)

  function revoke() {
    if (heatmapUrl.value) URL.revokeObjectURL(heatmapUrl.value)
    heatmapUrl.value = null
  }

  async function explain(file: File) {
    isExplaining.value = true
    error.value = null

    try {
      const blob = await explainImage(file)
      revoke()
      heatmapUrl.value = URL.createObjectURL(blob)
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('classifier.explainFallbackError')
    } finally {
      isExplaining.value = false
    }
  }

  function reset() {
    revoke()
    error.value = null
  }

  // освобождаем blob-URL, чтобы не копить память при уходе со страницы
  onBeforeUnmount(revoke)

  return { heatmapUrl, isExplaining, error, explain, reset }
}
