<script setup lang="ts">
import { ref } from 'vue'

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
        ? 'border-brand-500 bg-brand-50'
        : 'border-stone-300 bg-white hover:border-brand-400 hover:bg-brand-50/40'
    "
    role="button"
    tabindex="0"
    @click="openPicker"
    @keydown.enter="openPicker"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <div class="text-4xl">📷</div>
    <p class="text-base font-medium text-stone-700">Перетащи фото сюда или нажми, чтобы выбрать</p>
    <p class="text-sm text-stone-400">JPG, PNG или WebP – до 8 МБ</p>
    <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onChange" />
  </div>
</template>
