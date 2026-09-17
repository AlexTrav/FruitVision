<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { PredictionResponse } from '../types'

defineProps<{ result: PredictionResponse }>()

// доля [0..1] в проценты для ширины прогресс-баров
function pct(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<template>
  <div
    class="rounded-3xl border p-6 shadow-sm sm:p-8"
    :class="
      result.is_recognized
        ? 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
        : 'border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30'
    "
  >
    <!-- уверенность ниже порога – скорее всего, это вообще не фрукт и не овощ из наших 36 классов -->
    <div
      v-if="!result.is_recognized"
      class="mb-5 flex items-start gap-3 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
    >
      <ExclamationTriangleIcon class="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p>
        Модель не уверена, что на фото один из 36 известных ей фруктов или овощей. Ниже показан
        самый близкий вариант, но доверять ему не стоит.
      </p>
    </div>

    <p class="text-sm font-medium text-stone-400 dark:text-stone-500">Это похоже на</p>
    <h3 class="mt-1 text-3xl font-semibold text-stone-900 dark:text-stone-50">{{ result.predicted.class_ru }}</h3>
    <p class="text-sm text-stone-400 dark:text-stone-500">{{ result.predicted.class_en }}</p>

    <!-- полоса уверенности модели в главном предсказании -->
    <div class="mt-5 h-3 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
      <div
        class="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700 ease-out"
        :style="{ width: pct(result.predicted.confidence) }"
      />
    </div>
    <p class="mt-1 text-right text-sm font-medium text-brand-700 dark:text-brand-400">
      {{ pct(result.predicted.confidence) }} уверенности
    </p>

    <!-- топ-3 альтернативных класса с их вероятностями -->
    <div class="mt-7 space-y-3">
      <p class="text-sm font-medium text-stone-500 dark:text-stone-400">Другие варианты</p>
      <div v-for="item in result.top3" :key="item.class_en" class="flex items-center gap-3">
        <span class="w-28 shrink-0 truncate text-sm text-stone-600 sm:w-32 dark:text-stone-300">{{ item.class_ru }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
          <div
            class="h-full rounded-full bg-accent-400 transition-all duration-700 ease-out"
            :style="{ width: pct(item.confidence) }"
          />
        </div>
        <span class="w-12 shrink-0 text-right text-xs text-stone-400 dark:text-stone-500">{{ pct(item.confidence) }}</span>
      </div>
    </div>
  </div>
</template>
