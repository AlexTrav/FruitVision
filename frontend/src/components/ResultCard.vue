<script setup lang="ts">
import type { PredictionResponse } from '../types'

defineProps<{ result: PredictionResponse }>()

// доля [0..1] в проценты для ширины прогресс-баров
function pct(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<template>
  <div class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
    <p class="text-sm font-medium text-stone-400">Это похоже на</p>
    <h3 class="mt-1 text-3xl font-semibold text-stone-900">{{ result.predicted.class_ru }}</h3>
    <p class="text-sm text-stone-400">{{ result.predicted.class_en }}</p>

    <!-- полоса уверенности модели в главном предсказании -->
    <div class="mt-5 h-3 w-full overflow-hidden rounded-full bg-stone-100">
      <div
        class="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700 ease-out"
        :style="{ width: pct(result.predicted.confidence) }"
      />
    </div>
    <p class="mt-1 text-right text-sm font-medium text-brand-700">
      {{ pct(result.predicted.confidence) }} уверенности
    </p>

    <!-- топ-3 альтернативных класса с их вероятностями -->
    <div class="mt-7 space-y-3">
      <p class="text-sm font-medium text-stone-500">Другие варианты</p>
      <div v-for="item in result.top3" :key="item.class_en" class="flex items-center gap-3">
        <span class="w-28 shrink-0 truncate text-sm text-stone-600 sm:w-32">{{ item.class_ru }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
          <div
            class="h-full rounded-full bg-accent-400 transition-all duration-700 ease-out"
            :style="{ width: pct(item.confidence) }"
          />
        </div>
        <span class="w-12 shrink-0 text-right text-xs text-stone-400">{{ pct(item.confidence) }}</span>
      </div>
    </div>
  </div>
</template>
