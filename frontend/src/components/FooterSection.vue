<script setup lang="ts"></script>

<template>
  <footer class="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between dark:text-stone-400"
    >
      <p>FruitVision – учебный проект по компьютерному зрению.</p>
      <!-- ссылка на исходный датасет с Kaggle, на котором обучена модель -->
      <p class="flex flex-wrap items-center gap-1">
        Датасет:
        <a
          href="https://www.kaggle.com/datasets/kritikseth/fruit-and-vegetable-image-recognition"
          target="_blank"
          rel="noopener"
          class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800 dark:text-brand-400 dark:decoration-brand-700 dark:hover:text-brand-300"
        >
          Fruit and Vegetable Image Recognition (Kaggle)
        </a>
      </p>
    </div>
  </footer>
</template>
