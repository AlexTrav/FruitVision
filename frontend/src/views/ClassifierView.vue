<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { explainImage, predictImage } from '../api/client'
import CameraCapture from '../components/CameraCapture.vue'
import ResultCard from '../components/ResultCard.vue'
import UploadDropzone from '../components/UploadDropzone.vue'
import { usePredictionHistory } from '../composables/usePredictionHistory'
import type { PredictionResponse } from '../types'
import { createThumbnail } from '../utils/thumbnail'

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null) // локальный blob-URL для превью картинки
const isLoading = ref(false)
const error = ref<string | null>(null)
const result = ref<PredictionResponse | null>(null)

const heatmapUrl = ref<string | null>(null) // blob-URL Grad-CAM тепловой карты
const isExplaining = ref(false)
const explainError = ref<string | null>(null)

const showCamera = ref(false) // показываем живой поток с камеры вместо зоны загрузки

const { history, addEntry, clearHistory } = usePredictionHistory()

// вызывается при выборе файла (drag-and-drop, диалог выбора или снимок с камеры)
function onSelect(file: File) {
  if (!file.type.startsWith('image/')) {
    error.value = 'Пожалуйста, выбери файл изображения (JPG, PNG или WebP)'
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
  if (heatmapUrl.value) URL.revokeObjectURL(heatmapUrl.value)
  selectedFile.value = null
  previewUrl.value = null
  result.value = null
  error.value = null
  heatmapUrl.value = null
  explainError.value = null
}

// отправляет изображение на бэкенд, сохраняет ответ модели и добавляет запись в историю
async function submit() {
  if (!selectedFile.value) return
  isLoading.value = true
  error.value = null
  result.value = null

  try {
    result.value = await predictImage(selectedFile.value)
    const thumbnail = await createThumbnail(selectedFile.value)
    addEntry({
      thumbnail,
      classRu: result.value.predicted.class_ru,
      classEn: result.value.predicted.class_en,
      confidence: result.value.predicted.confidence,
      isRecognized: result.value.is_recognized,
      timestamp: Date.now(),
    })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Не удалось получить предсказание'
  } finally {
    isLoading.value = false
  }
}

// строит Grad-CAM тепловую карту по уже загруженному изображению
async function showHeatmap() {
  if (!selectedFile.value) return
  isExplaining.value = true
  explainError.value = null

  try {
    const blob = await explainImage(selectedFile.value)
    if (heatmapUrl.value) URL.revokeObjectURL(heatmapUrl.value)
    heatmapUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    explainError.value = e instanceof Error ? e.message : 'Не удалось построить тепловую карту'
  } finally {
    isExplaining.value = false
  }
}

// освобождаем blob-URL, чтобы не копить память при уходе со страницы
onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (heatmapUrl.value) URL.revokeObjectURL(heatmapUrl.value)
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 py-14">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-bold text-stone-900 sm:text-4xl">Классификатор изображений</h1>
      <p class="mt-3 text-stone-500">
        Загрузи фото фрукта или овоща – модель определит, что на нём изображено.
      </p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div class="flex flex-col gap-4">
        <!-- живой поток с камеры вместо зоны загрузки -->
        <CameraCapture v-if="showCamera" @capture="onCameraCapture" @close="showCamera = false" />

        <!-- зона загрузки показывается, пока файл не выбран и камера не открыта -->
        <UploadDropzone v-else-if="!previewUrl" @select="onSelect" />

        <!-- иначе показываем превью выбранного изображения -->
        <div v-else class="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <img :src="previewUrl" alt="Предпросмотр загруженного изображения" class="h-72 w-full object-cover" />
        </div>

        <button
          v-if="!showCamera && !previewUrl"
          class="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          @click="showCamera = true"
        >
          📷 Сделать фото с камеры
        </button>

        <div v-if="previewUrl" class="flex gap-3">
          <button
            class="flex-1 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="submit"
          >
            <span v-if="!isLoading">Определить</span>
            <span v-else class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Анализирую…
            </span>
          </button>
          <button
            class="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-stone-400"
            @click="reset"
          >
            Сбросить
          </button>
        </div>

        <p v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </p>
      </div>

      <!-- результат предсказания или заглушка, пока его нет -->
      <div class="flex flex-col gap-4">
        <Transition name="page-fade" mode="out-in">
          <ResultCard v-if="result" :result="result" />
          <div
            v-else
            class="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-300 p-6 text-center text-stone-400"
          >
            <span class="text-3xl">🔎</span>
            <p class="text-sm">Здесь появится результат после загрузки фото</p>
          </div>
        </Transition>

        <!-- Grad-CAM: на что "смотрела" модель, принимая решение -->
        <div v-if="result" class="rounded-3xl border border-stone-200 bg-white p-5">
          <button
            v-if="!heatmapUrl"
            class="w-full rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isExplaining"
            @click="showHeatmap"
          >
            {{ isExplaining ? 'Строю тепловую карту…' : '🔥 Показать, куда смотрела модель' }}
          </button>

          <div v-else>
            <p class="mb-3 text-sm font-medium text-stone-500">
              Тепловая карта Grad-CAM – красным выделены области, повлиявшие на решение модели
            </p>
            <img :src="heatmapUrl" alt="Grad-CAM тепловая карта" class="w-full rounded-2xl" />
          </div>

          <p v-if="explainError" class="mt-3 text-sm text-red-600">{{ explainError }}</p>
        </div>
      </div>
    </div>

    <!-- история последних предсказаний, хранится локально в браузере -->
    <div v-if="history.length" class="mt-14">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-stone-900">История предсказаний</h2>
        <button class="text-sm text-stone-400 hover:text-stone-600" @click="clearHistory">Очистить</button>
      </div>
      <div class="mt-4 flex gap-3 overflow-x-auto pb-2">
        <div
          v-for="item in history"
          :key="item.timestamp"
          class="flex w-28 shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 text-center"
          :class="item.isRecognized ? 'border-stone-200 bg-white' : 'border-amber-200 bg-amber-50'"
        >
          <img :src="item.thumbnail" alt="" class="h-16 w-16 rounded-xl object-cover" />
          <p class="w-full truncate text-xs font-medium text-stone-700">
            <span v-if="!item.isRecognized">⚠️ </span>{{ item.classRu }}
          </p>
          <p class="text-xs text-stone-400">{{ Math.round(item.confidence * 100) }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>
