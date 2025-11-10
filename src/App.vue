<template>
  <div class="flex h-screen bg-gray-100 text-gray-900 overflow-hidden">
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
    <div class="flex flex-col flex-1 ml-64 min-h-screen bg-gray-100 text-gray-900">
      <!-- Navbar -->
      <header
        class="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 shadow-sm"
      >
        <h1 class="font-semibold text-lg text-gray-800"></h1>

        <div class="flex items-center gap-3">
          <RouterLink
            to="/profile"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition"
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
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="w-full max-w-7xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
