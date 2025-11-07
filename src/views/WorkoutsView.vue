<template>
  <div class="container py-4 text-light">
    <h2 class="mb-4">🏋️‍♂️ Workouts</h2>

    <div class="row g-4">
      <div v-for="workout in workouts" :key="workout.id" class="col-md-4">
        <div class="card bg-dark text-light shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ workout.name }}</h5>
            <p class="card-text">{{ workout.description }}</p>
            <button class="btn btn-outline-success w-100">Übungen anzeigen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const workouts = ref([
  { id: 1, name: 'Push Day', description: 'Brust, Schultern, Trizeps' },
  { id: 2, name: 'Pull Day', description: 'Rücken, Bizeps' },
  { id: 3, name: 'Leg Day', description: 'Beine und Core' }
])
</script>
