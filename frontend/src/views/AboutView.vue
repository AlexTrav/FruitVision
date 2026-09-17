<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cog6ToothIcon, CpuChipIcon, CubeIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'
import { fetchClasses, fetchModelInfo } from '../api/client'
import { useLocale } from '../composables/useLocale'
import type { ClassInfo, ModelInfo } from '../types'
import { pickByLocale } from '../utils/localizeClass'

const { t } = useI18n()
const { locale } = useLocale()

const modelInfo = ref<ModelInfo | null>(null)
const classes = ref<ClassInfo[]>([])
const error = ref<string | null>(null)

// шаги пайплайна обучения – из ноутбука model/training/fruit_vegetable_classification.ipynb
const pipeline = computed(() => [
  { title: t('about.pipelineStep1Title'), text: t('about.pipelineStep1Text') },
  { title: t('about.pipelineStep2Title'), text: t('about.pipelineStep2Text') },
  { title: t('about.pipelineStep3Title'), text: t('about.pipelineStep3Text') },
  { title: t('about.pipelineStep4Title'), text: t('about.pipelineStep4Text') },
  { title: t('about.pipelineStep5Title'), text: t('about.pipelineStep5Text') },
])

// точность baseline-модели и итоговой transfer-learning модели из ноутбука (для наглядного сравнения)
const baselineAccuracy = 0.68
const transferAccuracy = 0.92

// стек технологий проекта по слоям – для карточек на странице (названия инструментов не переводятся,
// это имена собственные)
const techStack = computed(() => [
  {
    icon: CpuChipIcon,
    category: t('about.techModel'),
    items: ['Python', 'TensorFlow / Keras', 'MobileNetV2', 'NumPy', 'scikit-learn', 'Google Colab (GPU)'],
  },
  {
    icon: Cog6ToothIcon,
    category: t('about.techBackend'),
    items: ['FastAPI', 'Uvicorn', 'Pydantic', 'Pillow', 'pytest'],
  },
  {
    icon: PaintBrushIcon,
    category: t('about.techFrontend'),
    items: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'vue-router'],
  },
  {
    icon: CubeIcon,
    category: t('about.techInfra'),
    items: ['Docker', 'docker-compose', 'nginx', 'Makefile'],
  },
])

// подгружаем метаданные модели и список классов с бэкенда при открытии страницы
onMounted(async () => {
  try {
    const [info, list] = await Promise.all([fetchModelInfo(), fetchClasses()])
    modelInfo.value = info
    classes.value = list
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('about.loadError')
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 py-14">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{{ t('about.title') }}</h1>
      <p class="mt-3 text-stone-500 dark:text-stone-400">{{ t('about.subtitle') }}</p>
    </div>

    <p
      v-if="error"
      class="mx-auto mt-6 max-w-xl rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
    >
      {{ error }}
    </p>

    <!-- карточки с параметрами модели и сравнением точности -->
    <section class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div v-reveal class="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-50">{{ t('about.architectureTitle') }}</h2>
        <dl class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
            <dt class="text-stone-500 dark:text-stone-400">{{ t('about.modelLabel') }}</dt>
            <dd class="font-medium text-stone-800 dark:text-stone-200">{{ modelInfo?.architecture ?? '–' }}</dd>
          </div>
          <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
            <dt class="text-stone-500 dark:text-stone-400">{{ t('about.inputSizeLabel') }}</dt>
            <dd class="font-medium text-stone-800 dark:text-stone-200">
              {{ modelInfo ? `${modelInfo.image_size[0]}×${modelInfo.image_size[1]}` : '–' }}
            </dd>
          </div>
          <div class="flex justify-between border-b border-stone-100 pb-2 dark:border-stone-800">
            <dt class="text-stone-500 dark:text-stone-400">{{ t('about.classesLabel') }}</dt>
            <dd class="font-medium text-stone-800 dark:text-stone-200">{{ modelInfo?.num_classes ?? '–' }}</dd>
          </div>
          <div class="flex justify-between pb-2">
            <dt class="text-stone-500 dark:text-stone-400">{{ t('about.accuracyLabel') }}</dt>
            <dd class="font-medium text-brand-700 dark:text-brand-400">
              {{ modelInfo ? `${Math.round(modelInfo.test_accuracy * 100)}%` : '–' }}
            </dd>
          </div>
        </dl>
      </div>

      <div v-reveal class="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 class="text-lg font-semibold text-stone-900 dark:text-stone-50">{{ t('about.comparisonTitle') }}</h2>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">{{ t('about.comparisonSubtitle') }}</p>

        <div class="mt-5 space-y-4">
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-stone-600 dark:text-stone-300">{{ t('about.baselineLabel') }}</span>
              <span class="font-medium text-stone-800 dark:text-stone-200">{{ Math.round(baselineAccuracy * 100) }}%</span>
            </div>
            <div class="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div class="h-full rounded-full bg-stone-400 dark:bg-stone-500" :style="{ width: `${baselineAccuracy * 100}%` }" />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm">
              <span class="text-stone-600 dark:text-stone-300">{{ t('about.transferLabel') }}</span>
              <span class="font-medium text-brand-700 dark:text-brand-400">{{ Math.round(transferAccuracy * 100) }}%</span>
            </div>
            <div class="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <div
                class="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                :style="{ width: `${transferAccuracy * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- шаги пайплайна обучения модели -->
    <section class="mt-16">
      <h2 v-reveal class="text-center text-2xl font-bold text-stone-900 dark:text-stone-50">{{ t('about.pipelineTitle') }}</h2>
      <ol class="mx-auto mt-8 max-w-2xl space-y-5">
        <li
          v-for="(step, i) in pipeline"
          :key="step.title"
          v-reveal
          class="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
          :style="{ transitionDelay: `${i * 60}ms` }"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
          >
            {{ i + 1 }}
          </span>
          <div>
            <h3 class="font-semibold text-stone-900 dark:text-stone-50">{{ step.title }}</h3>
            <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- стек технологий проекта, сгруппированный по слоям -->
    <section class="mt-16">
      <h2 v-reveal class="text-center text-2xl font-bold text-stone-900 dark:text-stone-50">{{ t('about.techStackTitle') }}</h2>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div
          v-for="(group, i) in techStack"
          :key="group.category"
          v-reveal
          class="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
          :style="{ transitionDelay: `${i * 60}ms` }"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
            >
              <component :is="group.icon" class="h-5 w-5" />
            </div>
            <h3 class="font-semibold text-stone-900 dark:text-stone-50">{{ group.category }}</h3>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- список всех классов, полученный напрямую с бэкенда -->
    <section class="mt-16">
      <h2 v-reveal class="text-center text-2xl font-bold text-stone-900 dark:text-stone-50">
        {{ t('about.classesListTitle') }}
      </h2>
      <div v-reveal class="mt-8 flex flex-wrap justify-center gap-2">
        <span
          v-for="cls in classes"
          :key="cls.en"
          class="rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          {{ pickByLocale(cls, locale) }}
        </span>
      </div>
    </section>

    <!-- автор проекта -->
    <section class="mt-16 text-center" v-reveal>
      <p class="text-sm uppercase tracking-wide text-stone-400 dark:text-stone-500">{{ t('about.authorLabel') }}</p>
      <p class="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-50">Алексей Нерезов</p>
    </section>
  </div>
</template>
