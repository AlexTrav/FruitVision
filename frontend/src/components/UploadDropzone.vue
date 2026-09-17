<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CameraIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const emit = defineEmits<{ select: [file: File] }>()

const isDragging = ref(false) // подсветка зоны при перетаскивании файла
const inputRef = ref<HTMLInputElement | null>(null)

// обработка сброшенного файла при drag-and-drop
function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('select', file)
}

// обработка выбора файла через системный диалог
function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) emit('select', file)
}

// клик по зоне открывает системный выбор файла (скрытый input)
function openPicker() {
  inputRef.value?.click()
}
</script>

<template>
  <div
    class="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-10 text-center transition-colors"
    :class="
      isDragging
        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
        : 'border-stone-300 bg-white hover:border-brand-400 hover:bg-brand-50/40 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-brand-600 dark:hover:bg-brand-900/20'
    "
    role="button"
    tabindex="0"
    @click="openPicker"
    @keydown.enter="openPicker"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <CameraIcon class="h-10 w-10 text-stone-400 dark:text-stone-500" />
    <p class="text-base font-medium text-stone-700 dark:text-stone-200">{{ t('uploadDropzone.dragText') }}</p>
    <p class="text-sm text-stone-400 dark:text-stone-500">{{ t('uploadDropzone.formatHint') }}</p>
    <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onChange" />
  </div>
</template>
