<template>
  <div class="min-h-screen bg-gray-50 px-10 py-10 text-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between mb-10">
      <button
        @click="$emit('back')"
        class="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition active:scale-95"
      >
        <i class="bi bi-arrow-left"></i> Zurück
      </button>

      <div class="text-center flex-1">
        <h1 class="text-2xl font-bold text-gray-900">
          🏋️ {{ workout?.name || 'Workout' }}
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ workout?.muskelgruppe || '—' }}
        </p>
      </div>

      <button
        @click="$emit('add-exercise')"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition active:scale-95"
      >
        + Übung hinzufügen
      </button>
    </div>

    <!-- Workout Info -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
      <div class="flex justify-around text-center text-sm">
        <div>
          <p class="text-gray-500">Muskelgruppe</p>
          <p class="text-lg font-semibold">{{ workout?.muskelgruppe || '—' }}</p>
        </div>
        <div>
          <p class="text-gray-500">Tag</p>
          <p class="text-lg font-semibold text-blue-600">
            {{ workout?.dayOfWeek || '—' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Exercises -->
    <section>
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        💪 Übungen
      </h2>

      <div v-if="loading" class="text-center text-gray-500 italic py-8">
        Übungen werden geladen...
      </div>

      <div
        v-else-if="exercises && exercises.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="card bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div>
            <h3 class="text-lg font-semibold mb-1 text-gray-800">
              {{ exercise.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-2">
              {{ exercise.wiederholungen }} Wiederholungen × {{ exercise.saetze }} Sätze
            </p>
            <p v-if="exercise.gewicht" class="text-xs text-gray-400">
              Gewicht: {{ exercise.gewicht }} kg
            </p>
          </div>

          <!-- Buttons -->
          <div
            class="border-t border-gray-border mt-4 pt-3 flex justify-between items-center"
            @click.stop
          >
            <button
              @click="$emit('edit-exercise', exercise)"
              class="flex items-center gap-1 text-sm text-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all active:scale-95"
            >
              <i class="bi bi-pencil"></i>
              Bearbeiten
            </button>

            <button
              @click="$emit('delete-exercise', exercise.id!)"
              class="flex items-center gap-1 text-sm text-danger bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all active:scale-95"
            >
              <i class="bi bi-trash"></i>
              Löschen
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center text-gray-400 italic py-10 bg-white rounded-xl border border-dashed border-gray-300"
      >
        <p class="mb-4">Noch keine Übungen hinzugefügt</p>
        <button
          @click="$emit('add-exercise')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
        >
          + Übung hinzufügen
        </button>
      </div>
    </section>
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
  saetze: number
  wiederholungen: number
  gewicht?: number
  workoutId?: number
}

defineProps<{
  workout: Workout | null
  exercises: Exercise[]
  loading: boolean
}>()

defineEmits<{
  (e: 'add-exercise'): void
  (e: 'edit-exercise', exercise: Exercise): void
  (e: 'delete-exercise', id: number): void
  (e: 'back'): void
}>()
</script>

<style scoped>
/* Einheitliches Layout und Schatten */
</style>
