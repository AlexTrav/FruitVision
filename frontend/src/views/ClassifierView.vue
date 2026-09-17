<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CameraIcon, ExclamationTriangleIcon, FireIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import CameraCapture from '../components/CameraCapture.vue'
import ResultCard from '../components/ResultCard.vue'
import UploadDropzone from '../components/UploadDropzone.vue'
import { useGradcam } from '../composables/useGradcam'
import { useLocale } from '../composables/useLocale'
import { usePrediction } from '../composables/usePrediction'
import { usePredictionHistory } from '../composables/usePredictionHistory'
import { pickByLocale } from '../utils/localizeClass'
import { recognitionCardClass } from '../utils/recognitionStyle'

const { t } = useI18n()
const { locale } = useLocale()

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null) // локальный blob-URL для превью картинки
const showCamera = ref(false) // показываем живой поток с камеры вместо зоны загрузки
const selectError = ref<string | null>(null) // ошибка выбора файла (например, не изображение)

const { isLoading, error: predictError, result, predict, reset: resetPrediction } = usePrediction()
const { heatmapUrl, isExplaining, error: explainError, explain, reset: resetGradcam } = useGradcam()
const { history, clearHistory } = usePredictionHistory()

// вызывается при выборе файла (drag-and-drop, диалог выбора или снимок с камеры)
function onSelect(file: File) {
  if (!file.type.startsWith('image/')) {
    selectError.value = t('classifier.selectImageError')
    return
  }

  reset()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// снимок с камеры обрабатывается так же, как обычный выбранный файл
function onCameraCapture(file: File) {
  showCamera.value = false
  onSelect(file)
}

// сбрасывает выбранный файл, превью и предыдущий результат
function reset() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = null
  previewUrl.value = null
  selectError.value = null
  resetPrediction()
  resetGradcam()
}

// освобождаем blob-URL превью, чтобы не копить память при уходе со страницы
onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 py-14">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{{ t('classifier.title') }}</h1>
      <p class="mt-3 text-stone-500 dark:text-stone-400">{{ t('classifier.subtitle') }}</p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div class="flex flex-col gap-4">
        <!-- живой поток с камеры вместо зоны загрузки -->
        <CameraCapture v-if="showCamera" @capture="onCameraCapture" @close="showCamera = false" />

        <!-- зона загрузки показывается, пока файл не выбран и камера не открыта -->
        <UploadDropzone v-else-if="!previewUrl" @select="onSelect" />

        <!-- иначе показываем превью выбранного изображения -->
        <div v-else class="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <img :src="previewUrl" :alt="t('classifier.previewAlt')" class="h-72 w-full object-cover" />
        </div>

        <button
          v-if="!showCamera && !previewUrl"
          class="flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-brand-600 dark:hover:text-brand-400"
          @click="showCamera = true"
        >
          <CameraIcon class="h-4 w-4" />
          {{ t('classifier.cameraButton') }}
        </button>

        <div v-if="previewUrl" class="flex gap-3">
          <button
            class="flex-1 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="predict(selectedFile!)"
          >
            <span v-if="!isLoading">{{ t('classifier.analyze') }}</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {{ t('classifier.analyzing') }}
            </span>
          </button>
          <button
            class="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-stone-400 dark:border-stone-700 dark:text-stone-300 dark:hover:border-stone-600"
            @click="reset"
          >
            {{ t('classifier.reset') }}
          </button>
        </div>

        <p
          v-if="selectError || predictError"
          class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
        >
          {{ selectError || predictError }}
        </p>
      </div>

      <!-- результат предсказания или заглушка, пока его нет -->
      <div class="flex flex-col gap-4">
        <Transition name="page-fade" mode="out-in">
          <ResultCard v-if="result" :result="result" />
          <div
            v-else
            class="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-300 p-6 text-center text-stone-400 dark:border-stone-700 dark:text-stone-500"
          >
            <MagnifyingGlassIcon class="h-8 w-8" />
            <p class="text-sm">{{ t('classifier.placeholder') }}</p>
          </div>
        </Transition>

        <!-- Grad-CAM: на что "смотрела" модель, принимая решение -->
        <div v-if="result" class="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <button
            v-if="!heatmapUrl"
            class="flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:text-stone-300 dark:hover:border-brand-600 dark:hover:text-brand-400"
            :disabled="isExplaining"
            @click="explain(selectedFile!)"
          >
            <FireIcon v-if="!isExplaining" class="h-4 w-4" />
            {{ isExplaining ? t('classifier.gradcamBuilding') : t('classifier.gradcamButton') }}
          </button>

          <div v-else>
            <p class="mb-3 text-sm font-medium text-stone-500 dark:text-stone-400">
              {{ t('classifier.gradcamDescription') }}
            </p>
            <img :src="heatmapUrl" alt="Grad-CAM" class="w-full rounded-2xl" />
          </div>

          <p v-if="explainError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ explainError }}</p>
        </div>
      </div>
    </div>

    <!-- история последних предсказаний, хранится локально в браузере -->
    <div v-if="history.length" class="mt-14">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-50">{{ t('classifier.historyTitle') }}</h2>
        <button class="text-sm text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300" @click="clearHistory">
          {{ t('classifier.historyClear') }}
        </button>
      </div>
      <div class="mt-4 flex gap-3 overflow-x-auto pb-2">
        <div
          v-for="item in history"
          :key="item.timestamp"
          class="flex w-28 shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 text-center"
          :class="recognitionCardClass(item.isRecognized)"
        >
          <div class="relative">
            <img :src="item.thumbnail" alt="" class="h-16 w-16 rounded-xl object-cover" />
            <ExclamationTriangleIcon
              v-if="!item.isRecognized"
              class="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-amber-100 p-0.5 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            />
          </div>
          <p class="w-full truncate text-xs font-medium text-stone-700 dark:text-stone-300">
            {{ pickByLocale({ ru: item.classRu, en: item.classEn, kk: item.classKk }, locale) }}
          </p>
          <p class="text-xs text-stone-400 dark:text-stone-500">{{ Math.round(item.confidence * 100) }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>
