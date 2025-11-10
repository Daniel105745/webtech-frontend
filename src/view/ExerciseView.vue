<template>
  <div class="p-8">
    <h2 class="text-2xl font-semibold mb-6">Übungen</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ex in exercises"
        :key="ex.id"
        class="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
      >
        <h3 class="text-lg font-bold">{{ ex.name }}</h3>
        <p class="text-gray-500">{{ ex.muscle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Exercise {
  id: number
  name: string
  muscle: string
}

const exercises = ref<Exercise[]>([])

onMounted(async () => {
  try {
    const res = await fetch('https://api.dein-backend.de/exercises')
    exercises.value = await res.json()
  } catch {
    exercises.value = [
      { id: 1, name: 'Kniebeugen', muscle: 'Beine' },
      { id: 2, name: 'Bankdrücken', muscle: 'Brust' },
      { id: 3, name: 'Klimmzüge', muscle: 'Rücken' },
    ]
  }
})
</script>
