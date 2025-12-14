<template>
  <div v-if="isLoading" class="h-screen w-screen flex items-center justify-center bg-[#0d192b] text-white">
    <div class="animate-spin text-4xl">⏳</div>
  </div>

  <div v-else-if="isAuthenticated" class="app-layout flex h-screen overflow-hidden">

    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="title">🏋️‍♂️ Fitness Tracker</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-item" active-class="nav-active">
          <i class="bi bi-speedometer2"></i> Dashboard
        </RouterLink>
        <RouterLink to="/plans" class="nav-item" active-class="nav-active">
          <i class="bi bi-list-check"></i> Trainingspläne
        </RouterLink>
        <RouterLink to="/workouts" class="nav-item" active-class="nav-active">
          <i class="bi bi-fire"></i> Workouts
        </RouterLink>
        <router-link to="/history" class="nav-item" active-class="nav-active">
          <i class="bi bi-clock-history"></i> Verlauf
        </router-link>
        <RouterLink to="/external-exercises" class="nav-item" active-class="nav-active">
          <i class="bi bi-bicycle"></i> Übungen
        </RouterLink>
      </nav>

      <footer class="sidebar-footer">
        <div class="text-center">
          <p class="mb-2 text-xs text-gray-400">Angemeldet als {{ user?.name }}</p>
          <button @click="handleLogout" class="btn btn-danger w-full text-sm">
            Logout
          </button>
        </div>
      </footer>
    </aside>

    <div class="main">
      <div
        class="flex flex-col h-full overflow-y-auto px-10 py-6
               bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100
               transition-colors duration-300"
      >
        <main class="page">
          <RouterView />
        </main>
      </div>
    </div>
  </div>

  <LoginView v-else />

</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import LoginView from '@/view/LoginView.vue' // Importiere die neue Seite

const { isAuthenticated, isLoading, user, logout } = useAuth0()

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>