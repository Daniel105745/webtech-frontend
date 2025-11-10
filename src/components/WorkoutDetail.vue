<template>
  <div class="min-h-screen bg-gray-50 px-6 py-8 text-gray-800">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button
          @click="$emit('back')"
          class="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition active:scale-95"
          aria-label="Zurück"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          <span class="sr-only">Zurück</span>
          <span class="hidden sm:inline">Zurück</span>
        </button>

        <h1 class="text-2xl font-bold text-gray-900 flex-1 text-center truncate">
          <span class="inline-block mr-2">🏋️</span>
          {{ (workout && workout.name) || 'Workout' }}
        </h1>

        <button
          @click="$emit('add-exercise')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition active:scale-95"
          aria-label="Übung hinzufügen"
        >
          + Übung
        </button>
      </div>

      <!-- Workout Info -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 text-center">
        <div class="sm:flex sm:justify-between sm:items-center">
          <div>
            <p class="text-gray-500 text-sm">Muskelgruppe</p>
            <p class="text-lg font-semibold text-gray-800">{{ workout?.muskelgruppe || '—' }}</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <p class="text-gray-500 text-sm">Tag</p>
            <p class="text-lg font-semibold text-blue-600">{{ workout?.dayOfWeek || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Exercises -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold flex items-center gap-2">💪 Übungen</h2>
          <p v-if="!loading && exercises && exercises.length" class="text-sm text-gray-500">{{ exercises.length }} Übung(en)</p>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 3" :key="n" class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm animate-pulse">
            <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="exercises && exercises.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="exercise in exercises"
            :key="exercise.id"
            class="card p-6 flex flex-col justify-between h-full group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <h3 class="text-lg font-bold mb-1 group-hover:text-primary transition">{{ exercise.name }}</h3>
              <p class="text-gray-text text-sm mb-4">{{ exercise.reps }} Wiederholungen × {{ exercise.sets }} Sätze</p>
              <!-- zusätzliche Meta falls benötigt -->
            </div>

            <div class="border-t border-gray-border mt-3 pt-3 flex justify-between items-center" @click.stop>
              <button
                @click="$emit('edit-exercise', exercise)"
                class="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 text-primary hover:bg-primary-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232a2.5 2.5 0 013.536 3.536L8.5 19.036l-4 1 1-4 9.732-9.732z" />
                </svg>
                Bearbeiten
              </button>

              <button
                @click="$emit('delete-exercise', exercise.id!)"
                class="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 text-danger hover:bg-red-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Löschen
              </button>
            </div>
          </div>
         </div>

        <div v-else class="text-center text-gray-400 italic py-10 bg-white rounded-xl border border-dashed border-gray-300">
          <p class="mb-4">Noch keine Übungen hinzugefügt</p>
          <button @click="$emit('add-exercise')" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm">
            + Übung hinzufügen
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Workout {
  id?: number
  name?: string
  muskelgruppe?: string
  dayOfWeek?: string
}

interface Exercise {
  id?: number
  name: string
  reps: number
  sets: number
  workoutId?: number
}

// Props (type-only)
defineProps<{
  workout: Workout | null
  exercises: Exercise[]
  loading: boolean
}>()

// Emits (typed)
defineEmits<{
  (e: 'add-exercise'): void
  (e: 'edit-exercise', exercise: Exercise): void
  (e: 'delete-exercise', id: number): void
  (e: 'back'): void
}>()
</script>
