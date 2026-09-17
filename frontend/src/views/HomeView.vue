<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AcademicCapIcon, CameraIcon, CheckCircleIcon, CpuChipIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

// ключевые цифры проекта для блока статистики
const stats = computed(() => [
  { value: '36', label: t('home.statClasses') },
  { value: '92%', label: t('home.statAccuracy') },
  { value: 'CNN', label: t('home.statModel') },
])

// три шага в блоке "как это работает"
const steps = computed(() => [
  { icon: CameraIcon, title: t('home.step1Title'), text: t('home.step1Text') },
  { icon: CpuChipIcon, title: t('home.step2Title'), text: t('home.step2Text') },
  { icon: CheckCircleIcon, title: t('home.step3Title'), text: t('home.step3Text') },
])
</script>

<template>
  <div>
    <section class="relative overflow-hidden">
      <!-- декоративные анимированные пятна фона -->
      <div
        class="animate-blob absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl dark:bg-brand-900/30"
        aria-hidden="true"
      />
      <div
        class="animate-blob-delayed absolute -right-16 top-10 h-80 w-80 rounded-full bg-accent-200/60 blur-3xl dark:bg-accent-900/30"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-6xl px-5 pb-20 pt-16 text-center sm:pt-24">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
        >
          <AcademicCapIcon class="h-4 w-4" />
          {{ t('home.badge') }}
        </span>

        <h1 class="mt-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl dark:text-stone-50">
          {{ t('home.titleLine1') }}<br class="hidden sm:block" />
          {{ t('home.titleLine2') }}
        </h1>

        <p class="mx-auto mt-5 max-w-xl text-lg text-stone-500 dark:text-stone-400">
          {{ t('home.subtitle') }}
        </p>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RouterLink
            to="/classify"
            class="w-full rounded-full bg-brand-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition-transform hover:scale-105 hover:bg-brand-700 sm:w-auto"
          >
            {{ t('home.ctaPrimary') }}
          </RouterLink>
          <RouterLink
            to="/about"
            class="w-full rounded-full border border-stone-300 bg-white px-7 py-3 text-base font-semibold text-stone-700 transition-colors hover:border-brand-300 hover:text-brand-700 sm:w-auto dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-brand-700 dark:hover:text-brand-400"
          >
            {{ t('home.ctaSecondary') }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- блок статистики проекта -->
    <section class="border-y border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div
        class="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-stone-800"
      >
        <div v-for="stat in stats" :key="stat.label" class="px-6 py-8 text-center" v-reveal>
          <div class="text-3xl font-bold text-brand-700 dark:text-brand-400">{{ stat.value }}</div>
          <div class="mt-1 text-sm text-stone-500 dark:text-stone-400">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- блок "как это работает" -->
    <section class="mx-auto max-w-6xl px-5 py-20">
      <div class="mx-auto max-w-2xl text-center" v-reveal>
        <h2 class="text-3xl font-bold text-stone-900 dark:text-stone-50">{{ t('home.howTitle') }}</h2>
        <p class="mt-3 text-stone-500 dark:text-stone-400">{{ t('home.howSubtitle') }}</p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          v-reveal
          class="rounded-3xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
          >
            <component :is="step.icon" class="h-6 w-6" />
          </div>
          <h3 class="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-50">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{{ step.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
