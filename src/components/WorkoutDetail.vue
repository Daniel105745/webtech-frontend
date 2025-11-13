<template>

  <!-- Header -->
  <div class="flex items-center justify-between mb-10">
    <button
      @click="$emit('back')"
      class="btn btn-outline"
    >
      <i class="bi bi-arrow-left"></i> Zurück
    </button>

    <div class="text-center flex-1">
      <h1 class="text-2xl font-bold">
        🏋️ {{ workout?.name || 'Workout' }}
      </h1>
      <p class="text-gray-400 text-sm mt-1">
        {{ workout?.muskelgruppe || '—' }}
      </p>
    </div>

    <button
      @click="$emit('add-exercise')"
      class="btn btn-primary"
    >
      + Übung hinzufügen
    </button>
  </div>

  <!-- Workout Info Panel -->
  <div class="panel mb-10">
    <div class="flex justify-around text-center text-sm">
      <div>
        <p class="text-gray-400">Muskelgruppe</p>
        <p class="text-lg font-semibold">{{ workout?.muskelgruppe || '—' }}</p>
      </div>
      <div>
        <p class="text-gray-400">Tag</p>
        <p class="text-lg font-semibold text-primary">
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

    <div v-if="loading" class="text-center text-gray-400 italic py-8">
      Übungen werden geladen...
    </div>

    <!-- Exercise Grid -->
    <div
      v-else-if="exercises && exercises.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="exercise in exercises"
        :key="exercise.id"
        class="card p-6 hover:-translate-y-1 transition cursor-pointer"
      >
        <div>
          <h3 class="text-lg font-semibold mb-1">
            {{ exercise.name }}
          </h3>

          <p class="text-sm text-gray-400 mb-2">
            {{ exercise.wiederholungen }} Wiederholungen × {{ exercise.saetze }} Sätze
          </p>

          <p v-if="exercise.gewicht" class="text-xs text-gray-500">
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
            class="btn btn-outline"
          >
            <i class="bi bi-pencil"></i>
            Bearbeiten
          </button>

          <button
            @click="$emit('delete-exercise', exercise.id!)"
            class="btn btn-danger"
          >
            <i class="bi bi-trash"></i>
            Löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="panel flex flex-col items-center justify-center py-10 border-dashed border-2 border-gray-border"
    >
      <p class="text-gray-400 mb-4">Noch keine Übungen hinzugefügt</p>
      <button
        @click="$emit('add-exercise')"
        class="btn btn-primary"
      >
        + Übung hinzufügen
      </button>
    </div>
  </section>
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
/* Nichts nötig – alles läuft über main.css */
</style>
