<template>
  <div class="app-layout flex h-screen overflow-hidden">

    <!-- Sidebar -->
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

        <RouterLink to="/external-exercises" class="nav-item" active-class="nav-active">
          <i class="bi bi-bicycle"></i> Übungen
        </RouterLink>
      </nav>

      <footer class="sidebar-footer">
        © 2025 Fitness Tracker
      </footer>
    </aside>

    <!-- Main Content -->
    <div class="main">

      <!-- Navbar -->
      <header class="navbar">
        <div class="right">
          <RouterLink to="/profile" class="nav-btn">Profil</RouterLink>
          <button class="logout-btn">Logout</button>
        </div>
      </header>

      <!-- GLOBAL CONTENT WRAPPER (Panel-Hintergrund wie in PlansView) -->
      <div
        class="flex flex-col h-[calc(100vh-80px)] overflow-y-auto px-10 py-6
               bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100
               transition-colors duration-300"
      >
        <main class="page">
          <RouterView />
        </main>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
