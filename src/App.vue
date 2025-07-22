<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Face Manager</h1>
          </div>
          <nav class="flex items-center gap-6">
            <RouterLink 
              to="/" 
              class="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600"
            >Face List</RouterLink>
            <RouterLink 
              to="/register" 
              class="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              active-class="text-green-600"
            >Register</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <RouterView v-slot="{ Component }">
        <Transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>