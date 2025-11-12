<template>

  <div :class="[{ dark: isDark }, 'flex h-screen overflow-hidden']">
    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900 text-white flex flex-col shadow-xl fixed h-full"
    >
      <div class="flex items-center justify-center py-6 border-b border-gray-800">
        <span class="text-2xl font-bold tracking-tight">🏋️‍♂️ Fitness Tracker</span>
      </div>

      <nav class="flex-1 mt-6 space-y-1 px-4 overflow-y-auto">
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-4 py-2 rounded-md font-medium transition hover:bg-gray-800"
          active-class="bg-blue-600 text-white shadow-md"
        >
          <i class="bi bi-speedometer2 text-lg"></i>
          Dashboard
        </RouterLink>

        <RouterLink
          to="/plans"
          class="flex items-center gap-3 px-4 py-2 rounded-md font-medium transition hover:bg-gray-800"
          active-class="bg-blue-600 text-white shadow-md"
        >
          <i class="bi bi-list-check text-lg"></i>
          Trainingspläne
        </RouterLink>

        <RouterLink
          to="/workouts"
          class="flex items-center gap-3 px-4 py-2 rounded-md font-medium transition hover:bg-gray-800"
          active-class="bg-blue-600 text-white shadow-md"
        >
          <i class="bi bi-fire text-lg"></i>
          Workouts
        </RouterLink>

        <RouterLink
          to="/exercises"
          class="flex items-center gap-3 px-4 py-2 rounded-md font-medium transition hover:bg-gray-800"
          active-class="bg-blue-600 text-white shadow-md"
        >
          <i class="bi bi-bicycle text-lg"></i>
          Übungen
        </RouterLink>
      </nav>

      <footer class="border-t border-gray-800 py-3 text-center text-sm text-gray-500">
        © 2025 Fitness Tracker
      </footer>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 ml-64 min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <!-- Navbar -->
      <header
        class="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 shadow-sm transition-colors"
      >
        <h1 class="font-semibold text-lg text-gray-800 dark:text-gray-100">

        </h1>

        <div class="flex items-center gap-3">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleTheme"
            class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium transition hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <i :class="isDark ? 'bi bi-moon-stars-fill' : 'bi bi-brightness-high-fill'"></i>
            {{ isDark ? 'Dark Mode' : 'Light Mode' }}
          </button>

          <RouterLink
            to="/profile"
            class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium transition"
          >
            Profil
          </RouterLink>

          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition active:scale-95"
          >
            Logout
          </button>
        </div>
      </header>

      <!-- Main Dashboard Content -->
      <main class="flex-1 p-8 overflow-y-auto transition-colors">
        <div class="w-full max-w-7xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, watchEffect } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>
