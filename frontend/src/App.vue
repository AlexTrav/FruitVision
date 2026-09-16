<script setup lang="ts">
import FooterSection from './components/FooterSection.vue'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NavBar />

    <main class="flex-1">
      <!-- плавный переход между страницами роутера -->
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <FooterSection />
  </div>
</template>
