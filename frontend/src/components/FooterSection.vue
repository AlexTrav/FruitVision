<script setup lang="ts"></script>

<template>
  <footer class="border-t border-stone-200 bg-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
      <p>FruitVision – учебный проект по компьютерному зрению.</p>
      <!-- ссылка на исходный датасет с Kaggle, на котором обучена модель -->
      <p class="flex flex-wrap items-center gap-1">
        Датасет:
        <a
          href="https://www.kaggle.com/datasets/kritikseth/fruit-and-vegetable-image-recognition"
          target="_blank"
          rel="noopener"
          class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800"
        >
          Fruit and Vegetable Image Recognition (Kaggle)
        </a>
      </p>
    </div>
  </footer>
</template>
