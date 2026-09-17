<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import LogoMark from './icons/LogoMark.vue'

const isOpen = ref(false) // раскрыто ли мобильное меню

const links = [
  { to: '/', label: 'Главная' },
  { to: '/classify', label: 'Классификатор' },
  { to: '/about', label: 'О проекте' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold text-stone-900">
        <LogoMark class="h-7 w-7" />
        <span>Fruit<span class="text-brand-600">Vision</span></span>
      </RouterLink>

      <!-- навигация для десктопа -->
      <ul class="hidden items-center gap-1 sm:flex">
        <li v-for="link in links" :key="link.to">
          <RouterLink
            :to="link.to"
            class="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            active-class="!bg-brand-100 !text-brand-800"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>

      <!-- кнопка-гамбургер для мобильных экранов -->
      <button
        class="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 sm:hidden"
        aria-label="Открыть меню"
        @click="isOpen = !isOpen"
      >
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- выпадающее мобильное меню -->
    <Transition name="page-fade">
      <ul v-if="isOpen" class="flex flex-col gap-1 border-t border-stone-200 px-5 py-3 sm:hidden">
        <li v-for="link in links" :key="link.to">
          <RouterLink
            :to="link.to"
            class="block rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-brand-50 hover:text-brand-700"
            active-class="!bg-brand-100 !text-brand-800"
            @click="isOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </Transition>
  </header>
</template>
