<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div class="bg-dark text-light vh-100 p-3" style="width: 250px;">
      <h3 class="text-center mb-4">🏋️ Fitness Tracker</h3>

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link text-light" active-class="active bg-success">
            <i class="bi bi-house-door me-2"></i> Home
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/plans" class="nav-link text-light" active-class="active bg-success">
            <i class="bi bi-list-task me-2"></i> Pläne
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/workouts" class="nav-link text-light" active-class="active bg-success">
            <i class="bi bi-fire me-2"></i> Workouts
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/exercises" class="nav-link text-light" active-class="active bg-success">
            <i class="bi bi-bicycle me-2"></i> Übungen
          </RouterLink>
        </li>
      </ul>

      <hr class="text-secondary" />

      <div class="text-center">
        <small>v1.0.0</small>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 text-light p-4" style="min-height: 100vh; background-color: #2b2b2b;">
      <RouterView />
    </div>



  </div>
</template>

<style scoped>
.nav-link.active {
  font-weight: 600;
}
</style>

