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
          🏋️ {{ plan?.name || 'Trainingsplan' }}
        </h1>
        <p class="text-gray-500 text-sm mt-1">{{ plan?.zielmuskeln }}</p>
      </div>

      <button
        @click="$emit('add-workout')"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition active:scale-95"
      >
        + Workout hinzufügen
      </button>
    </div>

    <!-- Plan Info -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
      <div class="flex justify-around text-center text-sm">
        <div>
          <p class="text-gray-500">Dauer</p>
          <p class="text-lg font-semibold">{{ plan?.dauer }}</p>
        </div>
        <div>
          <p class="text-gray-500">Intensität</p>
          <p class="text-lg font-semibold text-blue-600">{{ plan?.intensitaet }}</p>
        </div>
        <div>
          <p class="text-gray-500">Zielmuskeln</p>
          <p class="text-lg font-semibold">{{ plan?.zielmuskeln }}</p>
        </div>
      </div>
    </div>

    <!-- Workouts -->
    <section>
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        💪 Workouts
      </h2>

      <div v-if="loading" class="text-center text-gray-500 italic py-8">
        Workouts werden geladen...
      </div>

      <div
        v-else-if="workouts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="workout in workouts"
          :key="workout.id"
          @click="$router.push(`/workouts/${workout.id}`)"
          class="cursor-pointer bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold mb-1 text-gray-800">
                {{ workout.name }}
              </h3>
              <p class="text-sm text-gray-500">{{ workout.muskelgruppe }}</p>
              <p class="text-xs text-gray-400 mt-1 italic">
                {{ workout.dayOfWeek }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click.stop="$emit('edit-workout', workout)"
                class="text-blue-500 hover:text-blue-700 transition"
                title="Bearbeiten"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button
                @click.stop="$emit('delete-workout', workout.id)"
                class="text-red-500 hover:text-red-700 transition"
                title="Löschen"
              >
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>

          <!-- Übungen anzeigen -->
          <div v-if="workout.exercises?.length" class="mt-4 border-t pt-3">
            <h4 class="font-medium text-gray-700 mb-2">Übungen:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li
                v-for="ex in workout.exercises"
                :key="ex.id"
                class="flex justify-between"
              >
                <span>{{ ex.name }}</span>
                <span>{{ ex.saetze }}×{{ ex.wiederholungen }} – {{ ex.gewicht }} kg</span>
              </li>
            </ul>
          </div>

          <div v-else class="text-sm text-gray-400 italic mt-3">
            Keine Übungen hinzugefügt
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center text-gray-400 italic py-10 bg-white rounded-xl border border-dashed border-gray-300"
      >
        Noch keine Workouts hinzugefügt
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Exercise {
  id?: number
  name: string
  saetze?: number
  wiederholungen?: number
  gewicht?: number
}

interface Workout {
  id?: number
  name?: string
  muskelgruppe?: string
  dayOfWeek?: string
  exercises?: Exercise[]
}

interface Plan {
  id?: number
  name?: string
  dauer?: string
  intensitaet?: string
  zielmuskeln?: string
}

const props = defineProps<{
  plan?: Plan
  workouts: Workout[]
  loading: boolean
}>()

const plan = computed(() => props.plan)
const workouts = computed(() => props.workouts)
const loading = computed(() => props.loading)

defineEmits<{
  (e: 'add-workout'): void
  (e: 'edit-workout', w: Workout): void
  // allow handlers that return Promise<void> as well
  (e: 'delete-workout', id?: number): unknown
  (e: 'back'): void
}>()
</script>

<style scoped>
/* Keine lokale Animation notwendig — visuelle Effekte über Tailwind/Utilities möglich */
</style>
