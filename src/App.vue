<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Face Manager</h1>
      <nav class="space-x-4">
        <RouterLink to="/" class="hover:underline">Face List</RouterLink>
        <RouterLink to="/register" class="hover:underline">Register</RouterLink>
      </nav>
    </header>

    <main class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
