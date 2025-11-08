<template>
  <div class="container py-4 text-light">
    <h2 class="mb-4">💪 Übungen</h2>

    <div class="row g-4">
      <div v-for="exercise in exercises" :key="exercise.id" class="col-md-4">
        <div class="card bg-dark text-light shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ exercise.name }}</h5>
            <p class="card-text">{{ exercise.muscle }}</p>
            <button class="btn btn-outline-light w-100">Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const exercises = ref([
  { id: 1, name: 'Bankdrücken', muscle: 'Brust' },
  { id: 2, name: 'Kniebeugen', muscle: 'Beine' },
  { id: 3, name: 'Klimmzüge', muscle: 'Rücken' },
  { id: 4, name: 'Plank', muscle: 'Bauch' }
])
</script>
